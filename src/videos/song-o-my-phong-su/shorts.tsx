// Shorts cắt từ tập 1 — dùng lại giọng đọc + cảnh quay, không tạo giọng mới.
// SEO + lịch đăng: docs/youtube/shorts/tap-01-song-o-my-phong-su.md
import {defineShort} from '../../shorts/defineShort';
import {Flip, Receipt, Stat, Verdict, Versus} from '../../shorts/parts';
import video from './index';

const FULL = 'Sống ở Mỹ 1 tháng hết bao nhiêu tiền? Con số thật 2026';

// A — Tổng chi phí 1 tháng ở Houston (~45 giây)
const a = defineShort({
  key: 'a',
  video,
  title: ['SỐNG Ở MỸ 1 THÁNG', 'HẾT BAO NHIÊU TIỀN?'],
  source: 'Người độc thân ở Houston · MIT Living Wage 2026 · Số liệu tham khảo',
  end: {line: FULL},
  clips: [
    {
      scene: 'intro',
      to: 'p1',
      Visual: () => (
        <Flip
          sub="mỗi tháng?"
          steps={[
            {at: 'n30', text: '30 triệu?'},
            {at: 'n50', text: '50 triệu?'},
            {at: 'n100', text: '100+ triệu?', color: 'gold'},
          ]}
        />
      ),
    },
    {
      scene: 'total',
      Visual: () => (
        <>
          <Receipt
            to="income"
            title="Houston · 1 người · mỗi tháng"
            rows={[
              {at: 'l1', label: 'Nhà + điện nước', value: '$1.270'},
              {at: 'l2', label: 'Ăn uống', value: '$325'},
              {at: 'l3', label: 'Đi lại (xe hơi)', value: '$740'},
              {at: 'l4', label: 'Sức khỏe', value: '$270'},
              {at: 'l5', label: 'Internet + điện thoại', value: '$135'},
              {at: 'l6', label: 'Chi tiêu cá nhân', value: '$250'},
            ]}
            total={{at: 'sum', label: 'Tổng cộng', value: '≈ $3.000', sub: '≈ 80 triệu đồng'}}
          />
          <Stat from="income" kicker="Thu nhập cần có" value="$22/giờ" sub="≈ $46.000/năm trước thuế" size={150} />
        </>
      ),
    },
  ],
});

// B — Houston vs Quận Cam (~50 giây)
const b = defineShort({
  key: 'b',
  video,
  title: ['HOUSTON vs QUẬN CAM', 'CHÊNH NHAU BAO NHIÊU?'],
  source: 'Người độc thân · MIT Living Wage, HUD FMR 2026 · Số liệu tham khảo',
  end: {line: FULL},
  clips: [
    {scene: 'states', to: 'diff', Visual: () => <Flip steps={[{at: 'no', text: 'KHÔNG!', color: 'red'}]} />},
    {
      scene: 'total',
      from: 'sum',
      to: 'income',
      Visual: () => <Stat kicker="Houston, Texas · mỗi tháng" value="$3.000" sub="≈ 80 triệu đồng" />,
    },
    {
      scene: 'states',
      from: 'ca',
      to: 'but',
      Visual: () => (
        <>
          <Stat to="rent" kicker="Cùng người đó chuyển tới" value="Quận Cam" sub="California" color="teal" size={140} />
          <Stat from="rent" to="total" kicker="Thuê 1 phòng ngủ ở Quận Cam" value="$2.750" sub="hơn gấp đôi Houston" color="teal" />
          <Versus
            from="total"
            left="Houston"
            right="Quận Cam"
            rows={[
              {at: 'total', label: 'Chi phí 1 tháng', left: '$3.000', right: '$4.600', win: 'left'},
              {at: 'wage', label: 'Thu nhập cần có', left: '$22/giờ', right: '$36/giờ', win: 'left'},
              {at: 'tax', label: 'Thuế thu nhập bang', left: '0%', right: '1–13%+', win: 'left'},
            ]}
          />
        </>
      ),
    },
  ],
});

// C — Tiền nhà: đừng chỉ hỏi lương bao nhiêu (~38 giây)
const c = defineShort({
  key: 'c',
  video,
  title: ['Ở MỸ, ĐỪNG CHỈ HỎI', '“LƯƠNG BAO NHIÊU?”'],
  source: 'Houston, Texas · Zumper, MIT Living Wage 2026 · Số liệu tham khảo',
  end: {line: FULL},
  clips: [
    {scene: 'housing', to: 'loc', Visual: () => <Stat kicker="Khoản chi lớn nhất ở Mỹ" value="TIỀN NHÀ" size={150} />},
    {
      scene: 'housing',
      from: 'zumper',
      to: 'extra',
      Visual: () => <Stat kicker="Thuê 1 phòng ngủ ở Houston" value="$1.050–1.300" sub="mỗi tháng (2026)" size={112} />,
    },
    {
      scene: 'housing',
      from: 'mit',
      Visual: () => (
        <>
          <Stat to="why" kicker="Nhà + điện nước cơ bản" value="$1.270" sub="mỗi tháng (MIT)" />
          <Verdict from="why" wrong={{at: 'why', text: 'Lương bao nhiêu?'}} right={{at: 'key', text: 'Còn lại bao nhiêu?'}} />
        </>
      ),
    },
  ],
});

export default [a, b, c];
