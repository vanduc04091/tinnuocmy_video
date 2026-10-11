import {
  AlertTriangle,
  Baby,
  Briefcase,
  Car,
  CarFront,
  Eye,
  Flame,
  Fuel,
  HeartPulse,
  Home,
  KeyRound,
  Receipt,
  Shirt,
  ShoppingCart,
  Smartphone,
  Stethoscope,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
  Zap,
} from 'lucide-react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import channel from '../../shared/channel.json';
import {AnimatedNumber} from '../../shared/components/AnimatedNumber';
import {Reveal, Sfx} from '../../shared/components/Reveal';
import {SourceNote} from '../../shared/components/SceneParts';
import {defineVideo} from '../../shared/defineVideo';
import {num} from '../../shared/format';
import {BalanceDrain, PeopleRow} from '../../shared/overlays/BalanceDrain';
import {ChipList, Panel, PanelStat} from '../../shared/overlays/Panel';
import {BigLine, ChapterTitle, PlaceTag} from '../../shared/overlays/Titles';
import {Window} from '../../shared/overlays/Window';
import {type At, useAt} from '../../shared/SceneContext';
import {type Accent, accent, theme} from '../../shared/theme';
import narration from './narration.json';
import shots from './shots.json';

// Lương 4.000/tháng trước thuế, độc thân, 2026 (xem docs/kich-ban/luong-4000-usd.md)
const PAY = {gross: 4000, fed: 298, fica: 306, caTax: 80, caSdi: 52};
const NET_TX = PAY.gross - PAY.fed - PAY.fica; // 3.396
const NET_CA = NET_TX - PAY.caTax - PAY.caSdi; // 3.264
// Chi phí 1 người ở Houston (MIT, tập 1) và Quận Cam
const HOUSTON = {housing: 1270, transport: 740, food: 325, health: 270, phone: 135, personal: 250};
const COST_HOU = Object.values(HOUSTON).reduce((a, b) => a + b, 0); // 2.990
const COST_OC = 4597;

const Dim: React.FC<{v?: number}> = ({v = 0.5}) => <AbsoluteFill style={{background: `rgba(6,11,21,${v})`}} />;

// ───────────── Mở đầu ─────────────

const Hook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const atf = useAt();
  const end = atf('but', fps);
  const fade = interpolate(frame, [end - 4, end + 10], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <Sfx at={0.4} sound="impact" volume={0.5} />
      {frame < end + 12 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 150, opacity: fade}}>
          <Reveal at={0.3} y={0} scale>
            <div style={{fontSize: 220, fontWeight: 800, color: theme.gold, letterSpacing: '-0.03em', textShadow: '0 10px 60px rgba(0,0,0,0.7)'}}>
              <AnimatedNumber value={4000} at={0.3} frames={30} />
              <span style={{fontSize: 70, color: theme.text}}>/tháng</span>
            </div>
          </Reveal>
          <Reveal at="vnd" sfx="pop">
            <div style={{fontSize: 52, fontWeight: 700, color: theme.text, textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>
              ≈ hơn <span style={{color: theme.teal}}>100 triệu đồng</span>
            </div>
          </Reveal>
        </AbsoluteFill>
      )}
      <Window from="b1" to="diff">
        <Panel kicker="Mỗi tháng ở Mỹ" title="Những khoản lấy đi tiền lương" color="red">
          <ChipList
            color="red"
            items={[
              {at: 'b1', text: 'Tiền thuê nhà', icon: Home},
              {at: 'b2', text: 'Thực phẩm', icon: ShoppingCart},
              {at: 'b3', text: 'Xăng xe', icon: Fuel},
              {at: 'b4', text: 'Bảo hiểm y tế', icon: HeartPulse},
              {at: 'b5', text: 'Hóa đơn hằng tháng', icon: Receipt},
            ]}
          />
        </Panel>
      </Window>
      <Window from="plan" to="go">
        <Dim v={0.35} />
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 28, paddingBottom: 170}}>
          {['Phải chi những khoản gì?', 'Còn lại bao nhiêu?', 'Có tiết kiệm được không?'].map((t, i) => (
            <Reveal key={t} at="plan" delay={i * 14} sfx="pop" sfxVolume={0.35}>
              <div style={{fontSize: 56, fontWeight: 700, color: theme.text, padding: '14px 36px', borderRadius: 16, background: 'rgba(7,12,22,0.75)', borderLeft: `6px solid ${theme.gold}`, width: 900, textAlign: 'center'}}>
                {t}
              </div>
            </Reveal>
          ))}
        </AbsoluteFill>
      </Window>
      <BigLine at="go" text="Lương 4.000 USD/tháng ở Mỹ: đủ sống hay chật vật?" size={92} />
    </>
  );
};

