import {
  Bus,
  Car,
  Coffee,
  CupSoda,
  Droplets,
  Fuel,
  GraduationCap,
  HeartPulse,
  Home,
  MapPin,
  ParkingSquare,
  Pizza,
  Route,
  Shirt,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  Users,
  Wallet,
  Wifi,
  Wrench,
  User,
  Briefcase,
} from 'lucide-react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Reveal, Sfx} from '../../shared/components/Reveal';
import {StatCard} from '../../shared/components/Card';
import {SourceNote} from '../../shared/components/SceneParts';
import {defineVideo} from '../../shared/defineVideo';
import {ReceiptLayout} from '../../shared/layouts/ReceiptLayout';
import {ChipList, Panel, PanelStat} from '../../shared/overlays/Panel';
import {BigLine, ChapterTitle, PlaceTag} from '../../shared/overlays/Titles';
import {UsMap} from '../../shared/overlays/UsMap';
import {Window} from '../../shared/overlays/Window';
import {type At, useAt} from '../../shared/SceneContext';
import channel from '../../shared/channel.json';
import {theme} from '../../shared/theme';
import narration from './narration.json';
import shots from './shots.json';

// Ngân sách một người độc thân ở Houston (MIT Living Wage + ước tính), đô/tháng
const HOUSTON = {housing: 1270, food: 325, transport: 740, health: 270, phone: 135, personal: 250};

const Dim: React.FC<{v?: number}> = ({v = 0.55}) => <AbsoluteFill style={{background: `rgba(6,11,21,${v})`}} />;

// ───────────────────────── 1. Mở đầu ─────────────────────────

const FlipNumber: React.FC<{steps: {at: At; text: string; color?: string}[]; to: At}> = ({steps, to}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const atf = useAt();
  const frames = steps.map((s) => atf(s.at, fps));
  const end = atf(to, fps);
  const idx = frames.reduce((acc, f, i) => (frame >= f ? i : acc), -1);
  if (idx < 0 || frame > end + 12) return null;
  const local = frame - frames[idx];
  const pop = interpolate(local, [0, 6, 12], [1.25, 0.96, 1], {extrapolateRight: 'clamp'});
  const fade = interpolate(frame, [end, end + 12], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const s = steps[idx];
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 140, opacity: fade}}>
      <div style={{fontSize: 190, fontWeight: 800, color: s.color ?? theme.text, transform: `scale(${pop})`, letterSpacing: '-0.03em', textShadow: '0 10px 60px rgba(0,0,0,0.75)'}}>
        {s.text}
      </div>
      <div style={{fontSize: 40, fontWeight: 600, color: theme.text, opacity: 0.85, textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>mỗi tháng?</div>
    </AbsoluteFill>
  );
};

const Intro = () => (
  <>
    <Sfx at="n30" sound="impact" volume={0.5} />
    <Sfx at="n50" sound="impact" volume={0.5} />
    <Sfx at="n100" sound="impact" volume={0.6} />
    <FlipNumber
      to="p1"
      steps={[
        {at: 'n30', text: '30 triệu?'},
        {at: 'n50', text: '50 triệu?'},
        {at: 'n100', text: '100+ triệu?', color: theme.gold},
      ]}
    />
    <Window from="b1" to="q">
      <Panel kicker="Nhận lương xong" title="…phần lớn đã phải trả cho">
        <ChipList
          color="red"
          items={[
            {at: 'b1', text: '− Tiền nhà', icon: Home},
            {at: 'b2', text: '− Tiền xe', icon: Car},
            {at: 'b3', text: '− Bảo hiểm', icon: ShieldCheck},
            {at: 'b4', text: '− Thực phẩm', icon: ShoppingCart},
          ]}
        />
      </Panel>
    </Window>
    <BigLine at="q" text="Sống ở Mỹ một tháng hết bao nhiêu tiền?" sub="Sự thật không phải ai cũng biết" size={100} />
  </>
);

// ───────────────────────── 2. Hồ sơ mẫu ─────────────────────────

