import {Car, CreditCard, FileText, Fuel, Gauge, IdCard, Landmark, Leaf, Percent, Shield, TrendingDown, Wallet, Wrench} from 'lucide-react';
import {AbsoluteFill} from 'remotion';
import {BarChart} from '../../shared/components/BarChart';
import {StatCard} from '../../shared/components/Card';
import {Reveal} from '../../shared/components/Reveal';
import {SourceNote} from '../../shared/components/SceneParts';
import {defineVideo} from '../../shared/defineVideo';
import {ReceiptLayout} from '../../shared/layouts/ReceiptLayout';
import {PeopleRow} from '../../shared/overlays/BalanceDrain';
import {Dim, QuestionCta, Tip, VsPanel, VsRow} from '../../shared/overlays/Extras';
import {Panel, PanelStat} from '../../shared/overlays/Panel';
import {BigLine, ChapterTitle, PlaceTag} from '../../shared/overlays/Titles';
import {Window} from '../../shared/overlays/Window';
import {theme} from '../../shared/theme';
import narration from './narration.json';
import shots from './shots.json';

// AAA Your Driving Costs 2026: xe mới, 15.000 dặm/năm, 5 năm — làm tròn (đô/năm)
const AAA = {dep: 4420, finance: 1180, insurance: 2100, fuel: 2600, maint: 1760, reg: 800};

