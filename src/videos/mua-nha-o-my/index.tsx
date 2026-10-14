import {FileText, Home, Landmark, Shield, Umbrella, Users, Wallet} from 'lucide-react';
import {AbsoluteFill} from 'remotion';
import {BarChart} from '../../shared/components/BarChart';
import {StatCard} from '../../shared/components/Card';
import {Reveal} from '../../shared/components/Reveal';
import {SourceNote} from '../../shared/components/SceneParts';
import {defineVideo} from '../../shared/defineVideo';
import {ReceiptLayout} from '../../shared/layouts/ReceiptLayout';
import {Dim, QuestionCta, Tip, VsPanel, VsRow} from '../../shared/overlays/Extras';
import {ChipList, Panel, PanelStat} from '../../shared/overlays/Panel';
import {BigLine, ChapterTitle} from '../../shared/overlays/Titles';
import {Window} from '../../shared/overlays/Window';
import {theme} from '../../shared/theme';
import narration from './narration.json';
import shots from './shots.json';

// Houston: nhà trung vị $330.000 (HAR 8/2026), trả trước 10%, vay 30 năm 7,40%, thuế ~2%, bảo hiểm ~$4.600/năm, PMI 0,5%
const HOU = {pi: 2056, tax: 550, ins: 383, pmi: 124};

