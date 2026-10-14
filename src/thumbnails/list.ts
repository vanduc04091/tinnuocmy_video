import type {ThumbProps} from './Thumbnail';

/**
 * Ba mẫu thumbnail cho mỗi tập (a, b, c) — dùng với "Test & Compare" của YouTube Studio.
 * Ảnh nền: public/thumbs/bg/<tên>.jpg (khung hình lấy từ cảnh quay của chính tập đó).
 * Render: npm run thumbs   ->  thumbnails/<slug>-a.jpg ...
 */
export const thumbnails: Record<string, {a: ThumbProps; b: ThumbProps; c: ThumbProps}> = {
  'song-o-my-phong-su': {
    a: {kind: 'so', bg: 'ep1-empire', kicker: 'SỐNG Ở MỸ 1 THÁNG', big: '$3.000', unit: '+', line: 'Con số thật năm 2026', badge: '≈ 80 TRIỆU'},
    b: {kind: 'hoi', bg: 'ep1-worried', top: 'Sống ở Mỹ 1 tháng', hi: 'HẾT BAO NHIÊU?', badge: '2026'},
    c: {kind: 'vs', left: {bg: 'ep1-suburb', name: 'HOUSTON', value: '$3.000'}, right: {bg: 'ep1-night', name: 'QUẬN CAM', value: '$4.600'}, bottom: '1 THÁNG SỐNG Ở MỸ'},
  },
  'luong-4000-usd': {
    a: {kind: 'so', bg: 'ep2-cash', kicker: 'LƯƠNG Ở MỸ', big: '$4.000', unit: '/th', line: 'Đủ sống hay chật vật?', badge: 'Về tay $3.396'},
    b: {kind: 'hoi', bg: 'ep2-nyc', top: 'Lương $4.000 ở Mỹ', hi: 'DƯ HAY THIẾU?', color: 'red'},
    c: {kind: 'vs', left: {bg: 'ep2-city', name: 'HOUSTON', value: 'ĐỦ'}, right: {bg: 'ep2-bridge', name: 'QUẬN CAM', value: 'KHÓ', color: 'red'}, bottom: 'LƯƠNG $4.000/THÁNG'},
  },
  'california-vs-texas': {
    a: {kind: 'vs', left: {bg: 'ep3-coast', name: 'CALIFORNIA'}, right: {bg: 'ep3-txflag', name: 'TEXAS'}, bottom: 'SỐNG ĐÂU RẺ HƠN?'},
    b: {kind: 'hoi', bg: 'ep3-road', top: 'California hay Texas', hi: 'AI THẮNG?', badge: '5 HIỆP'},
    c: {kind: 'so', bg: 'ep3-dollar', kicker: 'CALIFORNIA vs TEXAS', big: '0%', line: 'Thuế thu nhập ở Texas', color: 'teal', badge: 'Nhưng…'},
  },
  'gia-dinh-4-nguoi': {
    a: {kind: 'so', bg: 'ep4-family', kicker: 'GIA ĐÌNH 4 NGƯỜI Ở MỸ', big: '$7.000', unit: '/th', line: '≈ 180 triệu đồng', badge: '2026'},
    b: {kind: 'hoi', bg: 'ep4-baby', top: 'Ở Mỹ, tiền giữ trẻ', hi: 'ĐẮT HƠN TIỀN NHÀ!', color: 'red'},
    c: {kind: 'vs', left: {bg: 'ep4-night', name: 'HOUSTON', value: '$102K'}, right: {bg: 'ep4-beach', name: 'QUẬN CAM', value: '$164K', color: 'red'}, bottom: 'THU NHẬP CẦN CÓ / NĂM'},
  },
  'luong-cao-kho-tiet-kiem': {
    a: {kind: 'so', bg: 'ep5-worried', kicker: 'LƯƠNG CAO Ở MỸ', big: '$150.000', line: 'Vẫn hết tiền?', badge: '46%', side: 'right'},
    b: {kind: 'hoi', bg: 'ep5-office', top: 'Lương 3,9 tỷ/năm', hi: 'TIỀN ĐI ĐÂU HẾT?', color: 'red'},
    c: {kind: 'so', bg: 'ep5-goldengate', kicker: 'LƯƠNG $12.500/THÁNG', big: '$675', line: 'Còn lại cuối tháng', color: 'red'},
  },
  'chi-phi-o-to': {
    a: {kind: 'so', bg: 'ep6-wheel', kicker: 'NUÔI 1 CHIẾC XE Ở MỸ', big: '$1.070', unit: '/th', line: '≈ 28 triệu đồng', badge: 'Giá xe chỉ là phần nổi'},
    b: {kind: 'hoi', bg: 'ep6-redcar', top: 'Mua xe ở Mỹ', hi: 'TỐN BAO NHIÊU?', badge: '2026'},
    c: {kind: 'vs', left: {bg: 'ep3-coast', name: 'CALIFORNIA', value: '$1.894'}, right: {bg: 'ep3-txflag', name: 'TEXAS', value: '$3.652', color: 'red'}, bottom: 'BẢO HIỂM XE / NĂM'},
  },
  'du-hoc-my-chi-phi': {
    a: {kind: 'so', bg: 'ep7-students', kicker: '1 NĂM DU HỌC MỸ', big: '2,7 TỶ', line: 'Từ visa đến tấm bằng', color: 'gold', badge: '2026'},
    b: {kind: 'vs', left: {bg: 'ep7-study', name: 'CAO ĐẲNG', value: '700tr'}, right: {bg: 'ep7-university', name: 'ĐẠI HỌC TƯ', value: '2,7 tỷ', color: 'red'}, bottom: 'MỘT NĂM DU HỌC MỸ'},
    c: {kind: 'hoi', bg: 'ep7-university', top: 'Du học Mỹ', hi: 'TIẾT KIỆM 3 TỶ?', color: 'teal'},
  },
  'kham-benh-o-my': {
    a: {kind: 'so', bg: 'ep8-crib', kicker: 'SINH CON Ở MỸ', big: '$20.000', line: 'Hơn nửa tỷ đồng?', color: 'red'},
    b: {kind: 'hoi', bg: 'ep8-ambulance', top: 'Một lần cấp cứu ở Mỹ', hi: '$2.453', color: 'red', badge: 'Có bảo hiểm?'},
    c: {kind: 'hoi', bg: 'ep8-doctor', top: 'Bảo hiểm y tế Mỹ', hi: 'TRẢ BAO NHIÊU?'},
  },
  'lam-nail-o-my': {
    a: {kind: 'so', bg: 'ep9-pink', kicker: 'LÀM NAIL Ở MỸ', big: '$5.300', unit: '/th?', line: 'Sự thật ít ai nói', side: 'right'},
    b: {kind: 'hoi', bg: 'ep9-salon', top: 'Nghề nail người Việt', hi: 'GIÀU THẬT KHÔNG?'},
    c: {kind: 'so', bg: 'ep9-gloves', kicker: 'THỢ NAIL Ở MỸ', big: '1/2', line: 'là người Việt', color: 'teal', badge: 'Lương thật?'},
  },
  'mua-nha-o-my': {
    a: {kind: 'so', bg: 'ep10-house', kicker: 'MUA NHÀ Ở MỸ', big: '$3.100', unit: '/th', line: 'Nhà $330K · Houston', badge: 'Không cần đủ 20%'},
    b: {kind: 'vs', left: {bg: 'ep10-suburb', name: 'HOUSTON', value: '$330K'}, right: {bg: 'ep10-oc', name: 'QUẬN CAM', value: '$1,22 triệu', color: 'red'}, bottom: 'GIÁ NHÀ TRUNG VỊ 2026'},
    c: {kind: 'hoi', bg: 'ep10-suburb', top: 'Mua nhà ở Mỹ', hi: 'CẦN BAO NHIÊU?'},
  },
};