const Profile = () => (
  <>
    <Window from="who" to="src" slide={-40}>
      <Panel side="left" kicker="Hồ sơ mẫu" title="Chúng ta tính cho" width={640}>
        <ChipList
          items={[
            {at: 'who', text: 'Một người độc thân', icon: User},
            {at: 'home', text: 'Thuê căn hộ nhỏ', icon: Home},
            {at: 'car', text: 'Có xe hơi đi làm', icon: Car},
            {at: 'city', text: 'Sống ở Houston, Texas', icon: MapPin},
          ]}
        />
      </Panel>
    </Window>
    <PlaceTag at="city" to="src" place="HOUSTON, TEXAS" sub="Một trong những cộng đồng người Việt đông nhất nước Mỹ" />
    <Window from="src" to="oc">
      <Panel kicker="Nguồn số liệu chính" title="MIT Living Wage Calculator" color="teal">
        <div style={{fontSize: 28, color: theme.muted, lineHeight: 1.45}}>
          Bộ tính chi phí sinh hoạt của Học viện Công nghệ Massachusetts — cùng một phương pháp, cùng một khu vực cho mọi khoản.
        </div>
      </Panel>
    </Window>
    <Window from="oc">
      <Panel kicker="Cuối video" title="So sánh với Quận Cam" color="teal" width={760}>
        <UsMap
          width={680}
          highlights={[
            {at: 0, stateId: '48', color: 'gold'},
            {at: 'oc', stateId: '06', color: 'teal'},
          ]}
          cities={[
            {at: 0, name: 'Houston', lon: -95.37, lat: 29.76},
            {at: 'oc', name: 'Quận Cam', lon: -117.87, lat: 33.75, color: 'teal'},
          ]}
        />
      </Panel>
    </Window>
  </>
);

// ───────────────────────── 3. Tiền nhà ─────────────────────────

const Equation: React.FC<{at: At; hl: At}> = ({at, hl}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hlFrame = useAt()(hl, fps);
  const glow = interpolate(frame, [hlFrame, hlFrame + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const box = (text: string, color: string, i: number, strong = false) => (
    <Reveal at={at} delay={i * 8} y={16} sfx={i === 0 ? 'pop' : undefined}>
      <div
        style={{
          padding: '26px 34px',
          borderRadius: 20,
          background: strong ? `rgba(233,180,76,${0.15 + 0.75 * glow})` : 'rgba(7,12,22,0.82)',
          border: `2px solid ${color}`,
          color: strong && glow > 0.5 ? '#1A1408' : theme.text,
          fontSize: 40,
          fontWeight: 800,
          textAlign: 'center',
          minWidth: 260,
          transform: strong ? `scale(${1 + 0.06 * glow})` : undefined,
        }}
      >
        {text}
      </div>
    </Reveal>
  );
  const op = (t: string, i: number) => (
    <Reveal at={at} delay={i * 8 + 4} y={0}>
      <span style={{fontSize: 70, fontWeight: 800, color: theme.gold}}>{t}</span>
    </Reveal>
  );
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 170}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
        {box('Lương', theme.teal, 0)}
        {op('−', 0)}
        {box('Tiền nhà & chi phí thiết yếu', theme.red, 1)}
        {op('=', 1)}
        {box('Còn lại?', theme.gold, 2, true)}
      </div>
    </AbsoluteFill>
  );
};

const Housing = () => (
  <>
    <ChapterTitle index="01" title="Tiền nhà" />
    <Window from="zumper" to="extra">
      <Panel kicker="Houston · 2026" title="Thuê căn hộ 1 phòng ngủ">
        <PanelStat at="zumper" label="Giá thuê trung vị trên các trang cho thuê" value={0} text="$1.050–1.300" note="Zumper, 6/2026 – 8/2026" />
      </Panel>
    </Window>
    <Window from="e1" to="mit">
      <Panel kicker="Chưa hết" title="Còn phải trả thêm">
        <ChipList
          items={[
            {at: 'e1', text: 'Điện, nước', icon: Droplets},
            {at: 'e2', text: 'Internet', icon: Wifi},
            {at: 'e3', text: 'Chỗ đậu xe', icon: ParkingSquare},
            {at: 'e4', text: 'Bảo hiểm người thuê nhà', icon: ShieldCheck},
          ]}
        />
      </Panel>
    </Window>
    <Window from="mit" to="why">
      <Panel kicker="Đưa vào bảng tính" title="Nhà ở + điện nước cơ bản">
        <PanelStat at="mit" label="1 người ở Houston, mỗi tháng" value={HOUSTON.housing} note="MIT Living Wage Calculator (dựa trên giá thuê chuẩn HUD)" />
      </Panel>
    </Window>
    <Window from="key">
      <Dim v={0.35} />
      <Equation at="key" hl="left" />
    </Window>
    <SourceNote>Zumper 2026; MIT Living Wage Calculator — Houston-Pasadena-The Woodlands</SourceNote>
  </>
);

