#!/usr/bin/env python3
"""Tạo giọng đọc (Edge TTS hoặc ElevenLabs) cho một video.

    python3 scripts/tts.py song-o-my-1-thang [--force] [--voice vi-VN-HoaiMyNeural]

Đọc  src/videos/<slug>/narration.json  (+ cấu hình chung src/shared/channel.json)
Ghi  public/audio/<slug>/<scene>.mp3   và  public/audio/<slug>/manifest.json
     (manifest chứa thời lượng, phụ đề theo từng câu và mốc {marker} để hình khớp lời).

Cú pháp trong "text":
    [hiển thị|đọc]  -> phụ đề hiện "hiển thị", giọng đọc đọc "đọc"
    {key}           -> mốc thời gian, không được đọc
Cảnh nào không đổi lời/giọng sẽ được bỏ qua (dùng lại mp3 cũ), trừ khi có --force.

Chọn ElevenLabs bằng khối "tts" trong narration.json:
    "tts": {"provider": "elevenlabs", "voiceId": "...", "model": "eleven_multilingual_v2"}
Key đọc từ biến môi trường ELEVENLABS_API_KEY hoặc file .env ở thư mục dự án (không đưa lên git).
"""
import argparse
import asyncio
import base64
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

try:
    import edge_tts
except ImportError:
    edge_tts = None

if hasattr(sys.stdout, "reconfigure"):  # console Windows mặc định không phải UTF-8
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent


def load_dotenv():
    """Nạp biến từ file .env ở thư mục dự án (KEY=giá trị mỗi dòng) nếu chưa có trong môi trường."""
    env = ROOT / ".env"
    if not env.exists():
        return
    for line in env.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
TOKEN = re.compile(r"\[([^|\]]+)\|([^\]]+)\]|\{(\w+)\}")
MAX_CUE_CHARS = 86
TICKS = 10_000_000  # edge-tts dùng đơn vị 100ns


def parse(text):
    """Trả về (display, spoken, segments, markers).

    segments: danh sách (d0, d1, s0, s1) ánh xạ đoạn hiển thị <-> đoạn đọc.
    markers:  {key: (vị trí trong display, vị trí trong spoken)}
    """
    display, spoken, segments, markers = "", "", [], {}
    pos = 0

    def push(d, s):
        nonlocal display, spoken
        segments.append((len(display), len(display) + len(d), len(spoken), len(spoken) + len(s)))
        display += d
        spoken += s

    for m in TOKEN.finditer(text):
        if m.start() > pos:
            plain = text[pos:m.start()]
            push(plain, plain)
        if m.group(3):
            markers[m.group(3)] = (len(display), len(spoken))
        else:
            push(m.group(1), m.group(2))
        pos = m.end()
    if pos < len(text):
        push(text[pos:], text[pos:])
    return display, spoken, segments, markers


def d2s(segments, d, end=False):
    for d0, d1, s0, s1 in segments:
        if d0 <= d < d1 or (end and d == d1):
            if d1 - d0 == s1 - s0:  # đoạn chữ thường: ánh xạ 1-1
                return s0 + (d - d0)
            return s1 if end else s0
    return segments[-1][3] if segments else 0


def split_cues(display):
    """Chia phụ đề theo câu, câu dài thì tách ở dấu phẩy / hai chấm gần giữa nhất."""
    ranges, a = [], 0
    for m in re.finditer(r"[.?!]+(?=\s|$)", display):
        ranges.extend(_trimmed(display, a, m.end()))
        a = m.end()
    ranges.extend(_trimmed(display, a, len(display)))
    return [r for a, b in ranges for r in _split_long(display, a, b)]


def _trimmed(text, a, b):
    while a < b and text[a] == " ":
        a += 1
    while b > a and text[b - 1] == " ":
        b -= 1
    return [(a, b)] if a < b else []


def _split_long(text, a, b):
    if b - a <= MAX_CUE_CHARS:
        return [(a, b)]
    mid = (a + b) // 2
    cuts = [i + 1 for i in range(a + 14, b - 14) if text[i] in ",:;" and text[i + 1] == " "]
    if not cuts:
        cuts = [i for i in range(a + 14, b - 14) if text[i] == " "]
    if not cuts:
        return [(a, b)]
    cut = min(cuts, key=lambda i: abs(i - mid))
    left, right = _trimmed(text, a, cut), _trimmed(text, cut, b)
    return [r for x, y in left + right for r in _split_long(text, x, y)]


