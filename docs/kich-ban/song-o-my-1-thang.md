# Kịch bản — Sống ở Mỹ một tháng hết bao nhiêu tiền?

- **Kênh:** Tin Nước Mỹ
- **Khán giả:** người Việt đang sống ở Mỹ; người ở Việt Nam chuẩn bị sang Mỹ du học, làm việc, định cư
- **Giọng:** `vi-VN-NamMinhNeural` (nam, trầm, rõ, hợp nội dung tài chính cho người lớn), tốc độ `-4%`
- **Thời lượng dự kiến:** ~5,5 phút
- **Lời đọc thật sự dùng để dựng video:** `src/videos/song-o-my-1-thang/narration.json`
  (file này là bản để đọc/duyệt; khi sửa lời thoại, sửa ở `narration.json`)

---

## Phần 1 — Tự review bản nháp v1

Bản nháp v1 nằm ở `song-o-my-1-thang-v1-nhap.md`. Đọc lại, tôi thấy các vấn đề sau:

| # | Vấn đề ở v1 | Vì sao không ổn | Cách sửa trong bản cuối |
|---|---|---|---|
| 1 | Mở đầu bằng lời chào + xin đăng ký kênh | 10 giây đầu quyết định người xem có ở lại không; xin đăng ký khi chưa cho giá trị gì là phản cảm | Mở bằng con số gây tò mò ("3.000 đô một tháng — ở Việt Nam là mơ ước, ở Mỹ chỉ vừa đủ"), lời chào để sau hook, kêu gọi đăng ký dời xuống cuối |
| 2 | Tổng $3.926 cộng lẫn các giả định mâu thuẫn | Lấy chi phí **xe mới** (có khấu hao) và bảo hiểm **tự mua chưa trợ cấp** — trường hợp xấu nhất — nhưng lại lấy ăn uống ở mức **tiết kiệm nhất**. Kết quả vừa sai vừa có độ chính xác giả (đến từng đô) | Mỗi khoản nêu nguồn số liệu, rồi chọn **một con số thực tế, tròn** cho bảng tính, giải thích lý do chọn. Tổng: $3.350 |
| 3 | Không nói rõ trước thuế / sau thuế | Người xem dễ nhầm "lương 3.000 đô là đủ" | Nói rõ đây là chi tiêu **sau thuế**, thêm phần "cần thu nhập trước thuế bao nhiêu" |
| 4 | Chỉ một con số cho cả nước Mỹ | Chênh lệch giữa New York và thành phố nhỏ lên tới hơn 2 lần; khán giả du học sinh không có xe, ở ghép | Thêm phần so sánh 3 kịch bản: thành phố nhỏ, thành phố đắt đỏ, du học sinh |
| 5 | Viết tắt USDA, AAA, KFF, ACA | Khán giả lớn tuổi không biết; giọng TTS tiếng Việt đọc viết tắt tiếng Anh rất khó nghe | Lời đọc dùng tên tiếng Việt ("Bộ Nông nghiệp Mỹ", "Hiệp hội Ô tô Mỹ", "sàn bảo hiểm của chính phủ"); tên viết tắt chỉ hiện trên màn hình ở dòng nguồn |
| 6 | Số viết kiểu "$1,518" | TTS dễ đọc sai dấu phẩy kiểu Mỹ; người Việt quen dấu chấm phân cách hàng nghìn | Màn hình/phụ đề hiện "$1.518"; giọng đọc dùng chữ ("một ngàn năm trăm mười tám đô") qua cú pháp `[hiển thị|đọc]` |
| 7 | Không ghi thời điểm của số liệu | Chi phí thay đổi hằng năm, video sẽ bị chê "số cũ" | Ghi tháng/năm của từng nguồn trên màn hình, nói "số liệu mới nhất năm 2026" |
| 8 | Chỉ liệt kê số, không có lời khuyên | Người xem không biết làm gì với thông tin | Thêm mẹo thực tế ở từng phần (chợ Á Đông, bảo hiểm xe cho người mới đến, cấp cứu khi không có bảo hiểm) và 3 lời khuyên cuối video |
| 9 | Thiếu quy đổi sang tiền Việt | Khán giả ở Việt Nam cần hình dung | Quy đổi tổng ra "hơn 85 triệu đồng" |
| 10 | Xưng hô "các bạn" | Video cho người lớn, khán giả Việt ở Mỹ quen giọng truyền thông "quý vị" | Dùng "quý vị và các bạn" ở lời chào, "quý vị" trong thân bài |
| 11 | Quá ngắn (~1,5 phút), nhịp đều đều | Không đủ chiều sâu, khó giữ chân | Mở rộng lên ~5,5 phút, chia chương rõ ràng, có thanh "ngân sách đang cộng dồn" trên màn hình |
| 12 | CTA cuối chung chung | "Nhiều hay ít?" khó trả lời | Hỏi cụ thể: "Quý vị sống ở đâu và chi phí mỗi tháng là bao nhiêu?" — dễ bình luận, tăng tương tác |

