#!/usr/bin/env python3
"""Tải cảnh quay nền (b-roll) từ Pixabay (hoặc Pexels) cho một video.

    python3 scripts/broll.py song-o-my-phong-su [--force] [--only intro-0,housing-2]

Cần biến môi trường PIXABAY_API_KEY (miễn phí: đăng ký tài khoản Pixabay, key nằm ở
https://pixabay.com/api/docs/). Ai đã có key Pexels cũ có thể dùng PEXELS_API_KEY.
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
PEXELS_API = "https://api.pexels.com/videos/search"
PIXABAY_API = "https://pixabay.com/api/videos/"
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


def search_pixabay(query, key):
    q = urllib.parse.urlencode({"key": key, "q": query, "video_type": "film", "per_page": 50, "safesearch": "true"})
    data = json.loads(http_get(f"{PIXABAY_API}?{q}"))
    out = []
    for h in data.get("hits", []):
        files = [v for v in h.get("videos", {}).values() if v.get("url") and (v.get("width") or 0) >= 1280]
        if not files:
            continue
        f = min(files, key=lambda v: abs(v["width"] - 1920))
        out.append({
            "id": f"pixabay-{h['id']}", "duration": h.get("duration", 0), "link": f["url"],
            "url": h.get("pageURL", ""), "author": h.get("user", "Pixabay"),
            "authorUrl": f"https://pixabay.com/users/{h.get('user', '')}-{h.get('user_id', '')}/",
            "source": "Pixabay",
        })
    return out


def search_pexels(query, key):
    q = urllib.parse.urlencode({"query": query, "orientation": "landscape", "size": "medium", "per_page": 30})
    data = json.loads(http_get(f"{PEXELS_API}?{q}", {"Authorization": key}))
    out = []
    for v in data.get("videos", []):
        files = [f for f in v["video_files"] if f.get("file_type") == "video/mp4" and (f.get("width") or 0) >= 1280]
        if not files:
            continue
        f = min(files, key=lambda f: abs((f.get("width") or 0) - 1920))
        out.append({
            "id": f"pexels-{v['id']}", "duration": v["duration"], "link": f["link"], "url": v["url"],
            "author": v["user"]["name"], "authorUrl": v["user"]["url"], "source": "Pexels",
        })
    return out


def search(query, keys, need):
    """Tìm ở mọi nguồn có key; ưu tiên clip đủ dài, rồi clip dài hơn."""
    found = []
    for name, fn in (("pixabay", search_pixabay), ("pexels", search_pexels)):
        if keys.get(name):
            try:
                found += fn(query, keys[name])
            except Exception as e:  # noqa: BLE001
                print(f"    ! {name}: {e}")
    return sorted(found, key=lambda v: (v["duration"] < need + 1, -min(v["duration"], 30)))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug")
    ap.add_argument("--force", action="store_true", help="tải lại cả những cảnh đã có")
    ap.add_argument("--only", help="chỉ tải các cảnh này, ví dụ intro-0,housing-2")
    args = ap.parse_args()

    keys = {"pixabay": os.environ.get("PIXABAY_API_KEY"), "pexels": os.environ.get("PEXELS_API_KEY")}
    if not any(keys.values()):
        sys.exit("Thiếu PIXABAY_API_KEY. Đăng ký miễn phí tại https://pixabay.com, key nằm ở https://pixabay.com/api/docs/ "
                 "rồi đặt biến môi trường PIXABAY_API_KEY.")

    shots = json.loads((ROOT / "src/videos" / args.slug / "shots.json").read_text(encoding="utf-8"))["scenes"]
    out_dir = ROOT / "public/broll" / args.slug
    out_dir.mkdir(parents=True, exist_ok=True)
    man_path = out_dir / "manifest.json"
    manifest = json.loads(man_path.read_text(encoding="utf-8")) if man_path.exists() else {"shots": {}}
    needs = shot_needs(args.slug, shots)
    only = set(args.only.split(",")) if args.only else None
    used = {v.get("sourceId") for v in manifest["shots"].values() if v.get("sourceId")}
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
            candidates = [v for v in search(it["query"], keys, need) if v["id"] not in used]
            for video in candidates:
                tmp = out_dir / f"{sid}.download.mp4"
                try:
                    tmp.write_bytes(http_get(video["link"]))
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
                    "sourceId": video["id"],
                    "source": video["source"],
                    "url": video["url"],
                    "author": video["author"],
                    "authorUrl": video["authorUrl"],
                }
                man_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
                print(f"    ✓ {video['duration']}s — {video['author']} ({video['source']})")
                break
            else:
                print("    ! không tìm được clip phù hợp — hãy đổi từ khóa trong shots.json")

    missing = [f"{s}-{i}" for s, items in shots.items() for i in range(len(items)) if f"{s}-{i}" not in manifest["shots"]]
    credits = sorted({(v.get("source", "Pexels"), v["author"], v["authorUrl"]) for v in manifest["shots"].values()})
    (out_dir / "credits.txt").write_text(
        "Video nền: Pixabay / Pexels\n" + "\n".join(f"- {a} ({src}): {u}" for src, a, u in credits) + "\n",
        encoding="utf-8",
    )
    print(f"Xong. Có {len(manifest['shots'])} cảnh quay; thiếu {len(missing)}: {', '.join(missing) or 'không'}")
    print(f"Ghi công tác giả (dán vào mô tả YouTube): {(out_dir / 'credits.txt').relative_to(ROOT)}")


if __name__ == "__main__":
    main()
