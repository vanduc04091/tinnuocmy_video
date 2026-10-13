import {Ambulance, Baby, CalendarDays, FileText, Hospital, Shield} from 'lucide-react';
import {AbsoluteFill} from 'remotion';
import {BarChart} from '../../shared/components/BarChart';
import {StatCard} from '../../shared/components/Card';
import {Reveal} from '../../shared/components/Reveal';
import {SourceNote} from '../../shared/components/SceneParts';
import {defineVideo} from '../../shared/defineVideo';
import {Dim, QuestionCta, Tip, VsPanel, VsRow} from '../../shared/overlays/Extras';
import {ChipList, Panel, PanelStat} from '../../shared/overlays/Panel';
import {BigLine, ChapterTitle} from '../../shared/overlays/Titles';
import {Window} from '../../shared/overlays/Window';
import {theme} from '../../shared/theme';
import narration from './narration.json';
import shots from './shots.json';

const Hook = () => (
  <>
    <Window from="birth" to="q">
      <Dim v={0.5} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 170}}>
        <div style={{display: 'flex', gap: 120, alignItems: 'flex-end'}}>
          <Reveal at="birth" y={0} scale sfx="impact" sfxVolume={0.45}>
            <div style={{textAlign: 'center'}}>
              <Baby size={64} color={theme.text} />
              <div style={{fontSize: 140, fontWeight: 800, color: theme.gold, lineHeight: 1}}>$20.416</div>
              <div style={{fontSize: 32, color: theme.text, fontWeight: 600}}>một ca sinh con · ≈ 530 triệu đồng</div>
            </div>
          </Reveal>
          <Reveal at="er" y={0} scale sfx="impact" sfxVolume={0.45}>
            <div style={{textAlign: 'center'}}>
              <Hospital size={64} color={theme.text} />
              <div style={{fontSize: 140, fontWeight: 800, color: theme.red, lineHeight: 1}}>$2.453</div>
              <div style={{fontSize: 32, color: theme.text, fontWeight: 600}}>một lần cấp cứu</div>
            </div>
          </Reveal>
        </div>
      </AbsoluteFill>
    </Window>
    <BigLine at="q" to="plan" text="Bảo hiểm thực sự giúp được bao nhiêu?" size={92} />
    <BigLine at="plan" text="Y tế Mỹ, giải thích từ đầu" size={92} />
    <Window from="birth" to="q">
      <SourceNote>Peterson-KFF Health System Tracker — tổng chi phí trung bình (bảo hiểm công ty)</SourceNote>
    </Window>
  </>
);

const Prices = () => (
  <>
    <ChapterTitle index="01" title="Giá khám chữa bệnh" hold={2.2} />
    <Window from="visit" to="day">
      <Panel kicker="Mỗi lần · số tiền thực trả" title="Từ phòng khám đến cấp cứu" width={900}>
        <BarChart
          labelWidth={330}
          max={2900}
          bars={[
            {label: 'Khám bác sĩ', sub: 'bệnh nhân mới · 45–59 phút', value: 183, color: 'teal', at: 'visit'},
            {label: 'Urgent care', sub: 'phòng khám khẩn cấp', value: 179, color: 'blue', at: 'urgent'},
            {label: 'Phòng cấp cứu', sub: 'tổng hóa đơn', value: 2453, color: 'red', at: 'er'},
          ]}
        />
        <Reveal at="er" delay={30} sfx="pop">
          <div style={{fontSize: 28, color: theme.text, fontWeight: 600}}>
            Có bảo hiểm vẫn tự trả <b style={{color: theme.red}}>~$646</b> / lần cấp cứu
          </div>
        </Reveal>
        <Reveal at="amb" sfx="pop">
          <div style={{fontSize: 28, color: theme.text, fontWeight: 600}}>
            <Ambulance size={28} color={theme.red} style={{verticalAlign: 'middle'}} /> Xe cứu thương: tính <b style={{color: theme.red}}>~$1.277</b>
          </div>
        </Reveal>
      </Panel>
    </Window>
    <Window from="day">
      <VsPanel left={{name: 'TRUNG BÌNH MỸ', color: 'gold'}} right={{name: 'CALIFORNIA', color: 'red'}} title="Bệnh viện chi cho mỗi ngày nằm viện · 2024">
        <VsRow at="day" label="Mỗi ngày" left="$3.297" right="$4.744" big />
      </VsPanel>
    </Window>
    <SourceNote>FAIR Health (2023) · Peterson-KFF (dữ liệu 2019) · FAIR Health — xe cứu thương (2020) · KFF/AHA (2024)</SourceNote>
  </>
);

