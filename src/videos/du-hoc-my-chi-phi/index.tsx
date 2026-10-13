import {Briefcase, FileText, GraduationCap, Languages, Plane, ShieldCheck, Stamp, Wallet} from 'lucide-react';
import {AbsoluteFill} from 'remotion';
import {BarChart} from '../../shared/components/BarChart';
import {StatCard} from '../../shared/components/Card';
import {Reveal} from '../../shared/components/Reveal';
import {SourceNote} from '../../shared/components/SceneParts';
import {defineVideo} from '../../shared/defineVideo';
import {ReceiptLayout} from '../../shared/layouts/ReceiptLayout';
import {Dim, QuestionCta, Tip, VsPanel, VsRow} from '../../shared/overlays/Extras';
import {ChipList, Panel, PanelStat} from '../../shared/overlays/Panel';
import {BigLine, ChapterTitle, PlaceTag} from '../../shared/overlays/Titles';
import {Window} from '../../shared/overlays/Window';
import {theme} from '../../shared/theme';
import narration from './narration.json';
import shots from './shots.json';

// Chi phí trước khi bay (đô; IELTS và vé máy bay quy từ VND theo 26.000 đ/USD) — xem docs/kich-ban/du-hoc-my-chi-phi.md
const PRE = {ielts: 179, apps: 450, sevis: 350, visa: 185, integrity: 250, flight: 1154};

const Hook = () => (
  <>
    <Window from="stat" to="q">
      <Dim v={0.45} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 170}}>
        <Reveal at="stat" y={0} scale sfx="impact">
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 34, color: theme.text, fontWeight: 600, textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>Sinh viên Việt Nam tại Mỹ · năm học 2024–25</div>
            <div style={{fontSize: 190, fontWeight: 800, color: theme.gold, lineHeight: 1.05, textShadow: '0 10px 60px rgba(0,0,0,0.75)'}}>25.584</div>
            <div style={{fontSize: 44, color: theme.teal, fontWeight: 700, textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>Kỷ lục · đứng thứ 5 thế giới</div>
          </div>
        </Reveal>
      </AbsoluteFill>
    </Window>
    <Window from="ans" to="plan">
      <Dim v={0.5} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 170}}>
        <Reveal at="ans" sfx="pop">
          <div style={{fontSize: 36, color: theme.muted, fontWeight: 600, textAlign: 'center', marginBottom: 26}}>Một năm du học Mỹ</div>
        </Reveal>
        <div style={{display: 'flex', gap: 110, alignItems: 'flex-end'}}>
          <Reveal at="ans" y={0} scale sfx="impact" sfxVolume={0.45}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: 140, fontWeight: 800, color: theme.teal, lineHeight: 1}}>~700tr</div>
              <div style={{fontSize: 32, color: theme.text, fontWeight: 600}}>cao đẳng cộng đồng</div>
            </div>
          </Reveal>
          <Reveal at="top" y={0} scale sfx="impact" sfxVolume={0.45}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: 140, fontWeight: 800, color: theme.red, lineHeight: 1}}>&gt;2,6 tỷ</div>
              <div style={{fontSize: 32, color: theme.text, fontWeight: 600}}>đại học tư danh tiếng</div>
            </div>
          </Reveal>
        </div>
      </AbsoluteFill>
    </Window>
    <BigLine at="plan" text="Tính đủ từ hồ sơ đến tấm bằng" size={92} />
    <Window from="stat" to="q">
      <SourceNote>IIE Open Doors 2025</SourceNote>
    </Window>
  </>
);

const Before = () => (
  <>
    <ChapterTitle index="01" title="Trước khi bay" hold={2.2} />
    <Dim v={0.55} />
    <ReceiptLayout
      kicker="CHI PHÍ TRƯỚC KHI ĐẶT CHÂN ĐẾN MỸ"
      title="Hồ sơ, visa, vé máy bay"
      rows={[
        {at: 'l1', icon: Languages, label: 'Thi IELTS (4.664.000 đ)', value: PRE.ielts},
        {at: 'l2', icon: FileText, label: 'Phí hồ sơ · 5 trường', value: PRE.apps},
        {at: 'l3', icon: ShieldCheck, label: 'Phí SEVIS I-901', value: PRE.sevis},
        {at: 'l4', icon: Stamp, label: 'Phí visa F-1', value: PRE.visa},
        {at: 'l5', icon: Stamp, label: 'Phí bảo đảm visa (có thể)', value: PRE.integrity},
        {at: 'l6', icon: Plane, label: 'Vé khứ hồi (~30 triệu đ)', value: PRE.flight},
      ]}
      total={{at: 'sum', label: 'Tổng'}}
      aside={
        <Reveal at="sum" sfx="impact" sfxVolume={0.45}>
          <StatCard icon={Wallet} label="Quy ra tiền Việt" valueSize={60} value="≈ 67 triệu đồng" note="Mùa cao điểm, nhiều hồ sơ → cao hơn" color="teal" />
        </Reveal>
      }
    />
    <SourceNote>IDP Vietnam (IELTS 2026) · U.S. Department of State · ICE/SEVP · hãng bay (giá tham khảo 10/2026) · 26.000 đ/USD</SourceNote>
  </>
);

