import {Briefcase, CloudSun, Flame, GraduationCap, Home, Landmark, Sun, Users, Wallet, Zap, CloudHail, ShoppingBag} from 'lucide-react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Reveal} from '../../shared/components/Reveal';
import {SourceNote} from '../../shared/components/SceneParts';
import {defineVideo} from '../../shared/defineVideo';
import {Dim, QuestionCta, Scoreboard, type Side, Verdict, VsPanel, VsRow} from '../../shared/overlays/Extras';
import {ChipList, Panel} from '../../shared/overlays/Panel';
import {BigLine, ChapterTitle} from '../../shared/overlays/Titles';
import {UsMap} from '../../shared/overlays/UsMap';
import {Window} from '../../shared/overlays/Window';
import {useAt} from '../../shared/SceneContext';
import {theme} from '../../shared/theme';
import narration from './narration.json';
import shots from './shots.json';

const CA: Side = {name: 'CALIFORNIA', color: 'teal'};
const TX: Side = {name: 'TEXAS', color: 'gold'};
const Score = (p: {before: [number, number]; after: [number, number]; at?: string}) => <Scoreboard left={CA} right={TX} {...p} />;

// ───────────── Mở đầu ─────────────

const VersusTitle: React.FC<{to: string}> = ({to}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const end = useAt()(to, fps);
  if (frame > end + 12) return null;
  const p = interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
  const out = interpolate(frame, [end, end + 12], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 140, opacity: out}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 50}}>
        <span style={{fontSize: 130, fontWeight: 800, color: theme.teal, transform: `translateX(${(1 - p) * -200}px)`, textShadow: '0 8px 50px rgba(0,0,0,0.8)'}}>CALIFORNIA</span>
        <span style={{fontSize: 80, fontWeight: 800, color: theme.text, opacity: p}}>vs</span>
        <span style={{fontSize: 130, fontWeight: 800, color: theme.gold, transform: `translateX(${(1 - p) * 200}px)`, textShadow: '0 8px 50px rgba(0,0,0,0.8)'}}>TEXAS</span>
      </div>
    </AbsoluteFill>
  );
};

