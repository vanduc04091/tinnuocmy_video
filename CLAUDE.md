# CLAUDE.md — Kênh YouTube "Tin Nước Mỹ" (@tinnuocmy)

File này tóm tắt toàn bộ những gì chủ kênh và Claude đã thống nhất (từ phiên làm việc trên Claude Code web,
10/2026). Đọc kỹ trước khi làm bất cứ việc gì. Luôn trả lời chủ kênh bằng **tiếng Việt**.

## 1. Kênh là gì

- **Tin Nước Mỹ** — handle **@tinnuocmy** (https://www.youtube.com/@tinnuocmy). Email kênh: nguyenvanduc.tnm@gmail.com.
- Định vị: *"Chi phí, thu nhập và cuộc sống thật ở Mỹ — bằng con số, cho người Việt."*
- Khán giả: người Việt đang ở Mỹ (25–55 tuổi) và người ở Việt Nam định du học/định cư/đoàn tụ.
- Ba trụ nội dung: Tiền & chi phí sống · Việc làm & thu nhập · Du học & định cư. Phong cách chuyên nghiệp, cho người lớn.
- Lịch đăng: thứ Ba và thứ Sáu, 20:00 giờ Houston (8:00 sáng VN). Chiến lược 90 ngày, mẫu báo cáo: `docs/chien-luoc-kenh.md`.
- Vai trò của Claude: "giám đốc chiến lược YouTube" + người làm video. Chủ kênh gửi báo cáo 48 giờ sau mỗi video và
  báo cáo tuần (Chủ nhật), mở đầu "Report tuần N" → Claude chẩn đoán (CTR thấp → sửa thumbnail/tiêu đề; rời sớm → sửa mở đầu),
  đề xuất 2 chủ đề tiếp theo và làm video luôn.

## 2. 10 tập đã xong (đã render, chờ đăng)

| Tập | slug | Ghi chú |
|---|---|---|
| 1 | `song-o-my-phong-su` | Sống ở Mỹ 1 tháng (Houston ~3.000, Quận Cam ~4.600) |
| 2 | `luong-4000-usd` | Lương 4.000 USD/tháng |
| 3 | `california-vs-texas` | So sánh 5 hiệp |
| 4 | `gia-dinh-4-nguoi` | Gia đình 4 người ~7.000/tháng |
| 5 | `luong-cao-kho-tiet-kiem` | Lương 150.000 vẫn khó tiết kiệm |
| 6 | `chi-phi-o-to` | Nuôi xe ~12.900/năm (AAA 2026) |
| 7 | `du-hoc-my-chi-phi` | Du học Mỹ 2026 |
| 8 | `kham-benh-o-my` | Khám bệnh & bảo hiểm y tế |
| 9 | `lam-nail-o-my` | Nghề nail người Việt |
| 10 | `mua-nha-o-my` | Mua nhà (Houston vs Quận Cam) |

`song-o-my-1-thang` là bản slide cũ — không dùng. Thứ tự đăng gợi ý: 1 → 9 → 7 → 2 → 10 → 3 → 8 → 4 → 6 → 5.
10 chủ đề dự phòng ở mục 9 của `docs/chien-luoc-kenh.md`.

## 3. Quy trình làm MỘT tập mới (bắt buộc theo đúng thứ tự)

1. **Chọn chủ đề** (Claude phân tích và đề xuất tiêu đề nếu chủ kênh không đưa).
2. **Nghiên cứu số liệu mới nhất** (2025–2026), nguồn gốc uy tín (BLS, Census, KFF, IRS, NAR, Freddie Mac, AAA…).
   Ghi nguồn cho mọi con số; số chưa xác minh phải ghi "ước tính" hoặc bỏ.
3. **Viết kịch bản** → `src/videos/<slug>/narration.json`. **Rà soát 2 lần** (bản 1 → rà soát lần 1 → bản 2 → rà soát lần 2),
   ghi bảng rà soát + kiểm tra số liệu (tự tính lại mọi phép tính) + nguồn vào `docs/kich-ban/<slug>.md`.
4. **Đồ họa** → `src/videos/<slug>/index.tsx` (dùng lại `src/shared/overlays`, `layouts`, `components`), thêm vào `src/videos/registry.ts`.
5. **Giọng đọc**: `npm run tts -- <slug>` (tốn credit ElevenLabs — chỉ chạy khi lời đọc mới/sửa). Kiểm tra số từ trong
   `public/audio/<slug>/<cảnh>.words.json` khớp kịch bản. **Commit `public/audio/<slug>/` lên git.**
6. **Cảnh quay**: viết `shots.json` (từ khóa ngắn tiếng Anh) → `python scripts/tools/ung-vien-canh-quay.py <slug>` → xem ảnh
   lưới, chọn cảnh **đúng nội dung** (không chọn cảnh lạc đề, khói/mực trừu tượng, cảnh dọc/độ phân giải thấp) → ghi `id`
   vào `shots.json` → `npm run broll -- <slug>`.
7. **Soát khung hình**: `node scripts/tools/anh-kiem-tra.mjs <slug>` + `python scripts/tools/ghep-luoi.py out/kiem-tra/<slug>`
   → xem từng bảng, sửa chồng chữ/tràn khung/thiếu tương phản (thêm `<Dim>`, `side="left"`, `top`, rút gọn chữ…).
8. **Thumbnail**: thêm 3 mẫu (a/b/c) vào `src/thumbnails/list.ts`, ảnh nền vào `public/thumbs/bg/` → `npm run thumbs -- <slug>`.
9. **SEO**: `docs/youtube/tap-XX-<slug>.md` (3 tiêu đề < 70 ký tự, mô tả có mốc chương từ `node scripts/tools/moc-chuong.mjs <slug>`,
   dòng 🔔 đăng ký @tinnuocmy, hashtag `#tinnuocmy` đầu tiên, tags, cài đặt upload). Thêm dòng vào bảng trong README.
10. `npm run typecheck`, commit, push. Chủ kênh chỉ cần `git pull` → `npm run broll` → `npm run render`.

## 3b. Làm Shorts cho một tập (2–3 Short/tập, 30–55 giây)

- Code: `src/videos/<slug>/shorts.tsx` (dùng `defineShort` + khối `Flip`/`Stat`/`Receipt`/`Versus`/`Verdict` trong
  `src/shorts/parts.tsx`), thêm vào `src/shorts/registry.ts`. Mã composition: `short-<slug>-a|b|c`.
- Mỗi Short = các đoạn cắt `{scene, from, to}` (mốc `{marker}` hoặc giây) từ giọng đọc có sẵn — **không chạy tts**.
  2 giây đầu phải là câu hỏi/con số gây tò mò. Phụ đề cụm từ to tự sinh từ `*.words.json`.
- Bố cục chừa vùng giao diện Shorts: trên 0–150, dưới 1460–1920, mép phải từ y≈1100.
- Soát: `node scripts/tools/anh-kiem-tra-short.mjs <id>` + `ghep-luoi.py`. SEO + lịch: `docs/youtube/shorts/tap-XX-<slug>.md`.
- Render: `npm run render -- short-<slug>-a` → tự gom vào `out/Tap-XX-<slug>/shorts/`.
- Đăng Short **sau** tập dài, gắn "Related video" = tập dài. Lịch: 1 Short/ngày vào các ngày không có video dài.

## 4. Quy ước kỹ thuật

- Remotion 4.0.534 + React 19 + TypeScript. 1920×1080, 30fps.
- Lời đọc: `[hiển thị|đọc]` (phụ đề | giọng đọc — số và chữ viết tắt phải viết thành chữ ở vế đọc),
  `{marker}` = mốc thời gian để đồ họa/cảnh quay đổi đúng lúc (`at="marker"`).
- Giọng: ElevenLabs `eleven_v3`, voice **Hien** (`jdlxsPOZOHdGEfcItXVu`), `tempo: 1.12` (tập 3 trở đi), `tighten {sentence: 0.42, comma: 0.2}`.
  `eleven_multilingual_v2` KHÔNG hỗ trợ tiếng Việt.
- Cảnh quay: Pixabay (Pexels đã ngừng cấp key). Ghim `id` trong `shots.json` để tải lại đúng cảnh.
- Nhạc nền + hiệu ứng: tự tổng hợp (`npm run music`), không vướng bản quyền. Âm lượng chuẩn hóa -14 LUFS khi render.
- Tỷ giá dùng trong kịch bản: ~26.000 đ/USD.
- `npm run render -- <slug>` → tự đóng gói vào `out/Tap-XX-<slug>/` (video, `youtube.md`, `thumbnail.jpg`,
  `thumb-test-A/B/C.jpg`, `phu-de.vi.srt`, `nguon-canh-quay.txt`). Đóng gói lại: `npm run dong-goi`.
- Máy chủ kênh: Windows, cmd. Render chạy bằng CPU (~30–60 phút/tập); dùng `--concurrency=4` nếu máy nóng/thiếu RAM.
  `render-qua-dem.bat` render lần lượt nhiều tập.

## 5. Bảo mật & nguyên tắc

- Khóa API (`ELEVENLABS_API_KEY`, `PIXABAY_API_KEY`) chỉ nằm trong `.env` (gitignore). **Không bao giờ** ghi key vào code/commit/chat.
- Video thành phẩm (`out/`) và cảnh quay (`public/broll/`) không đưa lên git. Giọng đọc (`public/audio/`) và thumbnail thì có.
- Không bịa số liệu; số liệu cũ hơn 2025 phải ghi năm. Video luôn có dòng "Số liệu tham khảo, không phải tư vấn…".
- Rủi ro "nội dung không nguyên bản" của YouTube: mỗi tập phải có phép tính/ví dụ riêng; khuyến khích chủ kênh dần dùng giọng thật.

## 6. Việc đang chờ

- Chủ kênh render xong 10 tập, đăng tập 1 vào thứ Ba 20:00 giờ Houston, rồi gửi báo cáo 48 giờ.
- Shorts: đã xong 3 Short tập 1 (16/10/2026). Tiếp theo làm Shorts theo thứ tự đăng: tập 9 → 7 → 2 → 10 → 3 → 8 → 4 → 6 → 5.
- Đề xuất còn để ngỏ: banner phiên bản sáng hợp với avatar mới (`thumbnails/kenh-avatar-sang-1.png` là avatar đang dùng).
- Chủ kênh giao Claude quyết định hướng đi; khi họ hỏi "giờ làm gì tiếp" → chọn việc ưu tiên nhất và làm luôn.