// ───────────── 01 Lương thực nhận ─────────────

const PayRow: React.FC<{at: At; label: string; tx: number | string; ca: number | string; strong?: boolean; caOn: boolean}> = ({at, label, tx, ca, strong, caOn}) => {
  const fmt = (v: number | string) => (typeof v === 'number' ? (v < 0 ? `−$${num(-v)}` : `$${num(v)}`) : v);
  const color = (v: number | string) => (typeof v === 'number' && v < 0 ? theme.red : strong ? theme.gold : theme.text);
  return (
    <Reveal at={at} y={10} sfx="pop" sfxVolume={0.3}>
      <div style={{display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', alignItems: 'center', padding: strong ? '16px 0 4px' : '11px 0', borderTop: strong ? `2px solid ${theme.line}` : undefined, borderBottom: strong ? undefined : `1px solid ${theme.line}`}}>
        <span style={{fontSize: strong ? 32 : 28, fontWeight: strong ? 800 : 500, color: theme.text}}>{label}</span>
        <span style={{fontSize: strong ? 52 : 36, fontWeight: 800, color: color(tx), textAlign: 'right'}}>{fmt(tx)}</span>
        <span style={{fontSize: strong ? 52 : 36, fontWeight: 800, color: color(ca), textAlign: 'right', opacity: caOn ? 1 : 0.12}}>{fmt(ca)}</span>
      </div>
    </Reveal>
  );
};

const Paycheck = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const caOn = frame >= useAt()('ca', fps);
  return (
    <>
      <ChapterTitle index="01" title="Lương thực nhận" />
      <Window from="gross" to="rule">
        <Dim v={0.45} />
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 165}}>
          <div style={{width: 1260, background: 'rgba(7,12,22,0.88)', borderRadius: 26, border: `1px solid ${theme.line}`, padding: '24px 44px 28px', boxShadow: '0 30px 80px rgba(0,0,0,0.5)'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', fontSize: 24, fontWeight: 800, letterSpacing: '0.12em', paddingBottom: 10}}>
              <span style={{color: theme.muted}}>PHIẾU LƯƠNG / THÁNG · 2026</span>
              <span style={{color: theme.gold, textAlign: 'right'}}>TEXAS</span>
              <span style={{color: theme.teal, textAlign: 'right', opacity: caOn ? 1 : 0.15}}>CALIFORNIA</span>
            </div>
            <PayRow at="gross" label="Lương trước thuế" tx={PAY.gross} ca={PAY.gross} caOn={caOn} />
            <PayRow at="fed" label="Thuế thu nhập liên bang" tx={-PAY.fed} ca={-PAY.fed} caOn={caOn} />
            <PayRow at="fica" label="An sinh xã hội + Medicare" tx={-PAY.fica} ca={-PAY.fica} caOn={caOn} />
            <PayRow at="state" label="Thuế tiểu bang + bảo hiểm khuyết tật" tx="$0" ca={-(PAY.caTax + PAY.caSdi)} caOn={caOn} />
            <PayRow at="net" label="Thực nhận" tx={NET_TX} ca={NET_CA} strong caOn={caOn} />
          </div>
        </AbsoluteFill>
      </Window>
      <BigLine at="rule" text="Mỗi tháng thực sự về tay bao nhiêu?" size={88} />
      <SourceNote>Ước tính: độc thân, khấu trừ chuẩn 2026, chưa trừ bảo hiểm / quỹ hưu trí — IRS, California FTB & EDD</SourceNote>
    </>
  );
};

// ───────────── 02 Một tháng ở Houston ─────────────

const Budget = () => (
  <>
    <ChapterTitle index="02" title="Một tháng ở Houston" />
    <PlaceTag at="who" to="start" place="HOUSTON, TEXAS" sub="Độc thân · thuê căn hộ nhỏ · có xe hơi" />
    <Window from="start" to="thin">
      <Panel kicker="Lương về tài khoản" title="Tiền đi đâu hết?" width={780}>
        <BalanceDrain
          start={{at: 'start', value: NET_TX, label: 'Số dư'}}
          items={[
            {at: 'c1', label: 'Nhà ở + điện nước', value: HOUSTON.housing, icon: Home},
            {at: 'c2', label: 'Đi lại', value: HOUSTON.transport, icon: Car},
            {at: 'c3', label: 'Ăn uống', value: HOUSTON.food, icon: ShoppingCart},
            {at: 'c4', label: 'Sức khỏe', value: HOUSTON.health, icon: Stethoscope},
            {at: 'c5', label: 'Internet + điện thoại', value: HOUSTON.phone, icon: Smartphone},
            {at: 'c6', label: 'Chi tiêu cá nhân', value: HOUSTON.personal, icon: Shirt},
          ]}
          result={{at: 'left', label: 'Còn lại cuối tháng'}}
        />
        <Reveal at="net4k" sfx="pop">
          <div style={{fontSize: 27, color: theme.teal, fontWeight: 600}}>Nếu thực nhận đủ $4.000 → dư ~$1.000</div>
        </Reveal>
      </Panel>
    </Window>
    <Window from="thin">
      <Panel kicker="Vùng đệm mỏng" title="Một sự cố là hết" color="red">
        <ChipList
          color="red"
          items={[
            {at: 'car', text: 'Xe hỏng', icon: Wrench},
            {at: 'car', text: 'Hóa đơn khám bệnh', icon: HeartPulse},
          ]}
        />
      </Panel>
    </Window>
    <SourceNote>Chi phí: MIT Living Wage Calculator (Houston) — xem tập 1</SourceNote>
  </>
);

// ───────────── 03 Đổi nơi ở ─────────────

const CityCard: React.FC<{at: At; city: string; color: Accent; net: number; cost: number; costAt: At; gapAt: At}> = ({at, city, color, net, cost, costAt, gapAt}) => {
  const diff = net - cost;
  return (
    <Reveal at={at} y={20} sfx="pop" style={{flex: 1}}>
      <div style={{background: 'rgba(7,12,22,0.86)', borderRadius: 24, border: `2px solid ${accent(color)}`, padding: '28px 34px', display: 'flex', flexDirection: 'column', gap: 12}}>
        <div style={{fontSize: 34, fontWeight: 800, color: accent(color), letterSpacing: '0.06em'}}>{city}</div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, color: theme.text}}>
          <span>Thực nhận</span>
          <b>${num(net)}</b>
        </div>
        <Reveal at={costAt} y={6}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, color: theme.text}}>
            <span>Chi phí sống</span>
            <b>−${num(cost)}</b>
          </div>
        </Reveal>
        <Reveal at={gapAt} y={6} sfx={diff < 0 ? 'impact' : undefined} sfxVolume={0.45}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: `2px solid ${theme.line}`, paddingTop: 12}}>
            <span style={{fontSize: 30, color: theme.muted}}>{diff < 0 ? 'Thiếu mỗi tháng' : 'Dư mỗi tháng'}</span>
            <span style={{fontSize: 64, fontWeight: 800, color: diff < 0 ? theme.red : theme.teal}}>
              {diff < 0 ? '−' : '+'}${num(Math.abs(diff))}
            </span>
          </div>
        </Reveal>
      </div>
    </Reveal>
  );
};