const Hook = () => (
  <>
    <Window from="price" to="q">
      <Dim v={0.45} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 170}}>
        <Reveal at="price" y={0} scale sfx="impact">
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 34, color: theme.text, fontWeight: 600, textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>Giá nhà trung vị toàn nước Mỹ · 9/2026</div>
            <div style={{fontSize: 190, fontWeight: 800, color: theme.gold, lineHeight: 1.05, textShadow: '0 10px 60px rgba(0,0,0,0.75)'}}>$417.500</div>
            <div style={{fontSize: 46, color: theme.teal, fontWeight: 700, textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>≈ 10,9 tỷ đồng</div>
          </div>
        </Reveal>
        <div style={{display: 'flex', gap: 90, marginTop: 34}}>
          <Reveal at="age" sfx="pop">
            <div style={{fontSize: 40, fontWeight: 700, color: theme.text, textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>
              Mua lần đầu: <span style={{color: theme.red}}>40 tuổi</span>
            </div>
          </Reveal>
          <Reveal at="share" sfx="pop">
            <div style={{fontSize: 40, fontWeight: 700, color: theme.text, textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>
              chỉ <span style={{color: theme.red}}>21%</span> người mua
            </div>
          </Reveal>
        </div>
      </AbsoluteFill>
    </Window>
    <BigLine at="q" to="plan" text="Cần bao nhiêu tiền để mua nhà ở Mỹ?" size={92} />
    <BigLine at="plan" text="Houston và Quận Cam" size={96} />
    <Window from="price" to="q">
      <SourceNote>NAR — Existing-Home Sales 9/2026 · NAR Profile of Home Buyers and Sellers 2025</SourceNote>
    </Window>
  </>
);

const Down = () => (
  <>
    <ChapterTitle index="01" title="Tiền trả trước" hold={2.2} />
    <Window from="myth" to="ex">
      <Panel kicker="Không cần đủ 20%" title="Thực tế trả trước bao nhiêu?" width={860}>
        <BarChart
          labelWidth={330}
          max={26}
          bars={[
            {label: 'Vay FHA', sub: 'điểm tín dụng ≥ 580', value: 3.5, valueLabel: '3,5%', color: 'teal', at: 'fha'},
            {label: 'Mua lần đầu', sub: 'trung vị', value: 10, valueLabel: '10%', color: 'gold', at: 'real'},
            {label: 'Mua lần sau', sub: 'trung vị', value: 23, valueLabel: '23%', color: 'blue', at: 'real'},
          ]}
        />
        <Reveal at="pmi" sfx="pop">
          <div style={{fontSize: 29, color: theme.red, fontWeight: 600}}>Dưới 20% → đóng thêm bảo hiểm khoản vay (PMI/MIP)</div>
        </Reveal>
      </Panel>
    </Window>
    <Window from="ex">
      <Panel kicker="Nhà trung vị Houston · $330.000" title="Tiền trả trước" width={760}>
        <PanelStat at="ex" label="3,5% (FHA)" value={11550} color="teal" />
        <PanelStat at="ex" label="10%" value={33000} />
        <PanelStat at="ex" label="20%" value={66000} color="blue" />
      </Panel>
    </Window>
    <SourceNote>NAR Profile 2025 · HUD (FHA) · Fannie Mae/Freddie Mac · HAR (Houston, 8/2026)</SourceNote>
  </>
);

const Closing = () => (
  <>
    <ChapterTitle index="02" title="Chi phí đóng hồ sơ" hold={2.2} />
    <Window from="avg">
      <Panel kicker="Closing costs" title="Phí khi ký giấy tờ" width={820}>
        <PanelStat at="avg" label="Bảo hiểm quyền sở hữu, thủ tục, đăng ký (trung bình Mỹ)" value={4528} note="LodeStar 2026" />
        <PanelStat at="more" label="Dự trù cả phí ngân hàng + thuế, bảo hiểm trả trước" value={0} text="2–5% giá nhà" color="red" />
        <Reveal at="cash" sfx="impact" sfxVolume={0.45}>
          <StatCard icon={Wallet} label="Houston · trả trước 10% + đóng hồ sơ ~3%" valueSize={56} value="~$43.000 ≈ 1,1 tỷ đ" note="Chưa kể quỹ dự phòng" color="gold" />
        </Reveal>
      </Panel>
    </Window>
    <SourceNote>LodeStar Software Solutions (2026) · Bankrate · ước tính</SourceNote>
  </>
);

const Monthly = () => (
  <>
    <ChapterTitle index="03" title="Tiền góp hằng tháng" hold={2.2} />
    <Window from="rate" to="l1">
      <VsPanel left={{name: '10/2025', color: 'teal'}} right={{name: '10/2026', color: 'red'}} title="Lãi suất vay 30 năm cố định · Freddie Mac">
        <VsRow at="rate" label="Trung bình" left="6,30%" right="7,40%" winner="right" winAt="rate" big />
      </VsPanel>
    </Window>
    <Window from="l1">
      <Dim v={0.55} />
      <ReceiptLayout
        kicker="HOUSTON · NHÀ $330.000 · TRẢ TRƯỚC 10% · LÃI 7,4%"
        title="Mỗi tháng phải trả"
        rows={[
          {at: 'l1', icon: Landmark, label: 'Gốc + lãi', value: HOU.pi},
          {at: 'l2', icon: FileText, label: 'Thuế nhà đất (~2%)', value: HOU.tax},
          {at: 'l3', icon: Umbrella, label: 'Bảo hiểm nhà', value: HOU.ins},
          {at: 'l4', icon: Shield, label: 'Bảo hiểm khoản vay', value: HOU.pmi},
        ]}
        total={{at: 'sum', label: 'Tổng / tháng'}}
        aside={
          <Reveal at="rent" sfx="impact" sfxVolume={0.45}>
            <StatCard icon={Home} label="Giá thuê trung vị toàn Mỹ (9/2026)" valueSize={60} value="~$1.388/tháng" note="Apartment List" color="teal" />
          </Reveal>
        }
      />
    </Window>
    <SourceNote>Freddie Mac PMMS (8/10/2026) · ước tính: thuế ~2%, bảo hiểm ~$4.600/năm, PMI 0,5%</SourceNote>
  </>
);

const TaxIns = () => (
  <>
    <ChapterTitle index="04" title="Thuế nhà & bảo hiểm" hold={2.2} />
    <Window from="tx" to="ins">
      <VsPanel left={{name: 'HOUSTON', color: 'gold'}} right={{name: 'QUẬN CAM', color: 'teal'}} title="Thuế nhà đất mỗi năm · người mới mua">
        <VsRow at="tx" label="Tỷ lệ trên giá trị nhà" left="~2%" right="~1,1%" big />
        <VsRow at="tx" label="Miễn trừ / giới hạn" left="−$140.000 (thuế trường học)" right="tăng ≤ 2%/năm (Prop 13)" />
      </VsPanel>
    </Window>
    <Window from="ins">
      <Panel kicker="Bảo hiểm nhà" title="Bão, lũ và cháy rừng" width={860} color="red">
        <PanelStat at="ins" label="Texas · trung bình mỗi năm" value={4600} color="red" note="NerdWallet / Insurify" />
        <ChipList
          color="red"
          items={[
            {at: 'flood', text: 'Houston: có thể phải mua thêm bảo hiểm lũ', icon: Umbrella},
            {at: 'cains', text: 'California: nhiều hãng ngừng bán mới', icon: Shield},
            {at: 'cains', text: 'Gói FAIR Plan tăng 29,1% từ 15/10/2026', icon: FileText},
          ]}
        />
      </Panel>
    </Window>
    <SourceNote>Harris County · Texas (Prop 13, 11/2025) · Orange County · NerdWallet · California FAIR Plan</SourceNote>
  </>
);

const OC = () => (
  <>
    <ChapterTitle index="05" title="Quận Cam" hold={2.2} />
    <Window from="price">
      <VsPanel left={{name: 'HOUSTON', color: 'gold'}} right={{name: 'QUẬN CAM', color: 'red'}} title="Trả trước 20% · vay 30 năm 7,4%" width={1150}>
        <VsRow at="price" label="Giá nhà trung vị" left="$330.000" right="$1,22 triệu" big />
        <VsRow at="down" label="Trả trước 20%" left="$66.000" right="$244.000" />
        <VsRow at="month" label="Góp + thuế + bảo hiểm / tháng" left="~$2.760" right="~$8.100" />
        <VsRow at="income" label="Thu nhập cần có / năm (quy tắc 28%)" left="~$118.000" right="~$347.000" winner="left" winAt="vs" />
      </VsPanel>
    </Window>
    <SourceNote>Redfin (Orange County, 8/2026, mọi loại nhà) · HAR · ước tính bảo hiểm OC $2.500/năm (có thể cao hơn)</SourceNote>
  </>
);

const Income = () => (
  <>
    <ChapterTitle index="06" title="Thu nhập có đủ không?" hold={2.2} />
    <Window from="need">
      <Panel kicker="Mua căn nhà điển hình ở Mỹ" title="Khoảng cách thu nhập" width={880}>
        <BarChart
          labelWidth={330}
          max={125000}
          bars={[
            {label: 'Thu nhập cần có', sub: 'Redfin 2026', value: 109796, color: 'red', at: 'need'},
            {label: 'Thu nhập trung vị hộ', sub: 'gia đình Mỹ', value: 87599, color: 'teal', at: 'median'},
          ]}
        />
        <Reveal at="family" sfx="pop">
          <StatCard icon={Users} label="Người mua lần đầu nhờ gia đình/bạn bè hỗ trợ tiền trả trước" valueSize={52} value="22%" color="gold" />
        </Reveal>
      </Panel>
    </Window>
    <SourceNote>Redfin (8/2026) · NAR Profile of Home Buyers and Sellers 2025</SourceNote>
  </>
);

const Newcomers = () => (
  <>
    <ChapterTitle index="07" title="Người mới sang" hold={2.2} />
    <Window from="fha" to="help">
      <Panel kicker="3 điều phải biết" title="Vay mua nhà khi mới sang" width={900}>
        <Tip at="fha" n={1} title="FHA từ 25/5/2025: chỉ công dân và thẻ xanh" />
        <Tip at="conv" n={2} title="Vay thông thường: cần SSN, cư trú hợp lệ, tín dụng ~620+" />
        <Tip at="itin" n={3} title="Vay bằng ITIN: trả trước 10–20%+, lãi cao hơn" />
      </Panel>
    </Window>
    <Window from="help">
      <VsPanel left={{name: 'TEXAS', color: 'gold'}} right={{name: 'CALIFORNIA', color: 'teal'}} title="Hỗ trợ tiền trả trước">
        <VsRow at="help" label="Chương trình" left="TSAHC" right="Dream For All" />
        <VsRow at="help" label="Mức hỗ trợ" left="vài % khoản vay" right="≤ 20% · tối đa $150.000" note="Dream For All xét theo bốc thăm" />
      </VsPanel>
    </Window>
    <SourceNote>HUD Mortgagee Letter 2025-09 · Fannie Mae Selling Guide · TSAHC · CalHFA</SourceNote>
  </>
);

const Tips = () => (
  <>
    <Dim v={0.25} />
    <Window from="t1">
      <Panel side="left" kicker="Chuẩn bị mua nhà" title="5 bước" width={900}>
        <Tip at="t1" n={1} title="Xây điểm tín dụng ít nhất 2 năm" />
        <Tip at="t2" n={2} title="Để dành: trả trước + ~3% đóng hồ sơ + dự phòng" />
        <Tip at="t3" n={3} title="Hỏi lãi suất ở ít nhất 3 ngân hàng" />
        <Tip at="t4" n={4} title="Hỏi giá bảo hiểm nhà và lũ trước khi đặt cọc" />
        <Tip at="t5" n={5} title="Chương trình hỗ trợ + nộp đơn miễn trừ thuế nhà ở chính" />
      </Panel>
    </Window>
    <SourceNote>Số liệu tham khảo, không phải tư vấn tài chính hay bất động sản</SourceNote>
  </>
);

const Outro = () => (
  <>
    <Window from={0} to="key">
      <Panel kicker="Tóm lại" title="Mua nhà ở Houston (10% trả trước)" width={760}>
        <PanelStat at={0.3} label="Tiền mặt cần sẵn" value={0} text="~$43.000" />
        <PanelStat at={0.3} label="Mỗi tháng" value={0} text="~$3.100" color="red" />
      </Panel>
    </Window>
    <Window from="key" to="q">
      <Dim v={0.4} />
      <BigLine at="key" to="q" text="Không chỉ giá nhà: 30 năm tiền góp, thuế và bảo hiểm" size={78} />
    </Window>
    <Window from="q">
      <Dim v={0.5} />
      <QuestionCta at="q" subAt="sub" text="Bạn đang thuê hay đã mua — Texas hay California?" />
    </Window>
    <div style={{position: 'absolute', bottom: 26, width: '100%', textAlign: 'center', fontSize: 19, color: theme.faint}}>
      Số liệu tham khảo, không phải tư vấn tài chính · Video nền: Pixabay
    </div>
  </>
);

export default defineVideo({
  id: 'mua-nha-o-my',
  narration,
  shots,
  music: {src: 'sound/nhac-nen.mp3', volume: 0.22, duckedVolume: 0.075},
  transitionSfx: 'whoosh',
  cleanScenes: ['hook'],
  scenes: {hook: Hook, down: Down, closing: Closing, monthly: Monthly, taxins: TaxIns, oc: OC, income: Income, newcomers: Newcomers, tips: Tips, outro: Outro},
});
