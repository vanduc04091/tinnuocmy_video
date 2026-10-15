"""Xem trước ứng viên Pixabay để chọn cảnh quay (công cụ cho người/Claude review, không phải bước render).

  python scripts/tools/ung-vien-canh-quay.py <slug>                 -> mọi cảnh trong shots.json
  python scripts/tools/ung-vien-canh-quay.py <slug> hook housing    -> chỉ các cảnh này
  python scripts/tools/ung-vien-canh-quay.py <slug> --q "hook-2=family dinner" "tips-0=piggy bank"   -> thử từ khóa mới

Kết quả: out/ung-vien/<slug>/<cảnh>.jpg (lưới 6 ảnh mỗi dòng, ghi "<shot> #<số> <giây>")
và out/ung-vien/<slug>/ung-vien.json (id Pixabay). Chọn xong ghi id vào src/videos/<slug>/shots.json
rồi `npm run broll -- <slug> --force --only <shot>`.
"""
import importlib.util, json, os, sys, urllib.parse, urllib.request, concurrent.futures as cf
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('broll', ROOT / 'scripts' / 'broll.py'); broll = importlib.util.module_from_spec(spec); spec.loader.exec_module(broll)
broll.load_dotenv()
KEY = os.environ['PIXABAY_API_KEY']
UA = {'User-Agent': 'tinnuocmy-video/1.0'}

def get(u):
    for _ in range(3):
        try:
            return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60).read()
        except Exception:  # noqa: BLE001
            pass
    raise RuntimeError(u)

def search(q, need):
    hits = json.loads(get('https://pixabay.com/api/videos/?' + urllib.parse.urlencode({'key': KEY, 'q': q, 'video_type': 'film', 'per_page': 30, 'safesearch': 'true'})))['hits']
    return [h for h in hits if h['duration'] >= min(need, 12) and h['videos']['large']['width'] >= 1920][:6]

def sheet(rows, path):
    out = Image.new('RGB', (1920, 180 * len(rows)), 'black'); d = ImageDraw.Draw(out)
    for r, (sid, hits) in enumerate(rows):
        thumbs = list(cf.ThreadPoolExecutor(6).map(lambda h: get(h['videos']['medium']['thumbnail']), hits))
        for k, (h, data) in enumerate(zip(hits, thumbs)):
            tmp = path.parent / '_t.jpg'; tmp.write_bytes(data)
            im = Image.open(tmp).convert('RGB').resize((320, 180)); x, y = k * 320, r * 180
            out.paste(im, (x, y)); d.rectangle([x, y, x + 150, y + 16], fill='black'); d.text((x + 3, y + 2), f"{sid} #{k} {h['duration']}s", fill='yellow')
    out.save(path, quality=85)

def main():
    slug, rest = sys.argv[1], sys.argv[2:]
    shots = json.loads((ROOT / 'src/videos' / slug / 'shots.json').read_text('utf8'))['scenes']
    needs = broll.shot_needs(slug, shots)
    out = ROOT / 'out' / 'ung-vien' / slug; out.mkdir(parents=True, exist_ok=True)
    result = {}
    if rest[:1] == ['--q']:
        rows = []
        for arg in rest[1:]:
            sid, q = arg.split('=', 1); hits = search(q, needs.get(sid, 8)); rows.append((sid, hits))
            result[sid] = [{'id': h['id'], 'dur': h['duration'], 'q': q} for h in hits]
        sheet(rows, out / 'tu-khoa-moi.jpg')
    else:
        for scene, items in shots.items():
            if rest and scene not in rest:
                continue
            rows = []
            for i, it in enumerate(items):
                sid = f'{scene}-{i}'; hits = search(it['query'], needs[sid]); rows.append((sid, hits))
                result[sid] = [{'id': h['id'], 'dur': h['duration'], 'q': it['query']} for h in hits]
            sheet(rows, out / f'{scene}.jpg')
    (out / '_t.jpg').unlink(missing_ok=True)
    old = json.loads((out / 'ung-vien.json').read_text('utf8')) if (out / 'ung-vien.json').exists() else {}
    (out / 'ung-vien.json').write_text(json.dumps({**old, **result}, ensure_ascii=False, indent=1), 'utf8')
    print('Xong:', out)

main()