const Place = () => (
  <>
    <ChapterTitle index="03" title="Cùng lương, khác nơi ở" />
    <Window from="oc" to="how">
      <Dim v={0.4} />
      <AbsoluteFill style={{paddingTop: 200, paddingLeft: 160, paddingRight: 160, flexDirection: 'row', gap: 40, alignItems: 'flex-start'}}>
        <CityCard at="oc" city="HOUSTON, TX" color="gold" net={NET_TX} cost={COST_HOU} costAt="oc" gapAt="oc" />
        <CityCard at="net" city="QUẬN CAM, CA" color="teal" net={NET_CA} cost={COST_OC} costAt="cost" gapAt="gap" />
      </AbsoluteFill>
    </Window>
    <Window from="how" to="nyc">
      <Panel kicker="Muốn trụ được ở Quận Cam" title="Phải thay đổi" color="teal">
        <ChipList
          color="teal"
          items={[
            {at: 'how', text: 'Ở ghép', icon: Users},
            {at: 'how', text: 'Bỏ bớt xe', icon: CarFront},
            {at: 'how', text: 'Tìm việc lương cao hơn', icon: TrendingUp},
          ]}
        />
      </Panel>
    </Window>
    <PlaceTag at="nyc" to="same" place="NEW YORK · SAN FRANCISCO" sub="Riêng căn 1 phòng ngủ đã hơn $4.000/tháng" />
    <SourceNote>MIT Living Wage Calculator; HUD FMR FY2026; Zumper 9/2026</SourceNote>
  </>
);