**Kiểm tra lại các con số trong bản cuối**

- Bảng tính: 1.500 + 250 + 500 + 650 + 150 + 300 = **3.350** ✔
- Thành phố nhỏ: nhà 1.000 + tiện ích 220 + ăn 450 + xe 600 + bảo hiểm 150 + khác 250 ≈ **2.700** ✔
- New York (không xe): nhà ~4.580 + tiện ích 250 + ăn 650 + vé tàu tháng ~135 + bảo hiểm 150 + khác 400 ≈ **6.150** → nói "khoảng 6.000 đô hoặc hơn" ✔
- Du học sinh: phòng ở ghép 700–1.000 + tiện ích 80 + ăn 400 + điện thoại 30 + bảo hiểm trường ~170–330 + khác 150 ≈ **1.500–2.000** (chưa học phí) ✔
- Thu nhập: 3.350 × 12 = 40.200 đô chi tiêu/năm. Lương 55.000 đô trước thuế, độc thân, sau thuế liên bang + FICA + thuế tiểu bang ~5% còn ~44.000 đô → dư ~4.000 đô/năm ✔ ("55.000 đô trở lên")
- Quy đổi: 3.350 × ~26.000 đ ≈ 87 triệu → "hơn 85 triệu đồng" ✔

---

## Phần 2 — Kịch bản cuối

Ký hiệu: **[HÌNH]** = nội dung trên màn hình. Lời thoại in nghiêng.

### Cảnh 1 — Hook (≈20s)
**[HÌNH]** Con số $3.000/tháng đếm lên giữa màn hình. Hai dòng đối lập: 🇻🇳 "Thu nhập mơ ước" / 🇺🇸 "Chỉ vừa đủ trang trải". Câu hỏi tiêu đề hiện ra.

*3.000 đô la một tháng. Ở Việt Nam, đó là thu nhập mà nhiều người mơ ước. Nhưng ở Mỹ, với không ít người, con số này chỉ vừa đủ để trang trải. Vậy rốt cuộc, sống ở Mỹ một tháng hết bao nhiêu tiền? Hôm nay, chúng ta sẽ tính từng khoản một, dựa trên số liệu mới nhất năm 2026.*

### Cảnh 2 — Giả định (≈30s)
**[HÌNH]** Danh sách 5 giả định, mỗi dòng có icon.

*Xin chào quý vị và các bạn, đây là Tin Nước Mỹ. Để con số có ý nghĩa, chúng ta cần thống nhất vài giả định. Đây là chi phí cho một người độc thân, thuê một căn hộ một phòng ngủ, sống ở một thành phố có mức giá trung bình, và đi làm bằng xe hơi riêng, như phần lớn người Mỹ. Tất cả là tiền chi tiêu sau thuế. Cuối video, chúng ta sẽ xem con số thay đổi thế nào nếu quý vị sống ở New York, ở một thành phố nhỏ, hay là du học sinh.*

### Cảnh 3 — Khoản 1: Nhà ở (≈45s)
**[HÌNH]** Biểu đồ cột ngang: Toàn quốc $1.518 / San Francisco $4.400 / New York $4.580. Ghi chú: "Thu nhập ≈ 3× tiền thuê", "Cọc 1–2 tháng". Chốt: $1.500. Nguồn: Zumper, 9/2026.