const Hook = () => (
  <>
    <VersusTitle to="vn" />
    <Window from="vn" to="move">
      <Dim v={0.45} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 160, gap: 10}}>
        <UsMap width={1050} highlights={[{at: 'vn', stateId: '06', color: 'teal'}, {at: 'vn', stateId: '48', color: 'gold'}]} />
        <Reveal at="vn" delay={20}>
          <div style={{fontSize: 44, fontWeight: 700, color: theme.text, textAlign: 'center', textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>
            ~<span style={{color: theme.teal}}>1/3</span> người Mỹ gốc Việt sống ở California · Texas đứng thứ hai
          </div>
        </Reveal>
      </AbsoluteFill>
    </Window>
    <BigLine at="q" to="plan" text="Rẻ hơn có thật sự là tiết kiệm hơn?" size={96} />
    <Window from="plan" to="go">
      <Dim v={0.35} />
      <Panel kicker="5 hiệp đấu" title="Hai bang đối đầu" width={700}>
        <ChipList
          items={[
            {at: 'r1', text: '1 · Thuế thu nhập', icon: Landmark},
            {at: 'r2', text: '2 · Thuế mua sắm', icon: ShoppingBag},
            {at: 'r3', text: '3 · Nhà ở', icon: Home},
            {at: 'r4', text: '4 · Xăng & điện', icon: Zap},
            {at: 'r5', text: '5 · Tiền lương', icon: Wallet},
          ]}
        />
      </Panel>
    </Window>
    <SourceNote>Pew Research Center — người Mỹ gốc Việt</SourceNote>
  </>
);

// ───────────── Các hiệp ─────────────

const IncomeTax = () => (
  <>
    <ChapterTitle index="HIỆP 1" title="Thuế thu nhập" hold={2.4} />
    <Score before={[0, 0]} after={[0, 1]} at="win" />
    <Window from="tx">
      <VsPanel left={CA} right={TX} title="Thuế thu nhập tiểu bang">
        <VsRow at="ca" label="Thuế suất" left="1% – 13,3%" right="0%" winner="right" winAt="win" big />
        <VsRow at="ex" label="Lương $4.000/tháng → thực nhận" left="$3.264" right="$3.396" winner="right" winAt="win" />
        <Reveal at="diff" sfx="pop">
          <div style={{fontSize: 34, fontWeight: 800, color: theme.red, textAlign: 'center'}}>California: −$132/tháng · −$1.600/năm</div>
        </Reveal>
      </VsPanel>
    </Window>
    <SourceNote>Ước tính: độc thân, khấu trừ chuẩn 2026 — IRS, California FTB & EDD (xem tập 2)</SourceNote>
  </>
);

const SalesTax = () => (
  <>
    <ChapterTitle index="HIỆP 2" title="Thuế mua sắm" hold={2.4} />
    <Score before={[0, 1]} after={[0, 2]} at="win" />
    <Window from="ca">
      <VsPanel left={CA} right={TX} title="Thuế bán hàng trung bình (bang + địa phương)">
        <VsRow at="ca" label="Thuế suất" left="~9,0%" right="~8,2%" winner="right" winAt="win" big />
        <VsRow at="ex" label="Mua tivi $1.000 → trả thêm" left="+$90" right="+$82" winner="right" winAt="win" />
      </VsPanel>
    </Window>
    <SourceNote>Tax Foundation — State and Local Sales Tax Rates 2026</SourceNote>
  </>
);

const Housing = () => (
  <>
    <ChapterTitle index="HIỆP 3" title="Nhà ở" hold={2.4} />
    <Score before={[0, 2]} after={[0, 3]} at="win" />
    <Window from="buy" to="ptax">
      <VsPanel left={CA} right={TX} title="Nhà ở 2026" width={1150}>
        <VsRow at="buy" label="Giá nhà trung vị" left="$888.000" right="$330.000" winner="right" winAt="ratio" big />
        <Reveal at="ratio" sfx="impact" sfxVolume={0.45}>
          <div style={{fontSize: 34, fontWeight: 800, color: theme.gold, textAlign: 'center'}}>≈ 2,7 lần</div>
        </Reveal>
        <VsRow at="rent" label="Thuê căn 1 phòng ngủ (Quận Cam vs Houston)" left="$2.746" right="$1.270" winner="right" winAt="rent" />
      </VsPanel>
    </Window>
    <Window from="ptax" to="ins">
      <VsPanel left={CA} right={TX} title="Cái bẫy của Texas: thuế nhà đất" width={1150}>
        <VsRow at="ptax" label="Mỗi năm, tính trên giá trị nhà" left="~0,7%" right="~1,6%" winner="left" winAt="ptax" note="Texas: 1,4–1,8% tùy quận" big />
        <VsRow at="math" label="Tiền thuế mỗi tháng (theo giá nhà trung vị)" left="~$520" right="~$440" winner="right" winAt="math" />
      </VsPanel>
    </Window>
    <Window from="ins">
      <Panel kicker="Đừng quên" title="Bảo hiểm nhà" color="red">
        <ChipList
          color="red"
          items={[
            {at: 'ins', text: 'Texas: bão, mưa đá → phí cao', icon: CloudHail},
            {at: 'ins', text: 'California: cháy rừng → khó mua', icon: Flame},
          ]}
        />
      </Panel>
    </Window>
    <SourceNote>C.A.R. (7/2026); Texas Realtors (Q1/2026); Tax Foundation; HUD FMR FY2026; MIT</SourceNote>
  </>
);

const Energy = () => (
  <>
    <ChapterTitle index="HIỆP 4" title="Xăng & điện" hold={2.4} />
    <Score before={[0, 3]} after={[0, 4]} at="win" />
    <Window from="gas" to="heat">
      <VsPanel left={CA} right={TX} title="Xăng (9/2026) và điện">
        <VsRow at="gas" label="Giá xăng / gallon" left="$6,24" right="$3,96" winner="right" winAt="gasm" big />
        <VsRow at="gasm" label="40 gallon / tháng" left="$250" right="$158" winner="right" winAt="gasm" />
        <VsRow at="elec" label="Hóa đơn điện (cùng 900 kWh)" left="~$300" right="~$150" winner="right" winAt="elec" />
      </VsPanel>
    </Window>
    <Window from="heat">
      <Panel kicker="Nhưng" title="Hè Texas rất nóng" color="gold">
        <ChipList items={[{at: 'heat', text: 'Máy lạnh chạy gần cả ngày', icon: Sun}, {at: 'heat', text: 'Khoảng cách thực tế hẹp hơn', icon: CloudSun}]} />
      </Panel>
    </Window>
    <SourceNote>AAA (giá xăng 9/2026); EIA — giá điện dân dụng 2026</SourceNote>
  </>
);

const Income = () => (
  <>
    <ChapterTitle index="HIỆP 5" title="Tiền lương" hold={2.4} />
    <Score before={[0, 4]} after={[1, 4]} at="win" />
    <Window from="med" to="why">
      <VsPanel left={CA} right={TX} title="Thu nhập trung vị hộ gia đình (2024)">
        <VsRow at="med" label="Mỗi năm" left="$100.100" right="$77.500" winner="left" winAt="gap" big />
        <Reveal at="gap" sfx="impact" sfxVolume={0.45}>
          <div style={{fontSize: 38, fontWeight: 800, color: theme.teal, textAlign: 'center'}}>California: +$22.600/năm</div>
        </Reveal>
      </VsPanel>
    </Window>
    <Window from="why">
      <Panel kicker="Lương cao ở California" title="Nếu bạn làm trong ngành" color="teal">
        <ChipList color="teal" items={[{at: 'why', text: 'Công nghệ', icon: Briefcase}, {at: 'why', text: 'Y tế', icon: GraduationCap}, {at: 'why', text: 'Kỹ thuật', icon: Zap}]} />
        <Reveal at="but">
          <div style={{fontSize: 27, color: theme.red, fontWeight: 600}}>Chỉ có lợi nếu chính nghề của bạn được trả cao ở đó</div>
        </Reveal>
      </Panel>
    </Window>
    <SourceNote>U.S. Census Bureau — American Community Survey 2024</SourceNote>
  </>
);

const ScoreScene = () => (
  <>
    <Window from={0} to="single">
      <Dim v={0.55} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 160}}>
        <Reveal at="tally" y={0} scale sfx="impact">
          <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
            <span style={{fontSize: 90, fontWeight: 800, color: theme.teal}}>CALIFORNIA</span>
            <span style={{fontSize: 170, fontWeight: 800, color: theme.text}}>1 – 4</span>
            <span style={{fontSize: 90, fontWeight: 800, color: theme.gold}}>TEXAS</span>
          </div>
        </Reveal>
      </AbsoluteFill>
    </Window>
    <Window from="single">
      <VsPanel left={{name: 'QUẬN CAM', color: 'teal'}} right={{name: 'HOUSTON', color: 'gold'}} title="Chi phí sống thực tế (MIT)">
        <VsRow at="single" label="1 người độc thân / tháng (tập 1)" left="~$4.600" right="~$3.000" winner="right" winAt="single" big />
        <VsRow at="family" label="Gia đình 4 người, 2 vợ chồng đi làm — thu nhập cần / năm" left="~$164.000" right="~$102.000" winner="right" winAt="family" big />
      </VsPanel>
    </Window>
    <SourceNote>MIT Living Wage Calculator — Orange County CA, Harris County & Houston TX</SourceNote>
  </>
);