// ───────────────────────── 4. Ăn uống ─────────────────────────

const Food = () => (
  <>
    <ChapterTitle index="02" title="Ăn uống" />
    <Window from="f1" to="mit">
      <Panel kicker="Tiền chợ phụ thuộc vào" title="3 yếu tố">
        <ChipList
          items={[
            {at: 'f1', text: 'Thói quen mua sắm', icon: ShoppingCart},
            {at: 'f2', text: 'Loại thực phẩm', icon: Store},
            {at: 'f3', text: 'Số người trong nhà', icon: Users},
          ]}
        />
      </Panel>
    </Window>
    <Window from="mit" to="small">
      <Panel kicker="Đưa vào bảng tính" title="Thực phẩm, chủ yếu tự nấu">
        <PanelStat at="mit" label="1 người ở Houston, mỗi tháng" value={HOUSTON.food} note="MIT Living Wage Calculator" />
        <Reveal at="eatout" sfx="pop">
          <div style={{fontSize: 28, color: theme.red, fontWeight: 600}}>Ăn nhà hàng, đặt đồ ăn thường xuyên → cao hơn nhiều</div>
        </Reveal>
      </Panel>
    </Window>
    <Window from="s1" to="tip">
      <Panel kicker="Khoản nhỏ" title="…cộng lại không nhỏ" color="red">
        <ChipList
          color="red"
          items={[
            {at: 's1', text: 'Cà phê', icon: Coffee},
            {at: 's2', text: 'Đồ uống', icon: CupSoda},
            {at: 's3', text: 'Đồ ăn nhanh', icon: Pizza},
          ]}
        />
      </Panel>
    </Window>
    <PlaceTag at="tip" place="BELLAIRE, HOUSTON" sub="Khu chợ và quán Việt" />
    <SourceNote>MIT Living Wage Calculator — Houston-Pasadena-The Woodlands</SourceNote>
  </>
);

// ───────────────────────── 5. Đi lại ─────────────────────────

const Transport = () => (
  <>
    <ChapterTitle index="03" title="Xe cộ & đi lại" />
    <Window from="c1" to="aaa">
      <Panel kicker="Nuôi xe" title="Không chỉ tiền mua xe">
        <ChipList
          columns={2}
          items={[
            {at: 'c1', text: 'Xăng', icon: Fuel},
            {at: 'c2', text: 'Bảo hiểm', icon: ShieldCheck},
            {at: 'c3', text: 'Bảo dưỡng', icon: Wrench},
            {at: 'c4', text: 'Sửa chữa', icon: Wrench},
          ]}
        />
      </Panel>
    </Window>
    <Window from="aaa" to="transit">
      <Panel kicker="Chi phí xe / tháng" title="Tham khảo và thực tế">
        <PanelStat at="aaa" label="Xe mới, gồm khấu hao — trung bình Mỹ" value={965} color="red" note="Hiệp hội Ô tô Mỹ (AAA), 2025" />
        <PanelStat at="mit" label="Đưa vào bảng tính: đi lại 1 người ở Houston" value={HOUSTON.transport} note="MIT Living Wage Calculator" />
      </Panel>
    </Window>
    <PlaceTag at="transit" to="suburb" place="NEW YORK" sub="Tàu điện, xe buýt — có thể sống không cần xe" />
    <PlaceTag at="suburb" place="HOUSTON & VÙNG NGOẠI Ô" sub="Gần như bắt buộc phải có xe" />
    <SourceNote>AAA Your Driving Costs 2025; MIT Living Wage Calculator</SourceNote>
  </>
);

// ───────────────────────── 6. Sức khỏe ─────────────────────────

const Term: React.FC<{at: At; vi: string; en: string; desc: string}> = ({at, vi, en, desc}) => (
  <Reveal at={at} y={12} sfx="pop" sfxVolume={0.35}>
    <div style={{padding: '16px 22px', borderRadius: 14, background: theme.surfaceStrong, borderLeft: `5px solid ${theme.teal}`}}>
      <div style={{fontSize: 31, fontWeight: 700, color: theme.text}}>
        {vi} <span style={{color: theme.teal, fontWeight: 600, fontSize: 26}}>· {en}</span>
      </div>
      <div style={{fontSize: 24, color: theme.muted, marginTop: 4}}>{desc}</div>
    </div>
  </Reveal>
);