// ───────────── 04 Nuôi gia đình ─────────────

const GapBars: React.FC<{at: At; need: number; have: number}> = ({at, need, have}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = useAt()(at, fps);
  const p = interpolate(frame, [start, start + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bar = (label: string, v: number, color: string, delay: number) => {
    const q = interpolate(frame, [start + delay, start + delay + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
        <span style={{fontSize: 26, color: theme.muted}}>{label}</span>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{height: 64, width: `${(v / need) * 78 * q}%`, background: color, borderRadius: 10}} />
          <span style={{fontSize: 46, fontWeight: 800, color: theme.text, opacity: q}}>${num(v)}</span>
        </div>
      </div>
    );
  };
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 22, opacity: p}}>
      {bar('Gia đình cần (trước thuế/tháng)', need, theme.red, 0)}
      {bar('Lương', have, theme.gold, 12)}
    </div>
  );
};

const Family = () => (
  <>
    <ChapterTitle index="04" title="Nếu phải nuôi gia đình" />
    <Window from="fam" to="need">
      <Panel kicker="Hồ sơ mới" title="Gia đình 3 người" width={640}>
        <ChipList items={[{at: 'fam', text: '2 người lớn, 1 người đi làm', icon: Users}, {at: 'fam', text: '1 con nhỏ', icon: Baby}]} />
      </Panel>
    </Window>
    <Window from="need" to="both">
      <Panel kicker="Houston · theo MIT" title="Cần ~$72.000/năm" color="red" width={820}>
        <GapBars at="need" need={6034} have={PAY.gross} />
        <Reveal at="vs" sfx="impact" sfxVolume={0.45}>
          <div style={{fontSize: 40, fontWeight: 800, color: theme.red}}>Thiếu ~$2.000 mỗi tháng</div>
        </Reveal>
      </Panel>
    </Window>
    <BigLine at="both" text="“Dư dả” hay “chật vật” — có khi cả hai đều đúng" size={78} />
    <SourceNote>MIT Living Wage Calculator — Harris County, TX (2 người lớn, 1 đi làm, 1 con): $34,81/giờ</SourceNote>
  </>
);

// ───────────── 05 Vì sao vẫn bất an? ─────────────

