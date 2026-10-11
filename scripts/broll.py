#!/usr/bin/env python3
"""Tải cảnh quay nền (b-roll) từ Pexels cho một video.

    python3 scripts/broll.py song-o-my-phong-su [--force] [--only intro-0,housing-2]

Cần biến môi trường PEXELS_API_KEY (lấy miễn phí tại https://www.pexels.com/api/).
Nên chạy SAU `npm run tts` để biết mỗi cảnh quay cần dài bao nhiêu giây.

Đọc  src/videos/<slug>/shots.json  (+ public/audio/<slug>/manifest.json nếu có)
Ghi  public/broll/<slug>/<scene>-<n>.mp4  và  public/broll/<slug>/manifest.json (kèm tên tác giả)
Muốn thay một cảnh bằng video của bạn: chép file vào public/broll/<slug>/<scene>-<n>.mp4
rồi chạy lại script (file có sẵn sẽ được giữ nguyên, trừ khi --force).
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import urllib.parse
import urllib.request
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
API = "https://api.pexels.com/videos/search"
MAX_CLIP_SEC = 20  # cắt bớt để tiết kiệm dung lượng


def http_get(url, headers=None):
    req = urllib.request.Request(url, headers={"User-Agent": "tinnuocmy-video/1.0", **(headers or {})})
    with urllib.request.urlopen(req, timeout=60) as res:
        return res.read()


def ffmpeg_cmd():
    if shutil.which("ffmpeg"):
        return ["ffmpeg"]
    npx = "npx.cmd" if os.name == "nt" else "npx"
    return [npx, "remotion", "ffmpeg"]  # ffmpeg đi kèm Remotion


def shot_needs(slug, shots):
    """Số giây mỗi cảnh quay sẽ xuất hiện (ước lượng từ audio, mặc định 6 giây)."""
    cfg = json.loads((ROOT / "src/shared/channel.json").read_text(encoding="utf-8"))
    path = ROOT / "public/audio" / slug / "manifest.json"
    audio = {s["id"]: s for s in json.loads(path.read_text(encoding="utf-8"))["scenes"]} if path.exists() else {}
    needs = {}
    for scene, items in shots.items():
        a = audio.get(scene)
        length = (a["durationSec"] + cfg["sceneLeadInSec"] + cfg["sceneTailSec"]) if a else None
        starts = []
        for it in items:
            at = it["at"]
            t = at if isinstance(at, (int, float)) else (a["markers"].get(at, 0) + cfg["sceneLeadInSec"] if a else 0)
            starts.append(t + it.get("offset", 0))
        for i, it in enumerate(items):
            end = starts[i + 1] if i + 1 < len(items) else (length or starts[i] + 6)
            needs[f"{scene}-{i}"] = max(3.0, end - starts[i])
    return needs


def search(query, key, need):
    q = urllib.parse.urlencode({"query": query, "orientation": "landscape", "size": "medium", "per_page": 30})
    data = json.loads(http_get(f"{API}?{q}", {"Authorization": key}))
    videos = data.get("videos", [])
    # Ưu tiên clip đủ dài, rồi tới clip dài nhất
    return sorted(videos, key=lambda v: (v["duration"] < need + 1, -min(v["duration"], 30)))


def best_file(video):
    files = [f for f in video["video_files"] if f.get("file_type") == "video/mp4" and (f.get("width") or 0) >= 1280]
    if not files:
        return None
    return min(files, key=lambda f: abs((f.get("width") or 0) - 1920))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug")
    ap.add_argument("--force", action="store_true", help="tải lại cả những cảnh đã có")
    ap.add_argument("--only", help="chỉ tải các cảnh này, ví dụ intro-0,housing-2")
    args = ap.parse_args()

    key = os.environ.get("PEXELS_API_KEY")
    if not key:
        sys.exit("Thiếu PEXELS_API_KEY. Lấy key miễn phí tại https://www.pexels.com/api/ rồi đặt biến môi trường.")

    shots = json.loads((ROOT / "src/videos" / args.slug / "shots.json").read_text(encoding="utf-8"))["scenes"]
    out_dir = ROOT / "public/broll" / args.slug
    out_dir.mkdir(parents=True, exist_ok=True)
    man_path = out_dir / "manifest.json"
    manifest = json.loads(man_path.read_text(encoding="utf-8")) if man_path.exists() else {"shots": {}}
    needs = shot_needs(args.slug, shots)
    only = set(args.only.split(",")) if args.only else None
    used = {v.get("pexelsId") for v in manifest["shots"].values() if v.get("pexelsId")}
    ff = ffmpeg_cmd()

    for scene, items in shots.items():
        for i, it in enumerate(items):
            sid = f"{scene}-{i}"
            dst = out_dir / f"{sid}.mp4"
            if only and sid not in only:
                continue
            if dst.exists() and not args.force and sid in manifest["shots"]:
                print(f"  = {sid} (đã có)")
                continue
            need = needs[sid]
            print(f"  > {sid}: \"{it['query']}\" (cần ~{need:.1f}s)", flush=True)
            try:
                candidates = [v for v in search(it["query"], key, need) if v["id"] not in used]
            except Exception as e:  # noqa: BLE001
                print(f"    ! lỗi tìm kiếm: {e}")
                continue
            for video in candidates:
                f = best_file(video)
                if not f:
                    continue
                tmp = out_dir / f"{sid}.download.mp4"
                try:
                    tmp.write_bytes(http_get(f["link"]))
                    clip = min(video["duration"], MAX_CLIP_SEC, max(need + 2, 8))
                    subprocess.run(
                        ff + ["-y", "-v", "error", "-i", str(tmp), "-t", f"{clip:.2f}", "-an",
                              "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30",
                              "-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-pix_fmt", "yuv420p", str(dst)],
                        check=True,
                    )
                except Exception as e:  # noqa: BLE001
                    print(f"    ! bỏ qua video {video['id']}: {e}")
                    continue
                finally:
                    tmp.unlink(missing_ok=True)
                used.add(video["id"])
                manifest["shots"][sid] = {
                    "file": dst.name,
                    "query": it["query"],
                    "durationSec": round(clip, 2),
                    "pexelsId": video["id"],
                    "url": video["url"],
                    "author": video["user"]["name"],
                    "authorUrl": video["user"]["url"],
                }
                man_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
                print(f"    ✓ {video['duration']}s — {video['user']['name']}")
                break
            else:
                print("    ! không tìm được clip phù hợp — hãy đổi từ khóa trong shots.json")

    missing = [f"{s}-{i}" for s, items in shots.items() for i in range(len(items)) if f"{s}-{i}" not in manifest["shots"]]
    credits = sorted({(v["author"], v["authorUrl"]) for v in manifest["shots"].values()})
    (out_dir / "credits.txt").write_text(
        "Video nền: Pexels (https://www.pexels.com)\n" + "\n".join(f"- {a}: {u}" for a, u in credits) + "\n",
        encoding="utf-8",
    )
    print(f"Xong. Có {len(manifest['shots'])} cảnh quay; thiếu {len(missing)}: {', '.join(missing) or 'không'}")
    print(f"Ghi công tác giả (dán vào mô tả YouTube): {(out_dir / 'credits.txt').relative_to(ROOT)}")


if __name__ == "__main__":
    main()
