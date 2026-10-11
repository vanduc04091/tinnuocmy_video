#!/usr/bin/env python3
"""Tạo giọng đọc bằng Edge TTS cho một video.

    python3 scripts/tts.py song-o-my-1-thang [--force] [--voice vi-VN-HoaiMyNeural]

Đọc  src/videos/<slug>/narration.json  (+ cấu hình chung src/shared/channel.json)
Ghi  public/audio/<slug>/<scene>.mp3   và  public/audio/<slug>/manifest.json
     (manifest chứa thời lượng, phụ đề theo từng câu và mốc {marker} để hình khớp lời).

Cú pháp trong "text":
    [hiển thị|đọc]  -> phụ đề hiện "hiển thị", giọng đọc đọc "đọc"
    {key}           -> mốc thời gian, không được đọc
Cảnh nào không đổi lời/giọng sẽ được bỏ qua (dùng lại mp3 cũ), trừ khi có --force.
"""
import argparse
import asyncio
import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

try:
    import edge_tts
except ImportError:
    sys.exit("Chưa cài edge-tts. Chạy:  pip install edge-tts")

if hasattr(sys.stdout, "reconfigure"):  # console Windows mặc định không phải UTF-8
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
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
    return nbytes * 8 / 48_000  # edge-tts: mp3 48 kbps mono


async def synth(spoken, voice, rate, pitch, out_path):
    comm = edge_tts.Communicate(spoken, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
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
        located.append((idx, start, end))
        cursor = idx + len(text)
    return located


def make_timer(spoken, located, duration):
    if located:
        def start_at(i):
            for idx, start, _ in located:
                if idx >= i:
                    return start
            return located[-1][2]

        def end_at(i):
            best = located[0][2]
            for idx, _, end in located:
                if idx < i:
                    best = end
            return best
        return start_at, end_at
    n = max(len(spoken), 1)
    prop = lambda i: duration * min(i, n) / n  # noqa: E731
    return prop, prop


def build_scene(scene, cfg, out_dir, force):
    display, spoken, segments, markers = parse(scene["text"])
    key = hashlib.sha1(f'{spoken}|{cfg["voice"]}|{cfg["rate"]}|{cfg["pitch"]}'.encode()).hexdigest()[:12]
    mp3 = out_dir / f'{scene["id"]}.mp3'
    cache = out_dir / f'{scene["id"]}.words.json'

    if not force and mp3.exists() and cache.exists():
        cached = json.loads(cache.read_text(encoding="utf-8"))
        if cached.get("hash") == key:
            words, nbytes = [tuple(w) for w in cached["words"]], mp3.stat().st_size
            print(f'  = {scene["id"]} (giữ nguyên)')
            return finish(scene, display, spoken, segments, markers, words, mp3, nbytes, key)

    print(f'  > {scene["id"]} ...', flush=True)
    words, nbytes = asyncio.run(synth(spoken, cfg["voice"], cfg["rate"], cfg["pitch"], mp3))
    cache.write_text(json.dumps({"hash": key, "words": words}, ensure_ascii=False), encoding="utf-8")
    return finish(scene, display, spoken, segments, markers, words, mp3, nbytes, key)


def finish(scene, display, spoken, segments, markers, words, mp3, nbytes, key):
    duration = audio_duration(mp3, nbytes)
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

    out_dir = ROOT / "public/audio" / args.slug
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f'Giọng: {cfg["voice"]}  tốc độ: {cfg["rate"]}  ->  {out_dir.relative_to(ROOT)}')

    scenes = [build_scene(s, cfg, out_dir, args.force) for s in narration["scenes"]]
    manifest = {"slug": args.slug, "voice": cfg["voice"], "rate": cfg["rate"], "scenes": scenes}
    (out_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    total = sum(s["durationSec"] for s in scenes)
    print(f"Xong: {len(scenes)} cảnh, tổng lời đọc {total / 60:.1f} phút.")


if __name__ == "__main__":
    main()