const Mind = () => (
  <>
    <ChapterTitle index="05" title="Vì sao vẫn bất an?" />
    <Window from="fed" to="q1">
      <Dim v={0.5} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 44, paddingBottom: 170}}>
        <Reveal at="fed" sfx="pop">
          <div style={{fontSize: 34, color: theme.muted, fontWeight: 600, textAlign: 'center'}}>Trả ngay khoản bất ngờ <b style={{color: theme.text}}>$400</b> bằng tiền mặt?</div>
        </Reveal>
        <PeopleRow at="fed" highlight={6} />
        <Reveal at="fed" delay={40}>
          <div style={{fontSize: 64, fontWeight: 800, color: theme.text}}>
            Chỉ <span style={{color: theme.teal}}>6/10</span> người Mỹ làm được
          </div>
        </Reveal>
      </AbsoluteFill>
    </Window>
    <Window from="q1" to="social">
      <Panel kicker="Nếu ngày mai…" title="Những câu hỏi không lời đáp" color="red">
        <ChipList
          color="red"
          items={[
            {at: 'q1', text: 'Mất việc?', icon: Briefcase},
            {at: 'q2', text: 'Xe hỏng?', icon: Wrench},
            {at: 'q3', text: 'Tiền nhà tăng?', icon: KeyRound},
            {at: 'q4', text: 'Hóa đơn y tế lớn?', icon: AlertTriangle},
          ]}
        />
      </Panel>
    </Window>
    <Window from="hidden" to="compare">
      <Panel kicker="Mạng xã hội không cho bạn thấy" title="Phần chìm của tảng băng" color="blue">
        <ChipList
          color="blue"
          items={[
            {at: 'hidden', text: 'Họ đang nợ bao nhiêu', icon: Eye},
            {at: 'hidden', text: 'Có gia đình hỗ trợ không', icon: Users},
            {at: 'hidden', text: 'Lối sống có bền vững không', icon: Flame},
          ]}
        />
      </Panel>
    </Window>
    <BigLine at="compare" text="Đừng so cuộc sống thật của mình với khoảnh khắc đẹp nhất của người khác" size={70} />
    <SourceNote>Federal Reserve — Survey of Household Economics and Decisionmaking (khảo sát 2025, công bố 5/2026)</SourceNote>
  </>
);

// ───────────── 06 Làm gì để dễ thở hơn? ─────────────

