import {Baby, Car, Heart, HeartPulse, Home, MapPin, School, ShoppingCart, Shirt, Users, Wallet} from 'lucide-react';
import {AbsoluteFill} from 'remotion';
import {BarChart} from '../../shared/components/BarChart';
import {StatCard} from '../../shared/components/Card';
import {Reveal} from '../../shared/components/Reveal';
import {SourceNote} from '../../shared/components/SceneParts';
import {defineVideo} from '../../shared/defineVideo';
import {ReceiptLayout} from '../../shared/layouts/ReceiptLayout';
import {Dim, FlipNumber, QuestionCta, Tip, VsPanel, VsRow} from '../../shared/overlays/Extras';
import {ChipList, Panel, PanelStat} from '../../shared/overlays/Panel';
import {BigLine, ChapterTitle, PlaceTag} from '../../shared/overlays/Titles';
import {Window} from '../../shared/overlays/Window';
import {theme} from '../../shared/theme';
import narration from './narration.json';
import shots from './shots.json';

// Gia đình 4 người ở Houston (MIT Harris County, 2 người lớn cùng đi làm, 2 con) — đô/tháng
const FAM = {housing: 1510, childcare: 1690, food: 940, health: 920, transport: 1240, other: 680};

const Hook = () => (
  <>
    <FlipNumber
      to="ans"
      caption="mỗi tháng?"
      steps={[
        {at: 'g1', text: '50 triệu?'},
        {at: 'g2', text: '100 triệu?'},
        {at: 'g3', text: '200 triệu?', color: theme.gold},
      ]}
    />
    <Window from="ans" to="plan">
      <Dim v={0.4} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 160}}>
        <Reveal at="ans" y={0} scale sfx="impact">
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 34, color: theme.text, fontWeight: 600, textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>Gia đình 4 người · Houston · mức cơ bản</div>
            <div style={{fontSize: 200, fontWeight: 800, color: theme.gold, lineHeight: 1.05, textShadow: '0 10px 60px rgba(0,0,0,0.75)'}}>
              ~$7.000<span style={{fontSize: 64, color: theme.text}}>/tháng</span>
            </div>
          </div>
        </Reveal>
      </AbsoluteFill>
    </Window>
    <BigLine at="plan" text="Có một khoản còn đắt hơn cả tiền nhà" size={90} />
  </>
);

const Profile = () => (
  <>
    <Window from="p1">
      <Panel side="left" kicker="Hồ sơ mẫu" title="Gia đình của chúng ta" width={660}>
        <ChipList
          items={[
            {at: 'p1', text: 'Vợ chồng đều đi làm', icon: Users},
            {at: 'p2', text: 'Bé 3 tuổi đi nhà trẻ', icon: Baby},
            {at: 'p3', text: 'Bé 8 tuổi học trường công', icon: School},
            {at: 'p4', text: 'Sống ở Houston, Texas', icon: MapPin},
          ]}
        />
      </Panel>
    </Window>
    <SourceNote>MIT Living Wage Calculator — Harris County, TX (2 người lớn cùng đi làm, 2 con)</SourceNote>
  </>
);

const Housing = () => (
  <>
    <ChapterTitle index="01" title="Nhà ở" hold={2.2} />
    <Window from="rent">
      <Panel kicker="Đưa vào bảng tính" title="Căn hộ 2 phòng ngủ">
        <PanelStat at="rent" label="Gồm điện nước cơ bản, mỗi tháng" value={FAM.housing} note="MIT (dựa trên giá thuê chuẩn HUD)" />
        <Reveal at="more">
          <div style={{fontSize: 27, color: theme.muted}}>Nhà riêng 3 phòng ngủ có sân → cao hơn đáng kể</div>
        </Reveal>
      </Panel>
    </Window>
  </>
);