const Tuition = () => (
  <>
    <ChapterTitle index="02" title="Học phí" hold={2.2} />
    <Window from="rule" to="pub">
      <VsPanel left={{name: 'TRONG BANG', color: 'teal'}} right={{name: 'NGOÀI BANG', color: 'red'}} title="Học phí đại học công 4 năm · 2025–26">
        <VsRow at="rule" label="Trung bình / năm" left="$11.950" right="$31.880" winner="right" winAt="rule" big note="Sinh viên quốc tế trả mức ngoài bang" />
      </VsPanel>
    </Window>
    <Window from="pub">
      <Panel kicker="Học phí trung bình / năm · 2025–26" title="Sinh viên quốc tế trả bao nhiêu?" width={900}>
        <BarChart
          labelWidth={330}
          max={52000}
          bars={[
            {label: 'Cao đẳng cộng đồng', sub: 'De Anza (F-1)', value: 10224, color: 'teal', at: 'cc'},
            {label: 'Đại học công 4 năm', sub: 'mức ngoài bang', value: 31880, color: 'gold', at: 'pub'},
            {label: 'Đại học tư', sub: 'phi lợi nhuận', value: 45000, color: 'red', at: 'priv'},
          ]}
        />
      </Panel>
    </Window>
    <SourceNote>College Board — Trends in College Pricing 2025 · De Anza College (2026–27)</SourceNote>
  </>
);

const Living = () => (
  <>
    <ChapterTitle index="03" title="Ăn ở & sinh hoạt" hold={2.2} />
    <Window from="room" to="total">
      <Panel kicker="Mỗi năm" title="Ngoài học phí" width={820}>
        <PanelStat at="room" label="Ký túc xá + ăn uống · trường công" value={13900} note="Trường tư: ~$15.920" />
        <PanelStat at="ins" label="Bảo hiểm y tế bắt buộc" value={0} text="$1.700–3.200+" color="red" note="De Anza $1.665 · UC Irvine $3.214" />
        <PanelStat at="other" label="Sách vở, đi lại, cá nhân" value={5140} color="blue" />
      </Panel>
    </Window>
    <Window from="total">
      <VsPanel left={{name: 'ĐẠI HỌC CÔNG', color: 'gold'}} right={{name: 'ĐẠI HỌC TƯ', color: 'red'}} title="Tổng chi phí một năm · trung bình 2025–26">
        <VsRow at="total" label="Đô la Mỹ" left="$50.920" right="$65.470" big />
        <VsRow at="total" label="Tiền Việt (26.000 đ/USD)" left="≈ 1,32 tỷ" right="≈ 1,70 tỷ" />
      </VsPanel>
    </Window>
    <SourceNote>College Board — Trends in College Pricing 2025 (sinh viên ở trong trường) · trường đại học</SourceNote>
  </>
);

const Schools = () => (
  <>
    <ChapterTitle index="04" title="Ba trường thật" hold={2.2} />
    <Window from="s1">
      <Panel kicker="Chi phí một năm · sinh viên quốc tế · 2026–27" title="Từ 700 triệu đến 2,7 tỷ" width={940}>
        <BarChart
          labelWidth={330}
          max={118000}
          bars={[
            {label: 'De Anza College', sub: 'cao đẳng cộng đồng', value: 27189, color: 'teal', at: 's1'},
            {label: 'UC Irvine', sub: 'đại học công · ngoài bang', value: 85277, color: 'gold', at: 's2'},
            {label: 'USC', sub: 'đại học tư · Los Angeles', value: 103162, color: 'red', at: 's3'},
          ]}
        />
        <Reveal at="four" sfx="impact" sfxVolume={0.45}>
          <div style={{fontSize: 32, color: theme.text, fontWeight: 700}}>
            4 năm ở USC ≈ <span style={{color: theme.red}}>10,7 tỷ đồng</span>
          </div>
        </Reveal>
      </Panel>
    </Window>
    <SourceNote>De Anza College · UC Irvine Registrar & Admissions (ước tính ở trong trường) · USC Financial Aid — 2026–27</SourceNote>
  </>
);

const Funds = () => (
  <>
    <ChapterTitle index="05" title="Tiền ở đâu ra?" hold={2.2} />
    <Window from="i20" to="work">
      <Panel kicker="Điều kiện cấp I-20" title="Chứng minh tài chính" width={760}>
        <ChipList
          items={[
            {at: 'i20', text: 'Đủ chi phí năm đầu theo ước tính của trường', icon: Wallet},
            {at: 'fafsa', text: 'Không được vay/trợ cấp liên bang (FAFSA)', icon: Briefcase},
          ]}
        />
        <PanelStat at="family" label="Sinh viên quốc tế dựa chủ yếu vào tiền bản thân + gia đình" value={0} text="51,5%" color="blue" />
      </Panel>
    </Window>
    <Window from="work">
      <Panel kicker="Visa F-1" title="Làm thêm trong trường" color="teal">
        <PanelStat at="work" label="Tối đa trong học kỳ" value={0} text="20 giờ/tuần" color="teal" />
        <PanelStat at="wage" label="Lương tối thiểu California 2026 ($16,90/giờ)" value={338} suffix="/tuần" note="Trước thuế — không đủ gánh học phí" />
      </Panel>
    </Window>
    <SourceNote>IIE Open Doors 2025 · 8 CFR 214.2(f) · California (lương tối thiểu 2026)</SourceNote>
  </>
);