*Khoản đầu tiên, và cũng là khoản lớn nhất: tiền nhà. Theo dữ liệu giá thuê tháng Chín năm 2026, giá thuê trung vị của một căn hộ một phòng ngủ trên toàn nước Mỹ là khoảng 1.518 đô. Nhưng con số này che giấu một khoảng cách rất lớn. Ở New York, căn một phòng ngủ có giá trung vị khoảng 4.580 đô. San Francisco cũng xấp xỉ 4.400 đô. Một lưu ý thực tế: chủ nhà ở Mỹ thường yêu cầu thu nhập gấp khoảng ba lần tiền thuê, và quý vị nên chuẩn bị sẵn tiền cọc, thường từ một đến hai tháng tiền nhà. Trong bảng tính của chúng ta, tiền nhà là 1.500 đô mỗi tháng.*

### Cảnh 4 — Khoản 2: Tiện ích (≈35s)
**[HÌNH]** 3 thẻ: Điện – nước – gas – rác $100–250 / Internet $60–80 / Điện thoại $30–50. Chốt: $250.

*Tiếp theo là các hóa đơn tiện ích. Điện, nước, gas và rác cho một căn hộ nhỏ thường rơi vào khoảng 100 đến 250 đô, tùy mùa và tùy tiểu bang. Mùa hè ở Texas hay mùa đông ở vùng Trung Tây có thể đẩy hóa đơn lên khá cao. Internet tốc độ cao khoảng 60 đến 80 đô. Điện thoại di động, nếu chọn các nhà mạng giá rẻ, chỉ khoảng 30 đến 50 đô. Cộng lại, chúng ta tính 250 đô cho nhóm này.*

### Cảnh 5 — Khoản 3: Ăn uống (≈40s)
**[HÌNH]** Thẻ "Tự nấu, mức tiết kiệm: $250–320" (USDA, 6/2026), "Một bữa trưa bên ngoài: $15–20 + tip", mẹo chợ Á Đông. Chốt: $500.

*Về ăn uống. Bộ Nông nghiệp Mỹ ước tính, một người trưởng thành tự nấu ăn ở mức tiết kiệm cần khoảng 250 đến 320 đô mỗi tháng. Nhưng thực tế, ít ai tự nấu đủ cả ba bữa. Một bữa trưa ở ngoài thường từ 15 đến 20 đô, chưa kể tiền tip. Vì vậy, một ngân sách thực tế hơn, gồm đi chợ và thỉnh thoảng ăn ngoài, là khoảng 500 đô một tháng. Mẹo nhỏ: các chợ Á Đông và chợ Việt thường rẻ hơn đáng kể cho những món ăn quen thuộc.*

### Cảnh 6 — Khoản 4: Xe hơi (≈45s)
**[HÌNH]** Biểu đồ: Xe mới $965/tháng (AAA 2025) vs Xe cũ $600–700. Cảnh báo: bảo hiểm cao với người mới đến. Chốt: $650.

*Khoản thứ tư có thể khiến nhiều người bất ngờ: chiếc xe. Theo Hiệp hội Ô tô Mỹ, chi phí sở hữu một chiếc xe mới, tính cả khấu hao, bảo hiểm, xăng và bảo dưỡng, là khoảng 11.577 đô một năm, tức gần 965 đô mỗi tháng. Nếu mua một chiếc xe cũ đáng tin cậy, con số này có thể giảm xuống khoảng 600 đến 700 đô, gồm tiền góp xe, bảo hiểm, xăng và sửa chữa. Riêng bảo hiểm xe cho người mới đến Mỹ, chưa có lịch sử lái xe, thường cao hơn mức trung bình. Chúng ta chọn 650 đô cho khoản này.*

### Cảnh 7 — Khoản 5: Bảo hiểm sức khỏe (≈45s)
**[HÌNH]** Biểu đồ: Qua công ty ~$120 vs Tự mua (40 tuổi, chưa trợ cấp) $625 (KFF 2026). Cảnh báo cấp cứu. Chốt: $150.

*Và đây là khoản mà người mới sang thường bỏ sót: bảo hiểm sức khỏe. Nếu quý vị đi làm toàn thời gian, công ty thường trả phần lớn phí bảo hiểm; phần người lao động đóng trung bình chỉ khoảng 120 đô mỗi tháng. Nhưng nếu tự mua trên sàn bảo hiểm của chính phủ, theo một tổ chức nghiên cứu y tế độc lập, phí trung bình năm 2026 cho một người bốn mươi tuổi là 625 đô mỗi tháng, trước khi được trợ cấp. Đừng bao giờ sống ở Mỹ mà không có bảo hiểm: chỉ một lần vào phòng cấp cứu có thể tốn hàng ngàn đô. Trong bảng tính, chúng ta giả định quý vị có bảo hiểm qua công ty: 150 đô, đã gồm các khoản đồng chi trả.*