const Childcare = () => (
  <>
    <ChapterTitle index="02" title="Giữ trẻ" hold={2.2} />
    <Window from="mit" to="us">
      <Panel kicker="Khoản gây sốc nhất" title="Đắt hơn cả tiền nhà" color="red" width={820}>
        <BarChart
          labelWidth={230}
          max={2100}
          bars={[
            {label: 'Giữ trẻ', sub: 'nhà trẻ + sau giờ học', value: FAM.childcare, color: 'red', at: 'mit'},
            {label: 'Tiền nhà', sub: '2 phòng ngủ', value: FAM.housing, color: 'gold', at: 'vs'},
          ]}
        />
      </Panel>
    </Window>
    <Window from="us" to="vn">
      <Panel kicker="Giá gửi trẻ / bé / năm" title="Toàn nước Mỹ" color="red">
        <PanelStat at="us" label="Trung bình năm 2025" value={13184} color="red" note="Child Care Aware of America" />
        <PanelStat at="ca" label="California — có nơi" value={0} text="> $20.000" color="red" />
      </Panel>
    </Window>
    <PlaceTag at="vn" place="ÔNG BÀ TRÔNG CHÁU" sub="Cách nhiều gia đình Việt cắt khoản chi lớn nhất" />
    <SourceNote>MIT Living Wage Calculator; Child Care Aware of America 2025</SourceNote>
  </>
);

const Food = () => (
  <>
    <ChapterTitle index="03" title="Ăn uống" hold={2.2} />
    <Window from="usda">
      <Panel kicker="Tiền chợ gia đình 4 người / tháng" title="Nấu ăn ở nhà">
        <PanelStat at="usda" label="USDA — mức tiết kiệm, toàn quốc (6/2026)" value={1023} color="blue" />
        <PanelStat at="mit" label="Đưa vào bảng tính — Houston (MIT)" value={FAM.food} />
        <Reveal at="real">
          <div style={{fontSize: 27, color: theme.muted}}>Trẻ đang lớn, ăn ngoài cuối tuần → dễ cao hơn</div>
        </Reveal>
      </Panel>
    </Window>
    <SourceNote>USDA Thrifty Food Plan 6/2026 (2 người lớn, con 6–8 & 9–11 tuổi); MIT</SourceNote>
  </>
);

const Health = () => (
  <>
    <ChapterTitle index="04" title="Bảo hiểm sức khỏe" hold={2.2} />
    <Window from="kff">
      <Panel kicker="Gói gia đình qua công ty" title="Ai trả bao nhiêu?" color="teal">
        <PanelStat at="kff" label="Tổng phí / năm (trung bình Mỹ 2025)" value={26993} color="teal" note="KFF Employer Health Benefits Survey" />
        <PanelStat at="share" label="Người lao động tự đóng / tháng" value={571} color="red" />
        <PanelStat at="mit" label="Đưa vào bảng tính: phí + khám, thuốc, nha khoa (MIT)" value={FAM.health} />
      </Panel>
    </Window>
  </>
);

const Transport = () => (
  <>
    <ChapterTitle index="05" title="Đi lại & khoản khác" hold={2.2} />
    <Window from="cars">
      <Panel kicker="Ước tính" title="Hai chiếc xe + chi tiêu khác">
        <PanelStat at="cost" label="Xăng, bảo hiểm, bảo dưỡng 2 xe / tháng" value={FAM.transport} note="Ước tính theo phương pháp MIT" />
        <PanelStat at="other" label="Internet, điện thoại, quần áo, đồ học tập" value={FAM.other} note="Ước tính" />
      </Panel>
    </Window>
  </>
);

const Total = () => (
  <>
    <Dim v={0.62} />
    <ReceiptLayout
      kicker="HOUSTON · GIA ĐÌNH 4 NGƯỜI"
      title="Một tháng ở Mỹ"
      rows={[
        {at: 'l1', icon: Home, label: 'Nhà ở', value: FAM.housing},
        {at: 'l2', icon: Baby, label: 'Giữ trẻ', value: FAM.childcare},
        {at: 'l3', icon: ShoppingCart, label: 'Ăn uống', value: FAM.food},
        {at: 'l4', icon: HeartPulse, label: 'Sức khỏe', value: FAM.health},
        {at: 'l5', icon: Car, label: 'Đi lại', value: FAM.transport},
        {at: 'l6', icon: Shirt, label: 'Khoản khác', value: FAM.other},
      ]}
      total={{at: 'sum', label: 'Tổng / tháng'}}
      aside={
        <>
          <Reveal at="vnd" sfx="pop">
            <div style={{fontSize: 40, fontWeight: 800, color: theme.teal}}>≈ hơn 180 triệu đồng / tháng</div>
          </Reveal>
          <Reveal at="income" sfx="impact" sfxVolume={0.45}>
            <StatCard icon={Wallet} label="Thu nhập cần có (MIT)" valueSize={60} value="$102.000/năm" note="Thu nhập trung vị hộ ở Texas: ~$77.500" color="red" />
          </Reveal>
          <Reveal at="ctc" sfx="pop">
            <StatCard icon={Heart} label="Tín dụng thuế trẻ em 2026" valueSize={56} value="+$370/tháng" note="Tối đa $2.200/con/năm × 2 con" color="teal" />
          </Reveal>
        </>
      }
    />
    <SourceNote>MIT Living Wage Calculator; Census ACS 2024; IRS — Child Tax Credit 2026</SourceNote>
  </>
);

