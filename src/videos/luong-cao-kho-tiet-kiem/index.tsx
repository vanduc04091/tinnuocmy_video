import {Briefcase, Car, Code, CreditCard, GraduationCap, HandCoins, Home, MapPin, PiggyBank, Receipt, Repeat, ShieldCheck, TrendingUp, User, Utensils, Wallet} from 'lucide-react';
import {AbsoluteFill} from 'remotion';
import {BarChart} from '../../shared/components/BarChart';
import {StatCard} from '../../shared/components/Card';
import {Reveal} from '../../shared/components/Reveal';
import {SourceNote} from '../../shared/components/SceneParts';
import {defineVideo} from '../../shared/defineVideo';
import {BalanceDrain, PeopleRow} from '../../shared/overlays/BalanceDrain';
import {Dim, QuestionCta, Tip, VsPanel, VsRow} from '../../shared/overlays/Extras';
import {ChipList, Panel, PanelStat} from '../../shared/overlays/Panel';
import {BigLine, ChapterTitle, PlaceTag} from '../../shared/overlays/Titles';
import {Window} from '../../shared/overlays/Window';
import {theme} from '../../shared/theme';
import narration from './narration.json';
import shots from './shots.json';

// Độc thân, lương $150.000/năm ở San Francisco, 2026 (xem docs/kich-ban/luong-cao-kho-tiet-kiem.md)
const GROSS = 12500;
const TAX = {fed: 2061, fica: 956, ca: 973}; // thuế liên bang; An sinh XH + Medicare; thuế CA + SDI (làm tròn để khớp $8.510)
const NET = 8510;
// Một tháng minh họa
const MONTH = {rent: 4400, car: 765, student: 450, living: 1500, family: 500, subs: 220};

const Hook = () => (
  <>
    <Window from={0} to="pct">
      <Dim v={0.35} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 160}}>
        <Reveal at={0.2} y={0} scale sfx="impact">
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 180, fontWeight: 800, color: theme.gold, lineHeight: 1.05, textShadow: '0 10px 60px rgba(0,0,0,0.75)'}}>
              $150.000<span style={{fontSize: 64, color: theme.text}}>/năm</span>
            </div>
          </div>
        </Reveal>
        <Reveal at="vnd" sfx="pop">
          <div style={{fontSize: 54, fontWeight: 700, color: theme.teal, textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>≈ 3,9 tỷ đồng</div>
        </Reveal>
      </AbsoluteFill>
    </Window>
    <Window from="pct" to="plan">
      <Dim v={0.5} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40, paddingBottom: 170}}>
        <Reveal at="pct" sfx="pop">
          <div style={{fontSize: 36, color: theme.muted, fontWeight: 600, textAlign: 'center'}}>
            Sống <b style={{color: theme.text}}>hết tháng hết tiền</b> · đầu năm 2026
          </div>
        </Reveal>
        <Reveal at="pct" delay={20} y={0} scale sfx="impact" sfxVolume={0.45}>
          <div style={{display: 'flex', gap: 120, alignItems: 'flex-end'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: 150, fontWeight: 800, color: theme.red, lineHeight: 1}}>46%</div>
              <div style={{fontSize: 32, color: theme.text, fontWeight: 600}}>thu nhập trên $150.000</div>
            </div>
            <Reveal at="mid" y={0} scale sfx="pop">
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: 150, fontWeight: 800, color: theme.gold, lineHeight: 1}}>&gt;60%</div>
                <div style={{fontSize: 32, color: theme.text, fontWeight: 600}}>thu nhập $100.000–150.000</div>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </AbsoluteFill>
    </Window>
    <BigLine at="plan" text="Lương cao như vậy, tiền đi đâu hết?" size={92} />
    <Window from="pct" to="plan">
      <SourceNote>PYMNTS Intelligence — The American Paycheck 2026 (dữ liệu tháng 1/2026)</SourceNote>
    </Window>
  </>
);

const Profile = () => (
  <>
    <PlaceTag at={0.3} to="p1" place="SAN FRANCISCO, CALIFORNIA" sub="Một trong những nơi đắt đỏ nhất nước Mỹ" />
    <Window from="p1">
      <Panel side="left" kicker="Nhân vật của chúng ta" title="Lương sáu chữ số" width={680}>
        <ChipList
          items={[
            {at: 'p1', text: 'Độc thân', icon: User},
            {at: 'p2', text: 'Kỹ sư phần mềm · San Francisco', icon: Code},
            {at: 'p3', text: '$150.000/năm = $12.500/tháng', icon: Briefcase},
          ]}
        />
        <Reveal at="p4">
          <div style={{fontSize: 27, color: theme.muted}}>Không thiếu tiền — nhưng không dư dả như nhiều người nghĩ</div>
        </Reveal>
      </Panel>
    </Window>
  </>
);