### Cảnh 8 — Khoản 6: Chi tiêu khác (≈25s)
**[HÌNH]** Lưới icon: quần áo, đồ dùng cá nhân, cắt tóc, giặt đồ, giải trí, đi chơi. Chốt: $300.

*Cuối cùng là những khoản nhỏ, nhưng cộng lại không hề nhỏ: quần áo, đồ dùng cá nhân, cắt tóc, giặt đồ, các gói xem phim, một buổi đi chơi cuối tuần. Ở mức tiết chế, chúng ta tính khoảng 300 đô mỗi tháng. Và đó là chưa kể tiền gửi về gia đình, hay tiết kiệm cho tương lai.*

### Cảnh 9 — Tổng kết (≈40s)
**[HÌNH]** Hóa đơn (receipt) từng dòng hiện ra, tổng $3.350 ≈ 85+ triệu đồng. Dòng "Thu nhập trước thuế nên có: ≥ $55.000/năm".

*Giờ hãy cộng tất cả lại. Tiền nhà 1.500. Tiện ích 250. Ăn uống 500. Xe hơi 650. Bảo hiểm sức khỏe 150. Chi tiêu khác 300. Tổng cộng: khoảng 3.350 đô một tháng, tương đương hơn 85 triệu đồng. Để chi tiêu được như vậy sau thuế mà vẫn để dành được một ít, thu nhập trước thuế của quý vị nên ở mức khoảng 55.000 đô một năm trở lên.*

### Cảnh 10 — Ba kịch bản khác (≈40s)
**[HÌNH]** 3 thẻ: Thành phố nhỏ ~$2.700 / New York, San Francisco ~$6.000+ / Du học sinh $1.500–2.000 (chưa học phí).

*Nhưng như đã nói, nơi quý vị sống quyết định phần lớn chi phí. Ở một thành phố nhỏ hoặc vùng ven, với tiền nhà khoảng một ngàn đô, tổng chi phí có thể chỉ khoảng 2.700 đô. Ngược lại, ở New York hay San Francisco, dù có thể bỏ xe để đi tàu điện, tiền nhà hơn bốn ngàn đô sẽ đẩy tổng chi phí lên khoảng 6.000 đô hoặc hơn. Còn với du học sinh, ở ghép với bạn, không có xe, dùng bảo hiểm của trường, chi phí sinh hoạt thường vào khoảng 1.500 đến 2.000 đô mỗi tháng, chưa tính học phí.*

### Cảnh 11 — Ba lời khuyên (≈35s)
**[HÌNH]** 3 mục đánh số.

*Vậy làm sao để giảm chi phí? Có ba điều quý vị nên làm ngay. Một: giữ tiền nhà dưới khoảng ba mươi phần trăm thu nhập; ở ghép là cách tiết kiệm nhanh nhất trong những năm đầu. Hai: mua xe cũ đáng tin cậy, và so sánh giá bảo hiểm xe ở nhiều hãng mỗi năm. Ba: xây dựng lịch sử tín dụng càng sớm càng tốt, vì điểm tín dụng tốt giúp quý vị thuê nhà dễ hơn, vay mua xe và mua nhà với lãi suất thấp hơn.*

### Cảnh 12 — Kết (≈25s)
**[HÌNH]** Con số $3.350/tháng, câu hỏi bình luận, nút đăng ký. Dòng nhỏ: "Số liệu tham khảo, không phải tư vấn tài chính."

*Tóm lại, một người độc thân ở thành phố có mức giá trung bình cần khoảng 3.350 đô mỗi tháng để sống ổn định ở Mỹ. Còn quý vị đang sống ở đâu, và chi phí mỗi tháng của quý vị là bao nhiêu? Hãy chia sẻ ở phần bình luận để mọi người cùng tham khảo. Nếu thấy video hữu ích, đừng quên đăng ký kênh Tin Nước Mỹ. Hẹn gặp lại quý vị trong video tiếp theo.*

---

## Nguồn số liệu

