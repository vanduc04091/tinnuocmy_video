# Tin Nước Mỹ — video YouTube bằng Remotion

Video tiếng Việt cho người Việt ở Mỹ và người chuẩn bị sang Mỹ du học, định cư.
Giọng đọc tạo bằng **Edge TTS**, hình ảnh dựng bằng **Remotion** (React).

## Cấu trúc thư mục

```
src/
├── index.ts, Root.tsx        # điểm vào Remotion, tự đăng ký mọi video trong registry
├── shared/                   # ── DÙNG CHUNG cho mọi video ──
│   ├── channel.json          # tên kênh, giọng đọc mặc định, fps, kích thước
│   ├── theme.ts, format.ts   # màu sắc, font, định dạng tiền ($1.518)
│   ├── fonts.ts              # font Be Vietnam Pro (đủ dấu tiếng Việt)
│   ├── defineVideo.tsx       # ghép lời đọc + audio + hình thành một video
│   ├── narration/            # đọc manifest audio, tính thời gian từng cảnh, phụ đề
│   ├── components/           # nền, logo, phụ đề, biểu đồ, thẻ số liệu, ô ngân sách…
│   ├── broll/                # cảnh quay nền: đổi cảnh theo lời đọc, chuyển mờ, đẩy máy chậm
│   ├── overlays/             # đồ họa phóng sự: khung số liệu, nhãn địa danh, tiêu đề chương, bản đồ Mỹ
│   └── layouts/              # bố cục cảnh: mở đầu, khoản chi, danh sách, hóa đơn, so sánh, kết
└── videos/                   # ── RIÊNG từng video ──
    ├── registry.ts           # danh sách video
    └── song-o-my-phong-su/   (và song-o-my-1-thang/ — bản slide cũ)
        ├── narration.json    # LỜI ĐỌC (sửa lời ở đây)
        ├── shots.json        # danh sách cảnh quay nền (từ khóa tìm kiếm) — chỉ video phóng sự
        └── index.tsx         # đồ họa từng cảnh, số liệu
scripts/
├── tts.py                    # tạo giọng đọc (ElevenLabs hoặc Edge TTS) + phụ đề + mốc thời gian
├── broll.py                  # tải cảnh quay từ Pixabay/Pexels theo shots.json
├── music.py                  # tổng hợp nhạc nền + hiệu ứng âm thanh
└── render.mjs                # render ra out/
docs/kich-ban/                # kịch bản, bản review, nguồn số liệu
public/audio/                 # giọng đọc + mốc thời gian (có trên git)
out/                          # video thành phẩm (không đưa lên git)
```

## Render trên PC (chỉ 2 bước)

Kịch bản, giọng đọc (`public/audio/`) và file SEO (`docs/youtube/`) đều có sẵn trên GitHub.
Trên PC chỉ cần tải cảnh quay rồi render — **không** chạy `npm run tts` (tốn credit ElevenLabs).