const Tax = () => (
  <>
    <ChapterTitle index="01" title="Thuế" hold={2.2} />
    <Window from="fed">
      <Panel kicker="Lương trước thuế mỗi tháng" title="Tiền đi trước khi về tay" width={780}>
        <BalanceDrain
          start={{at: 'fed', value: GROSS, label: 'Lương gộp'}}
          items={[
            {at: 'fed', label: 'Thuế thu nhập liên bang', value: TAX.fed, icon: Receipt},
            {at: 'fica', label: 'An sinh xã hội + Medicare', value: TAX.fica, icon: ShieldCheck},
            {at: 'ca', label: 'Thuế California + SDI', value: TAX.ca, icon: MapPin},
          ]}
          result={{at: 'net', label: 'Về tay mỗi tháng'}}
        />
        <Reveal at="third" sfx="pop">
          <div style={{fontSize: 30, color: theme.red, fontWeight: 700}}>≈ 32% lương đã đi vào thuế</div>
        </Reveal>
      </Panel>
    </Window>
    <SourceNote>Ước tính 2026: IRS (biểu thuế liên bang), SSA, EDD (SDI 1,3%), FTB California (biểu thuế 2025) · độc thân, khấu trừ chuẩn</SourceNote>
  </>
);

const Housing = () => (
  <>
    <ChapterTitle index="02" title="Nhà ở" hold={2.2} />
    <Window from="rent" to="buy">
      <Panel kicker="Thuê nhà · San Francisco" title="Căn hộ 1 phòng ngủ">
        <PanelStat at="rent" label="Giá thuê trung vị / tháng (+25% trong 1 năm)" value={4400} color="red" />
        <PanelStat at="share" label="Phần lương về tay dành cho tiền nhà" value={52} prefix="" suffix="%" color="red" note="Lời khuyên phổ biến: không quá 30%" />
      </Panel>
    </Window>
    <Window from="buy">
      <Panel kicker="Mua nhà · vay 30 năm, lãi ~7,4%" title="Trả trước 20%" width={820}>
        <PanelStat at="buy" label="Giá nhà trung vị San Francisco" value={0} text="~$1,55 triệu" />
        <PanelStat at="pay" label="Tiền góp mỗi tháng (gốc + lãi)" value={8590} color="red" note="Chưa gồm thuế nhà đất và bảo hiểm" />
        <Reveal at="more" sfx="pop">
          <div style={{fontSize: 30, color: theme.red, fontWeight: 700}}>&gt; toàn bộ lương về tay ($8.510)</div>
        </Reveal>
        <PanelStat at="us" label="Nhà trung vị toàn nước Mỹ ($429.100) → góp / tháng" value={2380} color="blue" />
      </Panel>
    </Window>
    <SourceNote>Zumper (9/2026) · Redfin 2026 · NAR (8/2026) · Freddie Mac PMMS (10/2026: 7,40%)</SourceNote>
  </>
);

const Debt = () => (
  <>
    <ChapterTitle index="03" title="Nợ cố định" hold={2.2} />
    <Window from="car" to="student">
      <Panel kicker="Xe hơi" title="Tiền góp xe mới" color="red">
        <PanelStat at="car" label="Trung bình mỗi tháng (Q2/2026)" value={765} color="red" note="Experian" />
        <Reveal at="k" sfx="pop">
          <div style={{fontSize: 34, color: theme.text, fontWeight: 700}}>
            <span style={{color: theme.red}}>1/5</span> người mua xe mới trả &gt; $1.000/tháng
          </div>
          <div style={{fontSize: 22, color: theme.faint}}>Edmunds Q3/2026: 21,2% — mức kỷ lục</div>
        </Reveal>
      </Panel>
    </Window>
    <Window from="student" to="card">
      <Panel kicker="Nợ sinh viên" title="Vay liên bang">
        <PanelStat at="student" label="Dư nợ trung bình mỗi người" value={39500} note="Education Data Initiative 2026" />
        <PanelStat at="student" label="Trả trong 10 năm (ước tính) / tháng" value={450} color="red" />
      </Panel>
    </Window>
    <Window from="card">
      <Panel kicker="Thẻ tín dụng" title="Cả nước Mỹ" color="red">
        <PanelStat at="card" label="Tổng dư nợ (Q2/2026)" value={0} text="$1.260 tỷ" color="red" note="New York Fed" />
        <PanelStat at="card" label="Lãi suất trung bình / năm" value={0} text="21,2%" color="red" note="Fed G.19 (8/2026)" />
      </Panel>
    </Window>
  </>
);