const Policy = () => (
  <>
    <ChapterTitle index="06" title="Thay đổi cần biết" hold={2.2} />
    <Window from="vet">
      <Panel kicker="2025–2026" title="Chính sách du học Mỹ" width={860} color="red">
        <ChipList
          color="red"
          items={[
            {at: 'vet', text: 'Xét duyệt mạng xã hội khi xin visa (từ 6/2025)', icon: ShieldCheck},
            {at: 'drop', text: 'Tân sinh viên quốc tế mùa thu 2025: −17%', icon: GraduationCap},
            {at: 'opt', text: 'Đề xuất thu phí OPT rất cao (10/2026)', icon: Briefcase},
          ]}
        />
        <Reveal at="note" sfx="pop">
          <div style={{fontSize: 30, color: theme.gold, fontWeight: 700}}>Đề xuất OPT chưa có hiệu lực — theo dõi nguồn chính thức</div>
        </Reveal>
      </Panel>
    </Window>
    <SourceNote>U.S. Department of State · IIE Fall 2025 Snapshot · Federal Register (8/10/2026)</SourceNote>
  </>
);

const Save = () => (
  <>
    <ChapterTitle index="07" title="Cách giảm chi phí" hold={2.2} />
    <Window from="calc" to="more">
      <VsPanel left={{name: 'LỘ TRÌNH 2+2', color: 'teal'}} right={{name: '4 NĂM UC IRVINE', color: 'red'}} title="Tổng chi phí 4 năm (ước tính, chưa tính tăng học phí)">
        <VsRow at="calc" label="De Anza 2 năm + UC Irvine 2 năm" left="~$225.000" right="~$341.000" winner="left" winAt="saving" big />
        <Reveal at="saving" sfx="impact" sfxVolume={0.45}>
          <div style={{fontSize: 40, fontWeight: 800, color: theme.teal, textAlign: 'center'}}>Tiết kiệm ≈ $116.000 ≈ 3 tỷ đồng</div>
        </Reveal>
      </VsPanel>
    </Window>
    <PlaceTag at="vn" to="calc" place="20,6%" sub="sinh viên Việt Nam tại Mỹ học ở cao đẳng cộng đồng" />
    <Window from="more">
      <Panel kicker="Thêm 3 cách" title="Giảm gánh nặng" width={820}>
        <Tip at="more" n={1} title="Săn học bổng theo thành tích (merit)" />
        <Tip at="more" n={2} title="Chọn bang chi phí sinh hoạt thấp, ví dụ Texas" />
        <Tip at="more" n={3} title="Thuê nhà ở ghép ngoài trường từ năm 2" />
      </Panel>
    </Window>
    <SourceNote>Ước tính từ chi phí De Anza và UC Irvine 2026–27 · IIE Open Doors 2025 (Vietnam Fact Sheet)</SourceNote>
  </>
);

const Outro = () => (
  <>
    <Window from={0} to="key">
      <Panel kicker="Tóm lại" title="Một năm du học Mỹ" width={760}>
        <PanelStat at={0.3} label="Cao đẳng cộng đồng" value={0} text="~700 triệu" color="teal" />
        <PanelStat at={0.3} label="Đại học tư danh tiếng" value={0} text="~2,7 tỷ" color="red" />
      </Panel>
    </Window>
    <Window from="key" to="q">
      <Dim v={0.4} />
      <BigLine at="key" to="q" text="Hãy tính cho cả 4 năm, không chỉ năm đầu tiên" size={84} />
    </Window>
    <Window from="q">
      <Dim v={0.5} />
      <QuestionCta at="q" subAt="sub" text="Bắt đầu từ cao đẳng cộng đồng hay vào thẳng đại học?" />
    </Window>
    <div style={{position: 'absolute', bottom: 26, width: '100%', textAlign: 'center', fontSize: 19, color: theme.faint}}>
      Số liệu tham khảo, không phải tư vấn du học · Video nền: Pixabay
    </div>
  </>
);


export default defineVideo({
  id: 'du-hoc-my-chi-phi',
  narration,
  shots,
  music: {src: 'sound/nhac-nen.mp3', volume: 0.22, duckedVolume: 0.075},
  transitionSfx: 'whoosh',
  cleanScenes: ['hook'],
  scenes: {hook: Hook, before: Before, tuition: Tuition, living: Living, schools: Schools, funds: Funds, policy: Policy, save: Save, outro: Outro},
});