Lần đầu: cài [Node.js 20+](https://nodejs.org) và [Python 3.9+](https://www.python.org), rồi

```bash
git clone https://github.com/vanduc04091/tinnuocmy_video.git
cd tinnuocmy_video
git checkout claude/gracious-faraday-5b34co
npm install
copy .env.example .env          # Windows; macOS/Linux: cp .env.example .env
```

Mở `.env`, điền `PIXABAY_API_KEY=...` (lấy ở https://pixabay.com/api/docs/ khi đã đăng nhập).

Mỗi lần có tập mới:

```bash
git pull
npm run broll -- <tên-video>     # 1. tải cảnh quay (miễn phí)
npm run render -- <tên-video>    # 2. render -> out/<tên-video>.mp4 (1080p, -14 LUFS)
```

| Tập | `<tên-video>` | SEO |
|---|---|---|
| 1 | `song-o-my-phong-su` | `docs/youtube/tap-01-song-o-my-bao-nhieu-tien.md` |
| 2 | `luong-4000-usd` | `docs/youtube/tap-02-luong-4000-usd.md` |
| 3 | `california-vs-texas` | `docs/youtube/tap-03-california-vs-texas.md` |
| 4 | `gia-dinh-4-nguoi` | `docs/youtube/tap-04-gia-dinh-4-nguoi.md` |
| 5 | `luong-cao-kho-tiet-kiem` | `docs/youtube/tap-05-luong-cao-kho-tiet-kiem.md` |
| 6 | `chi-phi-o-to` | `docs/youtube/tap-06-chi-phi-o-to.md` |
| 7 | `du-hoc-my-chi-phi` | `docs/youtube/tap-07-du-hoc-my-chi-phi.md` |
| 8 | `kham-benh-o-my` | `docs/youtube/tap-08-kham-benh-o-my.md` |
| 9 | `lam-nail-o-my` | `docs/youtube/tap-09-lam-nail-o-my.md` |
| 10 | `mua-nha-o-my` | `docs/youtube/tap-10-mua-nha-o-my.md` |

Render xong, video được gom vào **`out/Tap-XX-<tên-video>/`** cùng mọi thứ cần để đăng YouTube:
video `.mp4`, `youtube.md` (tiêu đề, mô tả, tags, cài đặt), `thumbnail.jpg`,
`thumb-test-A/B/C.jpg` (Test & Compare), `phu-de.vi.srt` (phụ đề), `nguon-canh-quay.txt`.
Video đã render từ trước: chạy `npm run dong-goi` để gom lại.

**Thumbnail:** 3 mẫu mỗi tập đã có sẵn trong `thumbnails/<tên-video>-a.jpg`, `-b.jpg`, `-c.jpg` (dùng với Test & Compare).
Sửa chữ ở `src/thumbnails/list.ts` rồi `npm run thumbs` (hoặc `npm run thumbs -- <tên-video>`).

**Chiến lược kênh, lịch đăng, mẫu báo cáo:** `docs/chien-luoc-kenh.md`.

## Tạo giọng đọc mới (chỉ khi sửa lời đọc)

Cần `pip install edge-tts numpy` và `ELEVENLABS_API_KEY` trong `.env`, rồi `npm run tts -- <tên-video>` —
chỉ những cảnh bị sửa lời mới gọi ElevenLabs. Nhớ commit lại `public/audio/<tên-video>/`.

## Giọng đọc

Mỗi video chọn giọng trong `narration.json`:

- **ElevenLabs** (đang dùng cho tập 1 và 2): khối `"tts": {"provider": "elevenlabs", "voiceId": "...", "model": "eleven_v3"}`.
  Giọng hiện tại: *Hien – Warm and Deep Broadcaster* (nữ, Hà Nội). Đổi giọng: thay `voiceId` bằng mã giọng tiếng Việt khác
  trong thư viện ElevenLabs (Voice Library → lọc Vietnamese), rồi `npm run tts -- <slug> --force`.
  Lưu ý: `eleven_multilingual_v2` **không** hỗ trợ tiếng Việt — dùng `eleven_v3` hoặc `eleven_turbo_v2_5`.
- **Edge TTS** (miễn phí): bỏ khối `tts`, đặt `"voice": "vi-VN-HoaiMyNeural"`.
- `"tighten": {"sentence": 0.5, "comma": 0.25}` rút ngắn khoảng nghỉ quá dài sau dấu câu (giây).

## Tập 1 (bản phóng sự, cảnh quay thật): `song-o-my-phong-su`

```bash
npm run tts -- song-o-my-phong-su        # 1. giọng đọc (ElevenLabs, cần ELEVENLABS_API_KEY)
npm run broll -- song-o-my-phong-su      # 2. tải cảnh quay từ Pixabay (cần PIXABAY_API_KEY)
npm run render -- song-o-my-phong-su     # 3. render -> out/song-o-my-phong-su.mp4
```

- **PIXABAY_API_KEY**: đăng ký tài khoản miễn phí tại https://pixabay.com, key hiện ở https://pixabay.com/api/docs/
  (Windows PowerShell: `$env:PIXABAY_API_KEY="..."`, macOS/Linux: `export PIXABAY_API_KEY=...`).
  Pexels đã tạm dừng cấp key mới (10/2026); ai còn key Pexels cũ có thể đặt thêm `PEXELS_API_KEY`.
- Cảnh quay chưa ưng: sửa từ khóa trong `shots.json` rồi `npm run broll -- song-o-my-phong-su --force --only housing-2`,
  hoặc chép video của bạn vào `public/broll/song-o-my-phong-su/housing-2.mp4`.
- Tên tác giả cảnh quay (dán vào mô tả YouTube): `public/broll/<slug>/credits.txt`.
- Nhạc nền + hiệu ứng (`public/sound/`) do `npm run music` tự tổng hợp — không vướng bản quyền.

## Bản cũ dạng slide: `song-o-my-1-thang`

```bash
npm run tts -- song-o-my-1-thang       # 1. tạo giọng đọc (cần internet)
npm run render -- song-o-my-1-thang    # 2. render -> out/song-o-my-1-thang.mp4
```

Xem trước / chỉnh sửa trực quan: `npm run studio` (mở trình duyệt).

- Đổi giọng: sửa `voice` trong `src/shared/channel.json`, hoặc chạy thử
  `npm run tts -- song-o-my-1-thang --voice vi-VN-HoaiMyNeural --force`.
  Giọng tiếng Việt của Edge: `vi-VN-NamMinhNeural` (nam, mặc định) và `vi-VN-HoaiMyNeural` (nữ).
- Sửa lời: sửa `narration.json` rồi chạy lại `npm run tts` — chỉ cảnh bị đổi mới được tạo lại.
- Nhạc nền (tùy chọn): chép file vào `public/music/` rồi thêm `music: {src: 'music/ten-file.mp3'}`
  trong `defineVideo(...)` của video.

## Cú pháp lời đọc (`narration.json`)

```
"[1.518 đô|một ngàn năm trăm mười tám đô]"  phụ đề hiện vế trái, giọng đọc vế phải
"{pick}Trong bảng tính..."                  mốc thời gian, hình nào có at="pick" sẽ hiện đúng lúc này
```

Viết số/viết tắt tiếng Anh bằng chữ ở vế "đọc" để giọng TTS đọc tự nhiên.

## Thêm video mới

1. Tạo `src/videos/<slug>/narration.json` (danh sách cảnh `{id, text}`).
2. Tạo `src/videos/<slug>/index.tsx`: `export default defineVideo({id, narration, scenes: {...}})`,
   mỗi cảnh dùng lại các layout trong `src/shared/layouts`.
3. Thêm vào `src/videos/registry.ts`.
4. `npm run tts -- <slug>` rồi `npm run render -- <slug>`.