const FundBar: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = useAt()(at, fps);
  const p = interpolate(frame, [start + 10, start + 110], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const months = Math.round(p * 22);
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, color: theme.muted}}>
        <span>Quỹ dự phòng 3 tháng</span>
        <span>$9.000</span>
      </div>
      <div style={{height: 34, borderRadius: 17, background: theme.surfaceStrong, overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${p * 100}%`, background: `linear-gradient(90deg, ${theme.teal}, ${theme.gold})`}} />
      </div>
      <div style={{fontSize: 30, color: theme.text, fontWeight: 700}}>
        $400/tháng × <span style={{color: theme.gold}}>{months}</span> tháng ≈ ${num(Math.min(9000, months * 400))}
      </div>
    </div>
  );
};

const Tip: React.FC<{at: At; n: number; title: string; children?: React.ReactNode}> = ({at, n, title, children}) => (
  <Reveal at={at} y={14} sfx="pop" sfxVolume={0.35}>
    <div style={{display: 'flex', gap: 20, padding: '16px 20px', borderRadius: 16, background: theme.surfaceStrong}}>
      <span style={{fontSize: 58, fontWeight: 800, color: theme.gold, width: 44, lineHeight: 1}}>{n}</span>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10, flex: 1}}>
        <span style={{fontSize: 32, fontWeight: 700, color: theme.text}}>{title}</span>
        {children}
      </div>
    </div>
  </Reveal>
);

const Tips = () => (
  <>
    <ChapterTitle index="06" title="Làm gì để dễ thở hơn?" />
    <Window from="t1" to="t3">
      <Panel kicker="Bắt đầu từ khoản lớn nhất" title="Hai phép tính nên làm" width={800}>
        <Tip at="t1" n={1} title="Tiền nhà ≤ 30% lương ≈ $1.200">
          <Reveal at="t1b">
            <span style={{fontSize: 25, color: theme.muted}}>Bớt vài trăm tiền nhà &gt; cắt từng ly cà phê</span>
          </Reveal>
        </Tip>
        <Tip at="t2" n={2} title="Xây quỹ dự phòng từng bước">
          <FundBar at="t2b" />
        </Tip>
      </Panel>
    </Window>
    <Window from="t3">
      <Panel kicker="Và thêm" title="Hai thói quen" width={800}>
        <Tip at="t3" n={3} title="Chia nhỏ khoản không đều: bảo dưỡng xe, phí bảo hiểm năm" />
        <Tip at="t4" n={4} title="Đừng lấy cuộc sống trên mạng làm thước đo" />
      </Panel>
    </Window>
  </>
);

// ───────────── Kết ─────────────

const Verdict: React.FC<{at: At; who: string; verdict: string; color: Accent; icon: typeof Home}> = ({at, who, verdict, color, icon: Icon}) => (
  <Reveal at={at} y={14} sfx="pop" sfxVolume={0.4}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 26px', borderRadius: 18, background: 'rgba(7,12,22,0.85)', borderLeft: `8px solid ${accent(color)}`}}>
      <Icon size={44} color={accent(color)} />
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <span style={{fontSize: 28, color: theme.muted, fontWeight: 600}}>{who}</span>
        <span style={{fontSize: 44, fontWeight: 800, color: accent(color)}}>{verdict}</span>
      </div>
    </div>
  </Reveal>
);

const Outro = () => (
  <>
    <Window from="v1" to="key">
      <Panel kicker="Lương 4.000 USD/tháng" title="Có đủ sống không?" width={820}>
        <Verdict at="v1" who="Độc thân · Houston" verdict="Đủ — nhưng vùng đệm mỏng" color="teal" icon={Wallet} />
        <Verdict at="v2" who="Độc thân · Quận Cam, New York, San Francisco" verdict="Rất khó" color="gold" icon={Zap} />
        <Verdict at="v3" who="Nuôi gia đình" verdict="Chật vật ở hầu hết mọi nơi" color="red" icon={Users} />
      </Panel>
    </Window>
    <Window from="key" to="q">
      <Dim v={0.4} />
      <BigLine at="key" text="Thoải mái = khoảng cách giữa số tiền bạn có và những gì cuộc sống đòi hỏi" size={70} />
    </Window>
    <Window from="q">
      <Dim v={0.5} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 50, paddingBottom: 150}}>
        <Reveal at="q">
          <div style={{fontSize: 54, fontWeight: 700, color: theme.text, textAlign: 'center', maxWidth: 1400, lineHeight: 1.3, padding: '30px 50px', borderRadius: 24, background: 'rgba(7,12,22,0.75)', border: `1px solid ${theme.line}`, textWrap: 'balance'}}>
            “Với $4.000/tháng ở Mỹ, bạn sẽ sống thoải mái hay chật vật?”
          </div>
        </Reveal>
        <Reveal at="sub" y={0} scale sfx="ding" sfxVolume={0.4}>
          <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
            <div style={{padding: '18px 40px', borderRadius: 14, background: theme.red, color: 'white', fontSize: 36, fontWeight: 800}}>ĐĂNG KÝ KÊNH</div>
            <span style={{fontSize: 36, fontWeight: 700, color: theme.text, textShadow: '0 4px 20px rgba(0,0,0,0.7)'}}>{channel.name}</span>
          </div>
        </Reveal>
      </AbsoluteFill>
    </Window>
    <div style={{position: 'absolute', bottom: 26, width: '100%', textAlign: 'center', fontSize: 19, color: theme.faint}}>
      Số liệu ước tính, mang tính tham khảo, không phải tư vấn tài chính · Video nền: Pixabay
    </div>
  </>
);

export default defineVideo({
  id: 'luong-4000-usd',
  narration,
  shots,
  music: {src: 'sound/nhac-nen.mp3', volume: 0.22, duckedVolume: 0.075},
  transitionSfx: 'whoosh',
  cleanScenes: ['hook'],
  scenes: {
    hook: Hook,
    paycheck: Paycheck,
    budget: Budget,
    place: Place,
    family: Family,
    mind: Mind,
    tips: Tips,
    outro: Outro,
  },
});