def audio_duration(path, nbytes):
    if shutil.which("ffprobe"):
        try:
            out = subprocess.run(
                ["ffprobe", "-v", "error", "-show_entries", "format=duration",
                 "-of", "default=nw=1:nk=1", str(path)],
                capture_output=True, text=True, check=True,
            ).stdout.strip()
            return float(out)
        except Exception:
            pass
    return nbytes * 8 / 48_000  # edge-tts: mp3 48 kbps mono (ElevenLabs luôn qua bước tighten hoặc ffprobe)


def synth_elevenlabs(spoken, tts, out_path):
    """ElevenLabs: trả về mốc từng từ (dựng từ mốc từng ký tự của API with-timestamps)."""
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("Thiếu ELEVENLABS_API_KEY (đặt biến môi trường hoặc thêm vào file .env).")
    body = json.dumps({
        "text": spoken,
        "model_id": tts.get("model", "eleven_multilingual_v2"),
        "language_code": tts.get("language", "vi"),
        "voice_settings": tts.get("settings", {"stability": 0.5, "similarity_boost": 0.8, "style": 0.15, "use_speaker_boost": True, "speed": 1.0}),
    }).encode()
    url = f'https://api.elevenlabs.io/v1/text-to-speech/{tts["voiceId"]}/with-timestamps?output_format=mp3_44100_128'
    req = urllib.request.Request(url, data=body, headers={"xi-api-key": key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=300) as res:
            data = json.loads(res.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs lỗi {e.code}: {e.read().decode(errors='ignore')[:300]}")
    audio = base64.b64decode(data["audio_base64"])
    out_path.write_bytes(audio)
    al = data.get("alignment") or data.get("normalized_alignment") or {}
    words, cur, start, end = [], "", None, None
    for ch, st, en in zip(al.get("characters", []), al.get("character_start_times_seconds", []), al.get("character_end_times_seconds", [])):
        if ch.isspace():
            if cur:
                words.append((cur, start, end))
            cur, start = "", None
            continue
        if start is None:
            start = st
        cur += ch
        end = en
    if cur:
        words.append((cur, start, end))
    # bỏ dấu câu dính ở hai đầu từ để định vị trong câu
    words = [(w.strip(".,:;?!\"'“”()…"), a, b) for w, a, b in words]
    return [w for w in words if w[0]], len(audio)


async def synth(spoken, voice, rate, pitch, out_path):
    # Dùng proxy hệ thống nếu có (edge-tts không tự đọc biến môi trường HTTPS_PROXY)
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy") or None
    comm = edge_tts.Communicate(spoken, voice, rate=rate, pitch=pitch, boundary="WordBoundary", proxy=proxy)
    audio = bytearray()
    words = []
    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            audio.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            start = chunk["offset"] / TICKS
            words.append((chunk["text"], start, start + chunk["duration"] / TICKS))
    out_path.write_bytes(bytes(audio))
    return words, len(audio)


def locate_words(spoken, words):
    """Gắn mỗi từ edge-tts trả về với vị trí ký tự trong câu đọc."""
    located, cursor, low = [], 0, spoken.lower()
    for text, start, end in words:
        idx = low.find(text.lower(), cursor)
        if idx < 0:
            continue
        located.append((idx, start, end, idx + len(text)))
        cursor = idx + len(text)
    return located


def ffmpeg_cmd():
    if shutil.which("ffmpeg"):
        return ["ffmpeg"]
    return ["npx.cmd" if os.name == "nt" else "npx", "remotion", "ffmpeg"]


def tighten_audio(mp3, spoken, words, cfg):
    """Rút ngắn khoảng nghỉ dài giữa các từ (Edge TTS nghỉ ~1 giây sau mỗi dấu chấm).

    Dựa vào mốc từng từ: khoảng lặng sau dấu chấm/hỏi/than còn `sentence` giây, sau dấu phẩy còn `comma` giây.
    Trả về (words đã dời mốc, thời lượng mới) — hoặc None nếu không làm được (thiếu numpy/ffmpeg).
    """
    try:
        import numpy as np
    except ImportError:
        print("    ! chưa cài numpy — bỏ qua bước làm giọng trôi chảy (pip install numpy)")
        return None
    sr = 24000
    ff = ffmpeg_cmd()
    raw = subprocess.run(ff + ["-v", "error", "-i", str(mp3), "-f", "f32le", "-ac", "1", "-ar", str(sr), "-"],
                         capture_output=True, check=True).stdout
    pcm = np.frombuffer(raw, dtype=np.float32)
    located = locate_words(spoken, words)
    if len(located) < 2:
        return None
    cuts = []  # (bắt đầu, kết thúc) tính bằng giây
    lead = located[0][1]
    if lead > 0.08:
        cuts.append((0.0, lead - 0.08))
    for (i0, s0, e0, end_idx), (i1, s1, _, _) in zip(located, located[1:]):
        between = spoken[end_idx:i1]
        target = cfg["sentence"] if any(c in between for c in ".?!") else cfg["comma"] if any(c in between for c in ",;:") else None
        gap = s1 - e0
        if target is not None and gap > target + 0.04:
            cuts.append((e0 + target / 2, s1 - target / 2))
    tail = located[-1][2] + 0.25
    total = len(pcm) / sr
    if total > tail:
        cuts.append((tail, total))

    keep, prev = [], 0.0
    for a, b in cuts:
        keep.append((prev, a))
        prev = b
    keep.append((prev, total))
    fade = int(0.008 * sr)
    pieces = []
    for a, b in keep:
        seg = pcm[int(a * sr):int(b * sr)].copy()
        if len(seg) > 2 * fade:
            seg[:fade] *= np.linspace(0, 1, fade)
            seg[-fade:] *= np.linspace(1, 0, fade)
        pieces.append(seg)
    out = np.concatenate(pieces) if pieces else pcm
    subprocess.run(ff + ["-y", "-v", "error", "-f", "f32le", "-ar", str(sr), "-ac", "1", "-i", "-",
                         "-c:a", "libmp3lame", "-b:a", "64k", str(mp3)], input=out.tobytes(), check=True)

    def remap(t):
        removed = 0.0
        for a, b in cuts:
            if t >= b:
                removed += b - a
            elif t > a:
                removed += t - a
        return t - removed

    new_words = [(w, round(remap(st), 3), round(remap(en), 3)) for w, st, en in words]
    return new_words, len(out) / sr


def speed_up(mp3, words, tempo):
    """Tăng tốc độ đọc, giữ nguyên cao độ giọng (ffmpeg atempo); co mốc từng từ theo cùng tỷ lệ."""
    tmp = mp3.with_suffix(".tmp.mp3")
    subprocess.run(ffmpeg_cmd() + ["-y", "-v", "error", "-i", str(mp3), "-filter:a", f"atempo={tempo}",
                                   "-c:a", "libmp3lame", "-b:a", "128k", str(tmp)], check=True)
    tmp.replace(mp3)
    return [(w, round(a / tempo, 3), round(b / tempo, 3)) for w, a, b in words]


def make_timer(spoken, located, duration):
    if located:
        def start_at(i):
            for idx, start, _, _ in located:
                if idx >= i:
                    return start
            return located[-1][2]

        def end_at(i):
            best = located[0][2]
            for idx, _, end, _ in located:
                if idx < i:
                    best = end
            return best
        return start_at, end_at
    n = max(len(spoken), 1)
    prop = lambda i: duration * min(i, n) / n  # noqa: E731
    return prop, prop


def build_scene(scene, cfg, out_dir, force):
    display, spoken, segments, markers = parse(scene["text"])
    tighten = cfg.get("tighten")
    tts = cfg.get("tts") or {}
    provider = f'|{json.dumps(tts, sort_keys=True)}' if tts.get("provider") == "elevenlabs" else ""
    key = hashlib.sha1(f'{spoken}|{cfg["voice"]}|{cfg["rate"]}|{cfg["pitch"]}{f"|{tighten}" if tighten else ""}{provider}'.encode()).hexdigest()[:12]
    mp3 = out_dir / f'{scene["id"]}.mp3'
    cache = out_dir / f'{scene["id"]}.words.json'

    if not force and mp3.exists() and cache.exists():
        cached = json.loads(cache.read_text(encoding="utf-8"))
        if cached.get("hash") == key:
            words, nbytes = [tuple(w) for w in cached["words"]], mp3.stat().st_size
            print(f'  = {scene["id"]} (giữ nguyên)')
            return finish(scene, display, spoken, segments, markers, words, mp3, nbytes, key, cached.get("duration"))

    print(f'  > {scene["id"]} ...', flush=True)
    if provider:
        words, nbytes = synth_elevenlabs(spoken, tts, mp3)
        duration_hint = nbytes * 8 / 128_000  # mp3_44100_128
    else:
        if edge_tts is None:
            sys.exit("Chưa cài edge-tts. Chạy:  pip install edge-tts")
        words, nbytes = asyncio.run(synth(spoken, cfg["voice"], cfg["rate"], cfg["pitch"], mp3))
        duration_hint = None
    duration = None
    tempo = float(tts.get("tempo", 1.0)) if provider else 1.0
    if tempo != 1.0:
        words = speed_up(mp3, words, tempo)
        duration_hint = duration_hint / tempo if duration_hint else None
    if tighten:
        res = tighten_audio(mp3, spoken, words, tighten)
        if res:
            words, duration = res
    duration = duration or (None if shutil.which("ffprobe") else duration_hint)
    cache.write_text(json.dumps({"hash": key, "words": words, "duration": duration}, ensure_ascii=False), encoding="utf-8")
    return finish(scene, display, spoken, segments, markers, words, mp3, nbytes, key, duration)


def finish(scene, display, spoken, segments, markers, words, mp3, nbytes, key, duration=None):
    duration = duration or audio_duration(mp3, nbytes)
    located = locate_words(spoken, words)
    if not located:
        print(f'    ! {scene["id"]}: không có mốc từng từ, chia thời gian theo độ dài chữ')
    start_at, end_at = make_timer(spoken, located, duration)

    cues = []
    for a, b in split_cues(display):
        s0, s1 = d2s(segments, a), d2s(segments, b, end=True)
        start, end = start_at(s0), end_at(s1)
        if end <= start:
            end = start + 0.8
        cues.append({"text": display[a:b], "start": round(start, 3), "end": round(end, 3)})
    for i in range(len(cues) - 1):  # nối liền các câu để phụ đề không nháy
        if cues[i + 1]["start"] - cues[i]["end"] < 0.6:
            cues[i]["end"] = cues[i + 1]["start"]

    return {
        "id": scene["id"],
        "file": mp3.name,
        "hash": key,
        "durationSec": round(duration, 3),
        "cues": cues,
        "markers": {k: round(start_at(s), 3) for k, (_, s) in markers.items()},
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug", help="tên thư mục trong src/videos/")
    ap.add_argument("--force", action="store_true", help="tạo lại toàn bộ audio")
    ap.add_argument("--voice", help="ghi đè giọng, ví dụ vi-VN-HoaiMyNeural")
    ap.add_argument("--rate", help='ghi đè tốc độ, ví dụ "-5%%"')
    args = ap.parse_args()

    cfg = json.loads((ROOT / "src/shared/channel.json").read_text(encoding="utf-8"))
    src = ROOT / "src/videos" / args.slug / "narration.json"
    if not src.exists():
        sys.exit(f"Không tìm thấy {src}")
    narration = json.loads(src.read_text(encoding="utf-8"))
    for k in ("voice", "rate", "pitch"):
        cfg[k] = getattr(args, k, None) or narration.get(k) or cfg[k]
    cfg["tighten"] = narration.get("tighten")  # rút ngắn khoảng nghỉ cho giọng trôi chảy (tùy chọn)
    cfg["tts"] = narration.get("tts")  # {"provider": "elevenlabs", ...} hoặc bỏ trống = Edge TTS
    load_dotenv()

    out_dir = ROOT / "public/audio" / args.slug
    out_dir.mkdir(parents=True, exist_ok=True)
    if cfg["tts"] and cfg["tts"].get("provider") == "elevenlabs":
        print(f'Giọng ElevenLabs: {cfg["tts"].get("name", cfg["tts"]["voiceId"])}  ->  {out_dir.relative_to(ROOT)}')
    else:
        print(f'Giọng: {cfg["voice"]}  tốc độ: {cfg["rate"]}  ->  {out_dir.relative_to(ROOT)}')

    scenes = [build_scene(s, cfg, out_dir, args.force) for s in narration["scenes"]]
    manifest = {"slug": args.slug, "voice": cfg["voice"], "rate": cfg["rate"], "scenes": scenes}
    (out_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    total = sum(s["durationSec"] for s in scenes)
    print(f"Xong: {len(scenes)} cảnh, tổng lời đọc {total / 60:.1f} phút.")


if __name__ == "__main__":
    main()