const How = () => (
  <>
    <ChapterTitle index="02" title="Bảo hiểm hoạt động thế nào?" hold={2.2} />
    <Window from="prem" to="ex">
      <Panel kicker="4 khái niệm" title="Đọc hiểu bảo hiểm y tế" width={860}>
        <Tip at="prem" n={1} title="Phí bảo hiểm (premium) — đóng hằng tháng" />
        <Tip at="ded" n={2} title="Mức khấu trừ (deductible) — tự trả trước" />
        <Tip at="coins" n={3} title="Đồng chi trả (coinsurance) — thường 20%" />
        <Tip at="max" n={4} title="Trần tự trả 2026 — tối đa $10.600/người/năm" />
      </Panel>
    </Window>
    <Window from="ex">
      <Panel kicker="Ví dụ · khấu trừ $2.000 · đồng chi trả 20%" title="Hóa đơn cấp cứu $3.000" width={820}>
        <PanelStat at="you" label="Bạn trả: $2.000 + 20% × $1.000" value={2200} color="red" />
        <PanelStat at="you" label="Bảo hiểm trả" value={800} color="teal" />
        <PanelStat at="big" label="Hóa đơn $100.000 → bạn trả tối đa" value={10600} color="gold" note="Chưa kể phí bảo hiểm hằng tháng" />
      </Panel>
    </Window>
    <SourceNote>HealthCare.gov (định nghĩa, trần tự trả 2026)</SourceNote>
  </>
);

const Employer = () => (
  <>
    <ChapterTitle index="03" title="Bảo hiểm qua công ty" hold={2.2} />
    <Window from="single">
      <VsPanel left={{name: 'MỘT NGƯỜI', color: 'teal'}} right={{name: 'GIA ĐÌNH', color: 'gold'}} title="Phí bảo hiểm qua công ty / năm · 2025">
        <VsRow at="single" label="Tổng phí" left="$9.325" right="$26.993" big />
        <VsRow at="share" label="Người lao động tự đóng" left="$1.440" right="$6.850" note="≈ $120/tháng · ≈ $570/tháng" />
        <VsRow at="ded" label="Mức khấu trừ trung bình (một người)" left="$1.886" right="34% ≥ $2.000" />
      </VsPanel>
    </Window>
    <SourceNote>KFF Employer Health Benefits Survey 2025</SourceNote>
  </>
);

const Market = () => (
  <>
    <ChapterTitle index="04" title="Tự mua bảo hiểm" hold={2.2} />
    <Window from="bench" to="medicaid">
      <Panel kicker="Chợ bảo hiểm (Obamacare) · 2026" title="Gói bạc chuẩn · 40 tuổi" width={860} color="red">
        <PanelStat at="bench" label="Phí trước trợ cấp / tháng (+26%)" value={625} color="red" />
        <Reveal at="sub" sfx="pop">
          <div style={{fontSize: 29, color: theme.text, fontWeight: 600}}>Trợ cấp tăng cường hết hạn → giữ gói cũ: <b style={{color: theme.red}}>+$1.000/năm</b></div>
        </Reveal>
        <PanelStat at="drop" label="Người đóng bảo hiểm qua chợ (2025 → 2026)" value={0} text="21,8 → 19,2 triệu" color="blue" />
        <Reveal at="open" sfx="pop">
          <StatCard icon={CalendarDays} label="Đăng ký cho năm 2027" valueSize={44} value="1/11/2026 – 15/1/2027" color="teal" />
        </Reveal>
      </Panel>
    </Window>
    <Window from="medicaid">
      <Panel kicker="Thu nhập thấp" title="Medicaid" color="teal">
        <PanelStat at="medicaid" label="Độc thân · bang mở rộng (138% mức nghèo 2026)" value={22025} suffix="/năm" color="teal" note="Texas chưa mở rộng Medicaid" />
      </Panel>
    </Window>
    <SourceNote>KFF (10/2026) · CMS · HealthCare.gov · HHS/ASPE — mức nghèo 2026</SourceNote>
  </>
);