const Health = () => (
  <>
    <ChapterTitle index="04" title="Bảo hiểm sức khỏe" />
    <Window from="h1" to="aca">
      <Panel kicker="Có bảo hiểm vẫn phải trả" title="3 thuật ngữ cần biết" color="teal">
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          <Term at="h1" vi="Phí bảo hiểm" en="Premium" desc="Đóng đều đặn hằng tháng" />
          <Term at="h2" vi="Khoản khấu trừ" en="Deductible" desc="Tự trả trước khi bảo hiểm bắt đầu chi trả" />
          <Term at="h3" vi="Đồng chi trả" en="Copay" desc="Trả một phần mỗi lần khám, mua thuốc" />
        </div>
        <Reveal at="job" sfx="pop">
          <div style={{fontSize: 28, color: theme.gold, fontWeight: 600, display: 'flex', gap: 12, alignItems: 'center'}}>
            <Briefcase size={30} /> Đi làm toàn thời gian: công ty đóng phần lớn
          </div>
        </Reveal>
      </Panel>
    </Window>
    <Window from="aca">
      <Panel kicker="Phí bảo hiểm / tháng" title="Tự mua hay qua công ty?">
        <PanelStat at="aca" label="Tự mua trên sàn ACA · 40 tuổi · Texas 2026" value={661} color="red" note="Trước trợ cấp — KFF" />
        <PanelStat at="mit" label="Đưa vào bảng tính: có bảo hiểm qua công ty" value={HOUSTON.health} note="Gồm phí bảo hiểm + tiền khám tự trả — MIT" />
      </Panel>
    </Window>
    <SourceNote>KFF 2026 (phí benchmark ACA); MIT Living Wage Calculator</SourceNote>
  </>
);

// ───────────────────────── 7. Khoản khác ─────────────────────────

const Other = () => (
  <>
    <ChapterTitle index="05" title="Liên lạc & cá nhân" hold={2.4} />
    <Window from="net">
      <Panel kicker="Đưa vào bảng tính" title="Các khoản còn lại">
        <PanelStat at="pick" label="Internet + điện thoại" value={HOUSTON.phone} note="MIT (Texas)" />
        <PanelStat at="pick2" label="Chi tiêu cá nhân: quần áo, cắt tóc, giải trí" value={HOUSTON.personal} note="Ước tính ở mức tiết chế" />
      </Panel>
    </Window>
  </>
);

// ───────────────────────── 8. Tổng kết ─────────────────────────

const Total = () => (
  <>
    <Dim v={0.62} />
    <ReceiptLayout
      kicker="HOUSTON, TEXAS · 1 NGƯỜI"
      title="Một tháng ở Mỹ"
      rows={[
        {at: 'l1', icon: Home, label: 'Nhà ở + điện nước', value: HOUSTON.housing},
        {at: 'l2', icon: ShoppingCart, label: 'Ăn uống', value: HOUSTON.food},
        {at: 'l3', icon: Car, label: 'Đi lại', value: HOUSTON.transport},
        {at: 'l4', icon: HeartPulse, label: 'Sức khỏe', value: HOUSTON.health},
        {at: 'l5', icon: Smartphone, label: 'Internet + điện thoại', value: HOUSTON.phone},
        {at: 'l6', icon: Shirt, label: 'Chi tiêu cá nhân', value: HOUSTON.personal},
      ]}
      total={{at: 'sum', label: 'Tổng / tháng'}}
      aside={
        <>
          <Reveal at="vnd" sfx="impact" sfxVolume={0.45}>
            <StatCard label="Quy đổi (~26.000 đ/USD)" valueSize={60} value="Gần 80 triệu đồng" color="teal" />
          </Reveal>
          <Reveal at="income" sfx="pop">
            <StatCard icon={Wallet} label="Thu nhập cần có (MIT)" valueSize={60} value="$22/giờ" note="≈ $46.000/năm trước thuế" />
          </Reveal>
        </>
      }
    />
    <SourceNote>MIT Living Wage Calculator; chi tiêu cá nhân: ước tính</SourceNote>
  </>
);