const OC = () => (
  <>
    <Window from="need">
      <VsPanel left={{name: 'HOUSTON', color: 'gold'}} right={{name: 'QUẬN CAM', color: 'teal'}} title="Gia đình 4 người — thu nhập cần có trước thuế (MIT)">
        <VsRow at="need" label="Mỗi năm" left="~$102.000" right="~$164.000" winner="left" winAt="month" big />
        <VsRow at="month" label="Mỗi tháng" left="~$8.500" right="~$13.600" winner="left" winAt="month" />
      </VsPanel>
    </Window>
    <SourceNote>MIT Living Wage Calculator — Harris County TX, Orange County CA</SourceNote>
  </>
);

const Tips = () => (
  <>
    <Window from="t1">
      <Panel kicker="Gia đình Việt xoay xở thế nào?" title="4 cách" width={820}>
        <Tip at="t1" n={1} title="Ông bà, người thân trông trẻ" />
        <Tip at="t2" n={2} title="Sống gần chỗ làm, đi chung xe → một xe" />
        <Tip at="t3" n={3} title="Nấu ở nhà, mua sỉ ở chợ Á Đông" />
        <Tip at="t4" n={4} title="Tín dụng thuế trẻ em + bảo hiểm trẻ em của tiểu bang" />
      </Panel>
    </Window>
  </>
);

const Outro = () => (
  <>
    <Window from={0} to="key">
      <Panel kicker="Tóm lại" title="Gia đình 4 người, mức cơ bản" width={760}>
        <PanelStat at={0.3} label="Houston / tháng" value={0} text="~$7.000" />
        <PanelStat at="oc" label="Quận Cam" value={0} text="gần gấp đôi" color="red" />
      </Panel>
    </Window>
    <Window from="key" to="q">
      <Dim v={0.4} />
      <BigLine at="key" text="Ở Mỹ, gia đình có con nhỏ gần như cần cả hai vợ chồng đi làm" size={74} />
    </Window>
    <Window from="q">
      <Dim v={0.5} />
      <QuestionCta at="q" subAt="sub" text="Gia đình bạn chi bao nhiêu mỗi tháng — khoản nào lớn nhất?" />
    </Window>
    <div style={{position: 'absolute', bottom: 26, width: '100%', textAlign: 'center', fontSize: 19, color: theme.faint}}>
      Số liệu tham khảo, không phải tư vấn tài chính · Video nền: Pixabay
    </div>
  </>
);

export default defineVideo({
  id: 'gia-dinh-4-nguoi',
  narration,
  shots,
  music: {src: 'sound/nhac-nen.mp3', volume: 0.22, duckedVolume: 0.075},
  transitionSfx: 'whoosh',
  cleanScenes: ['hook'],
  scenes: {hook: Hook, profile: Profile, housing: Housing, childcare: Childcare, food: Food, health: Health, transport: Transport, total: Total, oc: OC, tips: Tips, outro: Outro},
  budget: [
    {scene: 'housing', marker: 'rent', label: 'Nhà ở', value: FAM.housing},
    {scene: 'childcare', marker: 'mit', label: 'Giữ trẻ', value: FAM.childcare},
    {scene: 'food', marker: 'mit', label: 'Ăn uống', value: FAM.food},
    {scene: 'health', marker: 'mit', label: 'Sức khỏe', value: FAM.health},
    {scene: 'transport', marker: 'cost', label: 'Đi lại', value: FAM.transport},
    {scene: 'transport', marker: 'other', label: 'Khác', value: FAM.other},
  ],
});
