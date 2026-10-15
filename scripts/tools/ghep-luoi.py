"""Ghép ảnh trong một thư mục thành các bảng lưới 3×4 (bang-0.jpg, bang-1.jpg…) để xem nhanh.
  python scripts/tools/ghep-luoi.py out/kiem-tra/<slug>
"""
import glob, sys
from PIL import Image, ImageDraw
d = sys.argv[1]
fs = sorted(f for f in glob.glob(f'{d}/*.jpg') if '/bang-' not in f.replace('\\', '/'))
for k in range(0, len(fs), 12):
    ims = fs[k:k + 12]; w, h = Image.open(ims[0]).size
    s = Image.new('RGB', (w * 3, h * 4), 'black'); dr = ImageDraw.Draw(s)
    for i, f in enumerate(ims):
        x, y = (i % 3) * w, (i // 3) * h; s.paste(Image.open(f), (x, y)); dr.text((x + 4, y + 4), f.replace('\\', '/').split('/')[-1], fill='yellow')
    s.save(f'{d}/bang-{k // 12}.jpg', quality=80)
print('Xong', (len(fs) + 11) // 12, 'bảng')