// ───────────────────────── 9. So sánh bang ─────────────────────────

const ROWS: {at: At; label: string; tx: string; ca: string; note?: string}[] = [
  {at: 'rent', label: 'Nhà ở (giá thuê chuẩn HUD)', tx: '$1.270', ca: '$2.746'},
  {at: 'total', label: 'Tổng chi phí / tháng', tx: '~$3.000', ca: '~$4.600'},
  {at: 'vnd', label: 'Quy đổi', tx: '~80 triệu', ca: '100+ triệu'},
  {at: 'wage', label: 'Thu nhập cần có (MIT)', tx: '$22/giờ', ca: '$36/giờ'},
  {at: 'tax', label: 'Thuế thu nhập tiểu bang', tx: '0%', ca: '1% – 13,3%'},
];

const Compare = () => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 170}}>
    <div style={{width: 1400, background: 'rgba(7,12,22,0.86)', borderRadius: 26, border: `1px solid ${theme.line}`, padding: '26px 40px', boxShadow: '0 30px 80px rgba(0,0,0,0.5)'}}>
      <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', fontSize: 30, fontWeight: 800, letterSpacing: '0.1em', padding: '6px 0 16px', borderBottom: `1px solid ${theme.line}`}}>
        <span style={{color: theme.muted, fontSize: 22}}>1 NGƯỜI ĐỘC THÂN</span>
        <span style={{color: theme.gold, textAlign: 'right'}}>HOUSTON, TX</span>
        <span style={{color: theme.teal, textAlign: 'right'}}>QUẬN CAM, CA</span>
      </div>
      {ROWS.map((r) => (
        <Reveal key={r.label} at={r.at} y={10} sfx="pop" sfxVolume={0.35}>
          <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${theme.line}`}}>
            <span style={{fontSize: 29, color: theme.text, fontWeight: 500}}>{r.label}</span>
            <span style={{fontSize: 44, fontWeight: 800, color: theme.text, textAlign: 'right'}}>{r.tx}</span>
            <span style={{fontSize: 44, fontWeight: 800, color: theme.text, textAlign: 'right'}}>{r.ca}</span>
          </div>
        </Reveal>
      ))}
    </div>
  </AbsoluteFill>
);

const States = () => (
  <>
    <ChapterTitle index="06" title="Bang nào rẻ hơn?" />
    <Window from="diff" to="rent">
      <Dim v={0.5} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 150}}>
        <UsMap
          width={1250}
          highlights={[
            {at: 'diff', stateId: '48', color: 'gold'},
            {at: 'ca', stateId: '06', color: 'teal'},
          ]}
          cities={[
            {at: 'diff', name: 'Houston', lon: -95.37, lat: 29.76},
            {at: 'ca', name: 'Quận Cam', lon: -117.87, lat: 33.75, color: 'teal'},
          ]}
        />
      </AbsoluteFill>
    </Window>
    <Window from="rent" to="but">
      <Dim v={0.45} />
      <Compare />
    </Window>
    <Window from="jobs" to="so">
      <Panel kicker="Rẻ hơn chưa chắc tiết kiệm hơn" title="Hãy xem thêm" color="red">
        <ChipList
          color="red"
          items={[
            {at: 'jobs', text: 'Cơ hội việc làm', icon: Briefcase},
            {at: 'pay', text: 'Mức lương', icon: Wallet},
            {at: 'commute', text: 'Quãng đường đi làm', icon: Route},
          ]}
        />
      </Panel>
    </Window>
    <BigLine at="so" text="Tổng chi phí sinh hoạt so với thu nhập" sub="— không phải một khoản chi riêng lẻ" size={80} />
    <SourceNote>HUD Fair Market Rent FY2026; MIT Living Wage Calculator; luật thuế tiểu bang 2026</SourceNote>
  </>
);

// ───────────────────────── 10. Du học sinh ─────────────────────────

const Student = () => (
  <>
    <ChapterTitle index="07" title="Du học sinh" hold={2.4} />
    <Window from="share">
      <Panel kicker="Houston · chưa tính học phí" title="Chi phí sinh hoạt" color="blue">
        <ChipList
          color="blue"
          items={[
            {at: 'share', text: 'Ở ghép với bạn', icon: Users},
            {at: 'nocar', text: 'Xe buýt / đi chung xe', icon: Bus},
            {at: 'ins', text: 'Bảo hiểm của trường', icon: GraduationCap},
          ]}
        />
        <PanelStat at="ins" label="Mỗi tháng" value={0} text="$1.400–1.800" color="blue" note="Ước tính" />
      </Panel>
    </Window>
  </>
);

// ───────────────────────── 11. Kết ─────────────────────────

const Subscribe: React.FC<{at: At}> = ({at}) => (
  <Reveal at={at} y={0} scale sfx="ding" sfxVolume={0.4}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <div style={{padding: '18px 40px', borderRadius: 14, background: theme.red, color: 'white', fontSize: 36, fontWeight: 800}}>ĐĂNG KÝ KÊNH</div>
      <span style={{fontSize: 36, fontWeight: 700, color: theme.text, textShadow: '0 4px 20px rgba(0,0,0,0.7)'}}>{channel.name}</span>
    </div>
  </Reveal>
);

const Outro = () => (
  <>
    <Window from="o1" to="key">
      <Panel kicker="Tóm lại" title="5 yếu tố quyết định">
        <ChipList
          items={[
            {at: 'o1', text: 'Tiền nhà', icon: Home},
            {at: 'o2', text: 'Ăn uống', icon: ShoppingCart},
            {at: 'o3', text: 'Đi lại', icon: Car},
            {at: 'o4', text: 'Bảo hiểm', icon: HeartPulse},
            {at: 'o5', text: 'Chi tiêu cá nhân', icon: Sparkles},
          ]}
        />
        <Reveal at="ex" sfx="pop">
          <div style={{fontSize: 30, color: theme.text, fontWeight: 600, lineHeight: 1.5}}>
            Houston <b style={{color: theme.gold}}>~$3.000</b> · Quận Cam <b style={{color: theme.teal}}>~$4.600</b>
            <br />
            <span style={{color: theme.muted}}>Gia đình có con nhỏ: cần nhiều hơn</span>
          </div>
        </Reveal>
      </Panel>
    </Window>
    <Window from="key" to="q">
      <Dim v={0.4} />
      <BigLine at="key" text="Thu nhập thực nhận ↔ chi phí tại nơi bạn sống" size={78} />
    </Window>
    <Window from="q">
      <Dim v={0.5} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 50, paddingBottom: 150}}>
        <Reveal at="q">
          <div style={{fontSize: 56, fontWeight: 700, color: theme.text, textAlign: 'center', maxWidth: 1400, lineHeight: 1.3, padding: '30px 50px', borderRadius: 24, background: 'rgba(7,12,22,0.75)', border: `1px solid ${theme.line}`, textWrap: 'balance'}}>
            “Một gia đình Việt ở Mỹ cần tối thiểu bao nhiêu tiền mỗi tháng?”
          </div>
        </Reveal>
        <Subscribe at="sub" />
      </AbsoluteFill>
    </Window>
    <div style={{position: 'absolute', bottom: 26, width: '100%', textAlign: 'center', fontSize: 19, color: theme.faint}}>
      Số liệu mang tính tham khảo, không phải tư vấn tài chính · Video nền: Pixabay
    </div>
  </>
);

export default defineVideo({
  id: 'song-o-my-phong-su',
  narration,
  shots,
  music: {src: 'sound/nhac-nen.mp3', volume: 0.22, duckedVolume: 0.075},
  transitionSfx: 'whoosh',
  cleanScenes: ['intro'],
  scenes: {
    intro: Intro,
    profile: Profile,
    housing: Housing,
    food: Food,
    transport: Transport,
    health: Health,
    other: Other,
    total: Total,
    states: States,
    student: Student,
    outro: Outro,
  },
  budget: [
    {scene: 'housing', marker: 'mit', label: 'Nhà ở', value: HOUSTON.housing},
    {scene: 'food', marker: 'mit', label: 'Ăn uống', value: HOUSTON.food},
    {scene: 'transport', marker: 'mit', label: 'Đi lại', value: HOUSTON.transport},
    {scene: 'health', marker: 'mit', label: 'Sức khỏe', value: HOUSTON.health},
    {scene: 'other', marker: 'pick', label: 'Liên lạc', value: HOUSTON.phone},
    {scene: 'other', marker: 'pick2', label: 'Cá nhân', value: HOUSTON.personal},
  ],
});