const Creep = () => (
  <>
    <ChapterTitle index="04" title="Lạm phát lối sống" hold={2.2} />
    <Window from="raise" to="shed">
      <Panel kicker="Lương tăng →" title="Chi tiêu tăng theo" width={680}>
        <ChipList
          items={[
            {at: 'raise', text: 'Xe đẹp hơn', icon: Car},
            {at: 'raise', text: 'Nhà rộng hơn', icon: Home},
            {at: 'raise', text: 'Nhà hàng thay bữa cơm nhà', icon: Utensils},
          ]}
        />
      </Panel>
    </Window>
    <Window from="shed" to="sub">
      <Panel kicker="Fed — SHED 2025" title="Trong năm qua…" width={860}>
        <BarChart
          labelWidth={300}
          max={45}
          bars={[
            {label: 'Chi tiêu tăng', value: 35, valueLabel: '35%', color: 'red', at: 'shed'},
            {label: 'Thu nhập tăng', value: 32, valueLabel: '32%', color: 'teal', at: 'shed'},
          ]}
        />
        <Reveal at="choice" sfx="pop">
          <div style={{fontSize: 30, color: theme.text, fontWeight: 600}}>
            Thu nhập &gt;$150.000, hết tháng hết tiền: <b style={{color: theme.gold}}>~1/2</b> nói là do lựa chọn
          </div>
        </Reveal>
      </Panel>
    </Window>
    <Window from="sub">
      <VsPanel left={{name: 'NGHĨ LÀ', color: 'teal'}} right={{name: 'THỰC TẾ', color: 'red'}} title="Dịch vụ trả phí định kỳ mỗi tháng" width={980}>
        <VsRow at="sub" label="Netflix, nhạc, app, phòng gym…" left="$86" right="$219" winner="right" winAt="real" big note="C+R Research (khảo sát 2022)" />
      </VsPanel>
    </Window>
  </>
);

const Family = () => (
  <>
    <ChapterTitle index="05" title="Gửi tiền về quê" hold={2.2} />
    <Window from="vn">
      <Panel kicker="Kiều hối" title="Tiền gửi về Việt Nam" color="teal">
        <PanelStat at="vn" label="Cả nước, năm 2024" value={0} text="~$16 tỷ" color="teal" />
        <PanelStat at="hcm" label="Riêng TP.HCM, năm 2025" value={0} text="$10,34 tỷ" color="teal" />
      </Panel>
    </Window>
    <PlaceTag at="duty" place="TÌNH NGHĨA & KẾ HOẠCH" sub="Giúp gia đình — nhưng đừng quên quỹ tương lai của chính mình" />
    <SourceNote>Ngân hàng Nhà nước (VnEconomy); Vietnam News</SourceNote>
  </>
);