const Immigrants = () => (
  <>
    <ChapterTitle index="05" title="Người nhập cư cần biết" hold={2.2} />
    <Window from="wait" to="rate">
      <Panel kicker="Luật đang thay đổi" title="Người nhập cư & bảo hiểm" width={880} color="red">
        <ChipList
          color="red"
          items={[
            {at: 'wait', text: 'Thẻ xanh: thường chờ 5 năm mới có Medicaid', icon: CalendarDays},
            {at: 'sub', text: 'Từ 2027: trợ cấp chợ bảo hiểm chủ yếu cho người có thẻ xanh', icon: Shield},
            {at: 'sub', text: 'Visa lao động, diện bảo vệ tạm thời → mất trợ cấp', icon: FileText},
          ]}
        />
      </Panel>
    </Window>
    <Window from="rate" to="parents">
      <VsPanel left={{name: 'KHÔNG CÓ QUỐC TỊCH', color: 'red'}} right={{name: 'TẤT CẢ NGƯỜI LỚN', color: 'teal'}} title="Không có bảo hiểm y tế · 19–64 tuổi · 2025">
        <VsRow at="rate" label="Tỷ lệ" left="28,9%" right="11,0%" big />
      </VsPanel>
    </Window>
    <Window from="parents">
      <Panel kicker="Cha mẹ sang Mỹ" title="Bảo hiểm cho bố mẹ" width={820}>
        <PanelStat at="parents" label="Bảo hiểm du lịch · 70 tuổi / tháng" value={0} text="$234–429" color="red" note="Thường không chi trả bệnh có sẵn (báo giá tham khảo)" />
        <PanelStat at="medicare" label="Medicare phần A · chưa từng đi làm ở Mỹ / tháng" value={565} note="+ phần B $202,90 · cần thẻ xanh và 5 năm cư trú" />
      </Panel>
    </Window>
    <SourceNote>KFF — Key Facts on Health Coverage of Immigrants (5/2026) · Census P60-291 · CMS 2026 · báo giá bảo hiểm du lịch</SourceNote>
  </>
);

const Tips = () => (
  <>
    <Dim v={0.25} />
    <Window from="t1">
      <Panel side="left" kicker="Bớt lo chi phí y tế" title="5 cách" width={900}>
        <Tip at="t1" n={1} title="Không nguy kịch → urgent care thay vì cấp cứu" />
        <Tip at="t2" n={2} title="Trung tâm y tế cộng đồng: phí theo thu nhập" />
        <Tip at="t3" n={3} title="Khám từ xa qua video: ~$30–50" />
        <Tip at="t4" n={4} title="Hỏi giá trước · khiếu nại nếu vượt ước tính ≥ $400" />
        <Tip at="t5" n={5} title="Đăng ký đúng hạn · hỏi thuốc generic" />
      </Panel>
    </Window>
    <SourceNote>HRSA · CMS — No Surprises Act · Amazon One Medical · Số liệu tham khảo, không phải tư vấn y tế</SourceNote>
  </>
);

const Outro = () => (
  <>
    <Window from={0} to="key">
      <Panel kicker="Tóm lại" title="Y tế Mỹ" width={760}>
        <PanelStat at={0.3} label="Một lần cấp cứu" value={2453} color="red" />
        <PanelStat at={0.3} label="Trần tự trả có bảo hiểm 2026" value={10600} color="teal" />
      </Panel>
    </Window>
    <Window from="key" to="q">
      <Dim v={0.4} />
      <BigLine at="key" to="q" text="Bảo hiểm y tế là tấm lưới an toàn, không phải khoản chi tùy chọn" size={74} />
    </Window>
    <Window from="q">
      <Dim v={0.5} />
      <QuestionCta at="q" subAt="sub" text="Bạn từng nhận hóa đơn y tế bất ngờ ở Mỹ chưa?" />
    </Window>
    <div style={{position: 'absolute', bottom: 26, width: '100%', textAlign: 'center', fontSize: 19, color: theme.faint}}>
      Số liệu tham khảo, không phải tư vấn y tế hay bảo hiểm · Video nền: Pixabay
    </div>
  </>
);

export default defineVideo({
  id: 'kham-benh-o-my',
  narration,
  shots,
  music: {src: 'sound/nhac-nen.mp3', volume: 0.22, duckedVolume: 0.075},
  transitionSfx: 'whoosh',
  cleanScenes: ['hook'],
  scenes: {hook: Hook, prices: Prices, how: How, employer: Employer, market: Market, immigrants: Immigrants, tips: Tips, outro: Outro},
});