- Zumper National Rent Report, 9/2026 — 1PN toàn quốc $1.518, New York $4.580, San Francisco $4.400 (qua [WLRN](https://www.wlrn.org/business/2026-10-06/at-2-500-for-one-bedroom-apartment-miami-ranks-sixth-most-expensive-among-u-s-cities))
- USDA Official Food Plans, Thrifty Food Plan 6/2026 — nam 20–50 tuổi $318,50, nữ $253,40/tháng ([USDA FNS](https://fns-prod.azureedge.us/sites/default/files/resource-files/cnpp-costfood-june2026.pdf))
- AAA Your Driving Costs 2025 — $11.577/năm ≈ $964,78/tháng ([AAA Newsroom](https://newsroom.aaa.com/2025/09/aaa-new-vehicle-costs-drop-to-11577/))
- KFF, phí benchmark ACA 2026 cho người 40 tuổi: $625/tháng ([Becker's, dẫn KFF](https://www.beckerspayer.com/payer/aca/states-ranked-by-average-aca-benchmark-premiums-in-2026/))
- KFF Employer Health Benefits Survey 2025 — người lao động đóng trung bình ~$1.440/năm cho gói cá nhân (~$120/tháng)
- Tiện ích, internet, điện thoại, ăn ngoài: ước tính tổng hợp, làm tròn

---

## Phần 3 — Review video (bản dựng)

Đã render bản xem thử (chưa có giọng, thời lượng ước lượng ~6,5 phút) và kiểm tra từng cảnh.

| # | Vấn đề tìm thấy ở bản dựng đầu | Đã sửa |
|---|---|---|
| 1 | Chữ, biểu đồ, thẻ số liệu quá nhỏ so với khung 1080p, nhiều khoảng trống — khó đọc trên điện thoại/TV | Tăng cỡ chữ ~20–30%, cột biểu đồ cao 92px, số liệu 52–74px |
| 2 | Cảnh mở đầu bị dồn lên nửa trên màn hình | Căn giữa lại, phóng to con số $3.000 |
| 3 | Thẻ so sánh: "$1.500–2.000" và "New York, San Francisco" bị xuống dòng | Đổi tiêu đề thành "Thành phố đắt đỏ", đưa tên thành phố xuống dòng chi tiết, chặn xuống dòng con số |
| 4 | Phụ đề ngắt giữa cụm từ ("vùng Trung / Tây", "một phòng / ngủ") | Nới giới hạn 86 ký tự/câu phụ đề, chỉ tách câu ở dấu câu; thêm dấu phẩy vào câu dài |
| 5 | Hóa đơn tổng kết tràn xuống vùng phụ đề, thẻ "Hơn 85 triệu đồng" chạm mép phải | Thu gọn hóa đơn, giảm cỡ số ở cột phải |
| 6 | Câu hỏi cuối video rớt một chữ xuống dòng riêng | Nới rộng khung, cân dòng tự động |

Đã kiểm tra thêm: font tiếng Việt hiển thị đủ dấu; ô "Ngân sách tháng" cộng dồn đúng 1.500 → 1.750 → 2.250 → 2.900 → 3.050 → 3.350;
mỗi con số trên màn hình khớp lời đọc; nguồn số liệu hiện ở góc dưới mỗi cảnh; audio được ghép đúng vị trí từng cảnh.

**Cần nghe lại sau khi tạo giọng trên PC:** cách giọng `vi-VN-NamMinhNeural` đọc "New York", "San Francisco", "Texas", "tip", "gas".
Nếu đọc chưa hay, sửa vế "đọc" trong `narration.json`, ví dụ `[New York|Niu Oóc]`, rồi chạy lại `npm run tts`.

### Review sau khi có giọng đọc thật (Edge TTS, vi-VN-NamMinhNeural)

- Lời đọc: 12/12 cảnh có mốc thời gian từng từ; hình và phụ đề khớp đúng câu đọc.
- Khoảng lặng giữa các cảnh lúc đầu là 2,3 giây (hụt nhịp) → giảm khoảng đệm đầu/cuối cảnh còn 0,2 s / 0,3 s.
- Âm lượng tổng chỉ -19,8 LUFS, nhỏ hơn chuẩn YouTube (-14 LUFS; YouTube không tự tăng âm lượng)
  → `npm run render` tự chuẩn hóa về -14 LUFS sau khi render.
- Nghỉ giữa các câu khoảng 1 giây: giữ nguyên, nhịp chậm rõ hợp khán giả lớn tuổi.