const Month = () => (
  <>
    <Window from="start" to="fed">
      <Panel side="left" kicker="Ví dụ minh họa · San Francisco" title="Một tháng của người kỹ sư" width={800}>
        <BalanceDrain
          start={{at: 'start', value: NET, label: 'Về tay'}}
          items={[
            {at: 'c1', label: 'Tiền nhà (1 phòng ngủ)', value: MONTH.rent, icon: Home},
            {at: 'c2', label: 'Góp xe', value: MONTH.car, icon: Car},
            {at: 'c3', label: 'Nợ sinh viên', value: MONTH.student, icon: GraduationCap},
            {at: 'c4', label: 'Ăn uống & sinh hoạt (ước tính)', value: MONTH.living, icon: Utensils},
            {at: 'c5', label: 'Gửi về gia đình', value: MONTH.family, icon: HandCoins},
            {at: 'c6', label: 'Dịch vụ trả phí + mua trả sau', value: MONTH.subs, icon: Repeat},
          ]}
          result={{at: 'left', label: 'Còn lại cuối tháng'}}
        />
      </Panel>
    </Window>
    <Window from="left" to="fed">
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-end', padding: '0 110px 140px 0'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 22, width: 560}}>
          <Reveal at="left" sfx="pop">
            <StatCard icon={PiggyBank} label="Phần để dành" valueSize={60} value="~5,4% lương" note="$675 / $12.500" color="gold" />
          </Reveal>
          <Reveal at="rate" sfx="pop">
            <StatCard icon={TrendingUp} label="Tỷ lệ tiết kiệm của người Mỹ (8/2026)" valueSize={60} value="4,1%" note="BEA · trước đại dịch ~7%" color="red" />
          </Reveal>
        </div>
      </AbsoluteFill>
    </Window>
    <Window from="fed">
      <Dim v={0.5} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 44, paddingBottom: 170}}>
        <Reveal at="fed" sfx="pop">
          <div style={{fontSize: 34, color: theme.muted, fontWeight: 600, textAlign: 'center'}}>
            Thu nhập trên <b style={{color: theme.text}}>$100.000</b> · có quỹ dự phòng 3 tháng?
          </div>
        </Reveal>
        <PeopleRow at="fed" total={4} highlight={3} />
        <Reveal at="fed" delay={40}>
          <div style={{fontSize: 64, fontWeight: 800, color: theme.text}}>
            <span style={{color: theme.red}}>1/4</span> người không có
          </div>
        </Reveal>
      </AbsoluteFill>
    </Window>
    <SourceNote>Ví dụ minh họa · BEA (8/2026) · Fed SHED 2025</SourceNote>
  </>
);

const Tips = () => (
  <>
    <Dim v={0.3} />
    <Window from="t1">
      <Panel side="left" kicker="Giữ tiền khi lương cao" title="5 nguyên tắc" width={860}>
        <Tip at="t1" n={1} title="Trả cho mình trước · 401(k) lấy đủ phần công ty góp (~4,7%)" />
        <Tip at="t2" n={2} title="Tiền nhà dưới 30% thu nhập" />
        <Tip at="t3" n={3} title="Xe vừa túi tiền · tránh góp $1.000/tháng" />
        <Tip at="t4" n={4} title="Trả hết thẻ tín dụng mỗi tháng" />
        <Tip at="t5" n={5} title="Tăng lương → để dành ít nhất một nửa" />
      </Panel>
    </Window>
    <Window from="fund">
      <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'flex-end', padding: '150px 110px 0 0'}}>
        <div style={{width: 520}}>
          <Reveal at="fund" sfx="pop">
            <StatCard icon={Wallet} label="Quỹ khẩn cấp 3–6 tháng · lãi tiết kiệm" valueSize={56} value="~4% vs 0,37%" note="Tài khoản lãi cao vs trung bình (FDIC 9/2026)" color="teal" />
          </Reveal>
        </div>
      </AbsoluteFill>
    </Window>
    <SourceNote>Vanguard How America Saves 2026 · FDIC · Số liệu tham khảo, không phải tư vấn tài chính</SourceNote>
  </>
);

const Outro = () => (
  <>
    <Window from={0} to="key">
      <Panel kicker="Tóm lại" title="Lương cao ≠ giàu" width={760}>
        <PanelStat at={0.3} label="Lương gộp / tháng" value={GROSS} />
        <PanelStat at={0.3} label="Còn để dành" value={675} color="red" />
      </Panel>
    </Window>
    <Window from="key" to="q">
      <Dim v={0.4} />
      <BigLine at="key" to="q" text="Điều quyết định là khoảng cách giữa tiền kiếm được và tiền tiêu đi" size={74} />
    </Window>
    <Window from="q">
      <Dim v={0.5} />
      <QuestionCta at="q" subAt="sub" text="Tăng lương $1.000/tháng — bạn sẽ làm gì đầu tiên?" />
    </Window>
    <div style={{position: 'absolute', bottom: 26, width: '100%', textAlign: 'center', fontSize: 19, color: theme.faint}}>
      Số liệu tham khảo, không phải tư vấn tài chính · Video nền: Pixabay
    </div>
  </>
);

export default defineVideo({
  id: 'luong-cao-kho-tiet-kiem',
  narration,
  shots,
  music: {src: 'sound/nhac-nen.mp3', volume: 0.22, duckedVolume: 0.075},
  transitionSfx: 'whoosh',
  cleanScenes: ['hook'],
  scenes: {hook: Hook, profile: Profile, tax: Tax, housing: Housing, debt: Debt, creep: Creep, family: Family, month: Month, tips: Tips, outro: Outro},
});