const Hook = () => (
  <>
    <Window from="need" to="q">
      <Dim v={0.5} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40, paddingBottom: 170}}>
        <Reveal at="need" sfx="pop">
          <div style={{fontSize: 36, color: theme.muted, fontWeight: 600}}>Hộ gia đình Mỹ có ít nhất 1 xe</div>
        </Reveal>
        <PeopleRow at="need" highlight={9} color={theme.gold} />
        <Reveal at="need" delay={30}>
          <div style={{fontSize: 64, fontWeight: 800, color: theme.text}}>
            <span style={{color: theme.gold}}>91,5%</span> hộ gia đình
          </div>
        </Reveal>
        <Reveal at="work" sfx="pop">
          <div style={{fontSize: 40, fontWeight: 700, color: theme.text}}>
            <span style={{color: theme.teal}}>78%</span> người lao động đi làm bằng ô tô
          </div>
        </Reveal>
      </AbsoluteFill>
    </Window>
    <Window from="ans" to="plan">
      <Dim v={0.4} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 160}}>
        <Reveal at="ans" y={0} scale sfx="impact">
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 34, color: theme.text, fontWeight: 600, textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>Sở hữu một chiếc xe mới · AAA 2026</div>
            <div style={{fontSize: 190, fontWeight: 800, color: theme.gold, lineHeight: 1.05, textShadow: '0 10px 60px rgba(0,0,0,0.75)'}}>
              $12.863<span style={{fontSize: 64, color: theme.text}}>/năm</span>
            </div>
            <div style={{fontSize: 48, color: theme.teal, fontWeight: 700, textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>≈ $1.072 mỗi tháng</div>
          </div>
        </Reveal>
      </AbsoluteFill>
    </Window>
    <BigLine at="plan" text="Từ lúc ký hợp đồng đến mỗi ngày xe lăn bánh" size={86} />
    <Window from="need" to="q">
      <SourceNote>Census ACS 2024 (bảng B08201, B08301)</SourceNote>
    </Window>
  </>
);

const Buy = () => (
  <>
    <ChapterTitle index="01" title="Giá mua" hold={2.2} />
    <Window from="new" to="used">
      <Panel kicker="Giá giao dịch trung bình · 8/2026" title="Xe mới" width={860}>
        <PanelStat at="new" label="Trung bình mọi loại xe" value={50089} />
        <BarChart
          labelWidth={300}
          max={72000}
          bars={[
            {label: 'Sedan nhỏ gọn', value: 27997, color: 'teal', at: 'seg'},
            {label: 'SUV nhỏ gọn', value: 37722, color: 'blue', at: 'seg'},
            {label: 'Bán tải cỡ lớn', value: 67446, color: 'red', at: 'seg'},
          ]}
        />
      </Panel>
    </Window>
    <Window from="used" to="tax">
      <Panel kicker="Không rẻ như nghĩ" title="Xe cũ & thuế nhập khẩu">
        <PanelStat at="used" label="Giá rao bán xe cũ trung bình (8/2026)" value={27239} color="blue" note="Cox Automotive" />
        <PanelStat at="tariff" label="Chi phí tăng thêm / xe nhập (thuế 2025)" value={0} text="$5.000–8.900" color="red" note="Ước tính của Cox Automotive" />
      </Panel>
    </Window>
    <Window from="tax">
      <VsPanel left={{name: 'TEXAS', color: 'gold'}} right={{name: 'CALIFORNIA', color: 'teal'}} title="Thuế khi mua xe">
        <VsRow at="tax" label="Thuế suất" left="6,25%" right="≥ 7,25%" big />
        <VsRow at="taxusd" label="Xe $50.000 → trả thêm" left="$3.131" right="≥ $3.631" winner="left" winAt="taxusd" />
      </VsPanel>
    </Window>
    <SourceNote>Kelley Blue Book / Cox Automotive (8/2026) · Texas Comptroller · CDTFA</SourceNote>
  </>
);

const Loan = () => (
  <>
    <ChapterTitle index="02" title="Tiền vay" hold={2.2} />
    <Window from="share" to="credit">
      <Panel kicker="Xe mới · Q2/2026" title="Vay mua xe" width={800}>
        <PanelStat at="share" label="Người mua xe mới phải vay" value={83} prefix="" suffix="%" color="blue" />
        <PanelStat at="avg" label="Khoản vay trung bình · ~69 tháng" value={43610} note="Góp ~$765/tháng (Experian)" />
        <Reveal at="k" sfx="pop">
          <div style={{fontSize: 32, color: theme.text, fontWeight: 700}}>
            <span style={{color: theme.red}}>21,2%</span> góp ≥ $1.000/tháng — kỷ lục
          </div>
          <div style={{fontSize: 22, color: theme.faint}}>Edmunds Q3/2026</div>
        </Reveal>
      </Panel>
    </Window>
    <Window from="credit">
      <Panel kicker="Lãi suất xe cũ theo điểm tín dụng · Q2/2026" title="Điểm tín dụng quyết định" width={880}>
        <BarChart
          labelWidth={300}
          max={25}
          bars={[
            {label: 'Xuất sắc', sub: '781–850', value: 6.29, valueLabel: '6,3%', color: 'teal', at: 'tiers'},
            {label: 'Tốt', sub: '661–780', value: 8.81, valueLabel: '8,8%', color: 'blue', at: 'tiers'},
            {label: 'Rất thấp', sub: '300–500', value: 21.62, valueLabel: '21,6%', color: 'red', at: 'tiers'},
          ]}
        />
        <Reveal at="ex" sfx="impact" sfxVolume={0.4}>
          <div style={{fontSize: 30, color: theme.text, fontWeight: 600}}>
            Vay $25.000 · 5 năm → tiền lãi <b style={{color: theme.teal}}>$4.200</b> vs <b style={{color: theme.red}}>$16.100</b>
          </div>
        </Reveal>
      </Panel>
    </Window>
    <PlaceTag at="nocredit" place="NGƯỜI MỚI SANG" sub="Chưa có lịch sử tín dụng → dễ rơi vào nhóm lãi cao" />
    <SourceNote>Experian State of the Automotive Finance Market Q2/2026 · Edmunds</SourceNote>
  </>
);

const Insurance = () => (
  <>
    <ChapterTitle index="03" title="Bảo hiểm" hold={2.2} />
    <Window from="avg" to="young">
      <Panel kicker="Bảo hiểm toàn diện / năm · 2026" title="Mỗi bang một giá" width={860}>
        <PanelStat at="avg" label="Trung bình toàn nước Mỹ" value={2361} color="blue" />
        <BarChart
          labelWidth={260}
          max={4400}
          bars={[
            {label: 'California', value: 1894, color: 'teal', at: 'states'},
            {label: 'Texas', value: 3652, color: 'red', at: 'states'},
          ]}
        />
      </Panel>
    </Window>
    <Window from="young">
      <Panel kicker="Tài xế ít kinh nghiệm" title="Trả nhiều hơn" color="red">
        <PanelStat at="young" label="Tài xế 20 tuổi / năm" value={4722} color="red" note="Tài xế 35 tuổi: $2.361" />
        <Reveal at="newbie" sfx="pop">
          <div style={{fontSize: 29, color: theme.text, fontWeight: 600}}>Mới sang, chưa có lịch sử lái xe ở Mỹ → phí thường cao hơn vài năm đầu</div>
        </Reveal>
      </Panel>
    </Window>
    <SourceNote>NerdWallet (10/2026) — tài xế 35 tuổi, tín dụng tốt, không vi phạm</SourceNote>
  </>
);

const FuelScene = () => (
  <>
    <ChapterTitle index="04" title="Xăng" hold={2.2} />
    <Window from="nat" to="miles">
      <VsPanel left={{name: 'CẢ NƯỚC', color: 'gold'}} right={{name: 'CALIFORNIA', color: 'red'}} title="Giá xăng thường / ga-lông · 12/10/2026">
        <VsRow at="nat" label="AAA" left="$4,36" right="$6,31" big />
      </VsPanel>
    </Window>
    <Window from="miles">
      <Panel kicker="Tài xế trung bình" title="Tiền xăng một năm" width={800}>
        <PanelStat at="miles" label="Quãng đường / năm" value={0} text="~13.500 dặm" note="≈ 21.700 km (FHWA)" color="blue" />
        <PanelStat at="cost" label="Xe 25 dặm/ga-lông · giá cả nước" value={2350} />
        <PanelStat at="cacost" label="Cùng xe đó ở California" value={3400} color="red" />
      </Panel>
    </Window>
    <SourceNote>AAA Gas Prices (12/10/2026) · FHWA · ước tính 25 dặm/ga-lông (~9,4 lít/100 km)</SourceNote>
  </>
);

const Hidden = () => (
  <>
    <ChapterTitle index="05" title="Chi phí ẩn" hold={2.2} />
    <Window from="dep" to="maint">
      <Panel kicker="Khoản lớn nhất ít ai thấy" title="Xe mất giá" color="red">
        <PanelStat at="dep" label="Trung bình mỗi năm, 5 năm đầu (AAA)" value={4422} color="red" />
        <PanelStat at="five" label="Giá trị còn lại sau 5 năm" value={0} text="~58%" color="red" note="iSeeCars 2026: mất trung bình 41,8%" />
      </Panel>
    </Window>
    <Window from="maint">
      <Panel kicker="Mỗi năm" title="Giữ xe chạy tốt" width={800}>
        <PanelStat at="maint" label="Bảo dưỡng, sửa chữa, lốp" value={1755} note="AAA 2026: 11,7 xu/dặm × 15.000 dặm" />
        <PanelStat at="reg" label="Đăng ký, biển số, thuế" value={802} color="blue" />
        <Reveal at="park" sfx="pop">
          <div style={{fontSize: 29, color: theme.text, fontWeight: 600}}>Đậu xe ở trung tâm New York, San Francisco: vài trăm đô/tháng</div>
        </Reveal>
      </Panel>
    </Window>
    <SourceNote>AAA Your Driving Costs 2026 · iSeeCars (2026)</SourceNote>
  </>
);

const Total = () => (
  <>
    <Dim v={0.62} />
    <ReceiptLayout
      kicker="AAA 2026 · XE MỚI · 15.000 DẶM/NĂM"
      title="Một năm nuôi xe"
      rows={[
        {at: 'l1', icon: TrendingDown, label: 'Mất giá', value: AAA.dep},
        {at: 'l2', icon: Landmark, label: 'Lãi vay', value: AAA.finance},
        {at: 'l3', icon: Shield, label: 'Bảo hiểm', value: AAA.insurance},
        {at: 'l4', icon: Fuel, label: 'Xăng', value: AAA.fuel},
        {at: 'l5', icon: Wrench, label: 'Bảo dưỡng & lốp', value: AAA.maint},
        {at: 'l6', icon: FileText, label: 'Đăng ký & thuế', value: AAA.reg},
      ]}
      total={{at: 'sum', label: 'Tổng / năm'}}
      aside={
        <>
          <Reveal at="mo" sfx="pop">
            <div style={{fontSize: 44, fontWeight: 800, color: theme.gold}}>≈ $1.070 / tháng</div>
          </Reveal>
          <Reveal at="vnd" sfx="pop">
            <div style={{fontSize: 38, fontWeight: 800, color: theme.teal}}>≈ 28 triệu đồng / tháng</div>
          </Reveal>
          <Reveal at="income" sfx="impact" sfxVolume={0.45}>
            <StatCard icon={Wallet} label="Chi phí xe ≤ 10% thu nhập → cần" valueSize={60} value="~$129.000/năm" note="Quy tắc 20/4/10" color="red" />
          </Reveal>
        </>
      }
    />
    <SourceNote>AAA Your Driving Costs 2026 (làm tròn) — giả định vay 5 năm, trả trước 15%</SourceNote>
  </>
);

const Tips = () => (
  <>
    <Window from="t1" to="lic">
      <Panel kicker="Nuôi xe nhẹ nhàng hơn" title="5 cách" width={880}>
        <Tip at="t1" n={1} title="Quy tắc 20/4/10: trả trước 20% · vay ≤ 4 năm · ≤ 10% thu nhập" />
        <Tip at="t2" n={2} title="Xe đã qua sử dụng 2–3 năm tuổi" />
        <Tip at="t3" n={3} title="Xây điểm tín dụng · so lãi ngân hàng, credit union trước" />
        <Tip at="t4" n={4} title="So sánh báo giá bảo hiểm mỗi năm" />
        <Tip at="t5" n={5} title="Xe tiết kiệm xăng · hybrid ~$10.200/năm (rẻ nhất)" />
      </Panel>
    </Window>
    <Window from="lic">
      <Panel kicker="Người mới sang" title="Bằng lái xe" color="teal" width={760}>
        <StatCard icon={IdCard} label="Bằng Việt Nam" valueSize={46} value="Không đổi trực tiếp" note="Texas, California: thi lý thuyết + thi lái" color="teal" />
      </Panel>
    </Window>
    <SourceNote>Chase · AAA 2026 · Texas DPS · California DMV · Số liệu tham khảo, không phải tư vấn tài chính</SourceNote>
  </>
);

const Outro = () => (
  <>
    <Window from={0} to="key">
      <Panel kicker="Tóm lại" title="Giá mua chỉ là phần nổi" width={760}>
        <PanelStat at={0.3} label="Giá xe mới trung bình" value={50089} />
        <PanelStat at={0.3} label="Nuôi xe mỗi năm" value={12863} color="red" />
      </Panel>
    </Window>
    <Window from="key" to="q">
      <Dim v={0.4} />
      <BigLine at="key" to="q" text="Mỗi năm, nuôi xe tốn khoảng 1/4 giá chiếc xe" size={84} />
    </Window>
    <Window from="q">
      <Dim v={0.5} />
      <QuestionCta at="q" subAt="sub" text="Xe của bạn tốn bao nhiêu mỗi tháng — xe mới hay xe cũ?" />
    </Window>
    <div style={{position: 'absolute', bottom: 26, width: '100%', textAlign: 'center', fontSize: 19, color: theme.faint}}>
      Số liệu tham khảo, không phải tư vấn tài chính · Video nền: Pixabay
    </div>
  </>
);

export default defineVideo({
  id: 'chi-phi-o-to',
  narration,
  shots,
  music: {src: 'sound/nhac-nen.mp3', volume: 0.22, duckedVolume: 0.075},
  transitionSfx: 'whoosh',
  cleanScenes: ['hook'],
  scenes: {hook: Hook, buy: Buy, loan: Loan, insurance: Insurance, fuel: FuelScene, hidden: Hidden, total: Total, tips: Tips, outro: Outro},
});