const VerdictScene = () => (
  <>
    <Window from="v1" to="key">
      <Panel kicker="Nên sống ở đâu?" title="Tùy bạn là ai" width={860}>
        <Verdict at="v1" who="Thu nhập trung bình · muốn mua nhà, nuôi con" verdict="Texas tiết kiệm hơn" color="gold" icon={Home} />
        <Verdict at="v2" who="Ngành lương cao · đã có nhà lâu năm" verdict="California vẫn có lợi" color="teal" icon={Briefcase} />
        <Verdict at="v3" who="Ngoài bảng tính" verdict="Thời tiết · gia đình · cộng đồng Việt" color="blue" icon={Users} />
      </Panel>
    </Window>
    <Window from="key" to="q">
      <Dim v={0.4} />
      <BigLine at="key" text="Rẻ hơn ≠ tiết kiệm hơn — quan trọng là bạn giữ lại được bao nhiêu" size={72} />
    </Window>
    <Window from="q">
      <Dim v={0.5} />
      <QuestionCta at="q" subAt="sub" text="Nếu được chọn, bạn sẽ sống ở California hay Texas?" />
    </Window>
    <div style={{position: 'absolute', bottom: 26, width: '100%', textAlign: 'center', fontSize: 19, color: theme.faint}}>
      Số liệu tham khảo, không phải tư vấn tài chính hay thuế · Video nền: Pixabay
    </div>
  </>
);

export default defineVideo({
  id: 'california-vs-texas',
  narration,
  shots,
  music: {src: 'sound/nhac-nen.mp3', volume: 0.22, duckedVolume: 0.075},
  transitionSfx: 'whoosh',
  cleanScenes: ['hook'],
  scenes: {
    hook: Hook,
    'income-tax': IncomeTax,
    'sales-tax': SalesTax,
    housing: Housing,
    energy: Energy,
    income: Income,
    score: ScoreScene,
    verdict: VerdictScene,
  },
});

