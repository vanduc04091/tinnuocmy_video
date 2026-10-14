import {Brain, Clock, FileText, ShieldAlert, Store} from 'lucide-react';
import {AbsoluteFill} from 'remotion';
import {BarChart} from '../../shared/components/BarChart';
import {StatCard} from '../../shared/components/Card';
import {Reveal} from '../../shared/components/Reveal';
import {SourceNote} from '../../shared/components/SceneParts';
import {defineVideo} from '../../shared/defineVideo';
import {PeopleRow} from '../../shared/overlays/BalanceDrain';
import {Dim, QuestionCta, Tip, VsPanel, VsRow} from '../../shared/overlays/Extras';
import {ChipList, Panel, PanelStat} from '../../shared/overlays/Panel';
import {BigLine, ChapterTitle, PlaceTag} from '../../shared/overlays/Titles';
import {Window} from '../../shared/overlays/Window';
import {theme} from '../../shared/theme';
import narration from './narration.json';
import shots from './shots.json';

const Hook = () => (
  <>
    <Window from="share" to="q">
      <Dim v={0.5} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40, paddingBottom: 170}}>
        <Reveal at="share" sfx="pop">
          <div style={{fontSize: 36, color: theme.muted, fontWeight: 600}}>Thợ nail ở Mỹ là người Việt (ước tính)</div>
        </Reveal>
        <PeopleRow at="share" highlight={5} color={theme.gold} />
        <Reveal at="share" delay={30}>
          <div style={{fontSize: 64, fontWeight: 800, color: theme.text}}>
            Hơn <span style={{color: theme.gold}}>1/2</span> cả nước
          </div>
        </Reveal>
        <Reveal at="ca" sfx="pop">
          <div style={{fontSize: 40, fontWeight: 700, color: theme.text}}>
            California: <span style={{color: theme.teal}}>82%</span> thợ sinh ở nước ngoài là người sinh tại Việt Nam
          </div>
        </Reveal>
      </AbsoluteFill>
    </Window>
    <BigLine at="q" to="plan" text="Làm nail ở Mỹ thực sự kiếm bao nhiêu?" size={92} />
    <BigLine at="plan" text="Lương, tip, thuế — và cái giá sức khỏe" size={86} />
    <Window from="share" to="q">
      <SourceNote>Census ACS 2024 (qua EPI, ước tính 74,8% × 71,4%) · UCLA Labor Center — Nail Files California (2024)</SourceNote>
    </Window>
  </>
);

const Industry = () => (
  <>
    <ChapterTitle index="01" title="Ngành nail lớn cỡ nào?" hold={2.2} />
    <Window from="salons" to="gg">
      <Panel kicker="Nước Mỹ" title="Ngành nail" width={820}>
        <PanelStat at="salons" label="Tiệm nail có thuê nhân viên (2023)" value={34417} prefix="" note="~148.000 người làm công" />
        <PanelStat at="solo" label="Thợ làm riêng / thuê ghế (2023)" value={295977} prefix="" color="blue" />
        <PanelStat at="rev" label="Doanh thu tiệm có nhân viên (2022)" value={0} text="$12,85 tỷ" color="teal" />
      </Panel>
    </Window>
    <PlaceTag at="gg" place="GARDEN GROVE · WESTMINSTER" sub="Nơi tập trung thợ nail đông nhất nước Mỹ" />
    <SourceNote>Census — County Business Patterns 2023 · Nonemployer Statistics 2023 · Service Annual Survey (FRED) · Data USA</SourceNote>
  </>
);

const Wage = () => (
  <>
    <ChapterTitle index="02" title="Lương theo thống kê" hold={2.2} />
    <Window from="median" to="states">
      <Panel kicker="BLS · tháng 5/2025 · thợ làm công" title="Thu nhập thợ nail" width={820}>
        <PanelStat at="median" label="Trung vị mỗi giờ" value={17.19} suffix="" text="$17,19/giờ" />
        <PanelStat at="median" label="Trung vị mỗi năm" value={35760} note="≈ 77 triệu đồng/tháng" />
        <Reveal at="range" sfx="pop">
          <div style={{fontSize: 30, color: theme.text, fontWeight: 600}}>
            10% thấp nhất <b style={{color: theme.red}}>&lt; $28.920</b> · 10% cao nhất <b style={{color: theme.teal}}>&gt; $50.140</b>
          </div>
        </Reveal>
      </Panel>
    </Window>
    <Window from="states">
      <Panel kicker="Trung vị mỗi năm · 5/2025" title="Theo tiểu bang" width={880}>
        <BarChart
          labelWidth={260}
          max={56000}
          bars={[
            {label: 'Texas', value: 34040, color: 'gold', at: 'states'},
            {label: 'California', value: 36630, color: 'teal', at: 'states'},
            {label: 'Washington', value: 49900, color: 'blue', at: 'states'},
          ]}
        />
        <Reveal at="note" sfx="pop">
          <div style={{fontSize: 26, color: theme.muted}}>Đã gồm tip được khai báo · chưa gồm thợ thuê ghế, tự làm chủ (~23%)</div>
        </Reveal>
      </Panel>
    </Window>
    <SourceNote>BLS Occupational Employment and Wage Statistics, May 2025 (Manicurists and Pedicurists, 39-5092) · O*NET OnLine</SourceNote>
  </>
);

const Pay = () => (
  <>
    <ChapterTitle index="03" title="Cách trả lương" hold={2.2} />
    <Window from="hourly" to="ex">
      <Panel kicker="3 cách" title="Thợ nail được trả thế nào?" width={860}>
        <Tip at="hourly" n={1} title="Lương giờ · California 2026 tối thiểu $16,90" />
        <Tip at="comm" n={2} title="Ăn chia · 50/50 hoặc 60/40 (thợ 60%)" />
        <Tip at="booth" n={3} title="Thuê ghế · phổ biến ở Texas, Florida" />
        <Reveal at="tip" sfx="pop">
          <div style={{fontSize: 29, color: theme.teal, fontWeight: 700}}>Tip trung vị (California): ~$10 / lần làm móng tay</div>
        </Reveal>
      </Panel>
    </Window>
    <Window from="ex">
      <Panel kicker="Ví dụ minh họa · Quận Cam" title="Một thợ ăn chia 60%" width={820}>
        <PanelStat at="ex" label="6 khách × $50 × 60% + tip $60 / ngày" value={240} />
        <PanelStat at="month" label="22 ngày / tháng · trước thuế" value={5280} color="teal" note="≈ 137 triệu đồng" />
        <PanelStat at="slow" label="Nếu chỉ 4 khách / ngày" value={3520} color="red" />
      </Panel>
    </Window>
    <SourceNote>California DIR · UCLA Labor Center — Nail Files California (khảo sát 2023) · ví dụ minh họa</SourceNote>
  </>
);

const Tax = () => (
  <>
    <ChapterTitle index="04" title="Thuế & tiền tip" hold={2.2} />
    <Window from="notax" to="irs">
      <Panel kicker="Luật 2025–2028" title="Không đánh thuế tiền tip" width={820} color="teal">
        <PanelStat at="notax" label="Trừ khỏi thu nhập chịu thuế liên bang, tối đa / năm" value={25000} color="teal" note="Thợ nail có trong danh sách ngành nghề (mã 605)" />
        <Reveal at="report" sfx="pop">
          <div style={{fontSize: 30, color: theme.gold, fontWeight: 700}}>Chỉ được trừ khi khai báo đầy đủ</div>
        </Reveal>
      </Panel>
    </Window>
    <Window from="irs">
      <Panel kicker="Sở Thuế Mỹ (IRS)" title="Khai thiếu tiền tip" width={820} color="red">
        <PanelStat at="irs" label="Thợ nail làm công khai báo ≥ $100 tip / năm" value={0} text="~36%" color="red" />
        <ChipList
          color="red"
          items={[
            {at: 'why', text: 'Tiền an sinh xã hội khi về hưu thấp hơn', icon: Clock},
            {at: 'why', text: 'Khó chứng minh thu nhập khi vay nhà, mua xe', icon: FileText},
          ]}
        />
      </Panel>
    </Window>
    <SourceNote>Treasury/IRS — Final rule TD 10044 (4/2026), No Tax on Tips</SourceNote>
  </>
);

const License = () => (
  <>
    <ChapterTitle index="05" title="Bằng nail" hold={2.2} />
    <Window from="ca">
      <VsPanel left={{name: 'CALIFORNIA', color: 'teal'}} right={{name: 'TEXAS', color: 'gold'}} title="Điều kiện lấy bằng thợ nail" top={70}>
        <VsRow at="ca" label="Số giờ học" left="400 giờ" right="600 giờ" big />
        <VsRow at="tx" label="Thi" left="Lý thuyết · có tiếng Việt" right="Lý thuyết + thực hành" />
        <VsRow at="count" label="Bằng còn hiệu lực (2023)" left="127.480" right="—" />
        <VsRow at="cost" label="Học phí (tham khảo)" left="$1.000+" right="$1.000+" />
      </VsPanel>
    </Window>
    <SourceNote>California Board of Barbering and Cosmetology · 16 Tex. Admin. Code §83.202 · UCLA Labor Center</SourceNote>
  </>
);

const Health = () => (
  <>
    <ChapterTitle index="06" title="Cái giá sức khỏe" hold={2.2} />
    <Window from="trio" to="body">
      <Panel kicker="OSHA · bộ ba độc hại" title="Hóa chất trong tiệm nail" width={820} color="red">
        <ChipList
          color="red"
          items={[
            {at: 'trio', text: 'Toluene', icon: ShieldAlert},
            {at: 'trio', text: 'Formaldehyde', icon: ShieldAlert},
            {at: 'trio', text: 'Dibutyl phthalate (DBP)', icon: ShieldAlert},
          ]}
        />
        <PanelStat at="study" label="Thợ người Việt có triệu chứng liên quan dung môi (khảo sát cũ)" value={0} text="~47%" color="red" />
        <Reveal at="brain" sfx="pop">
          <div style={{fontSize: 28, color: theme.text, fontWeight: 600}}>
            <Brain size={28} color={theme.red} style={{verticalAlign: 'middle'}} /> Tiếp xúc càng nhiều → điểm trí nhớ càng thấp (2022)
          </div>
        </Reveal>
      </Panel>
    </Window>
    <Window from="body">
      <Panel kicker="California" title="Điều kiện làm việc" color="red">
        <PanelStat at="body" label="Đau lưng, vai, cổ tay" value={0} text="Thường gặp" color="red" />
        <PanelStat at="sick" label="Không có ngày nghỉ ốm có lương" value={0} text="65%" color="red" />
      </Panel>
    </Window>
    <SourceNote>OSHA · Quach et al. (J Community Health 2008) · Nguyen et al. (IJERPH 2022) · UCLA Labor Center (2024)</SourceNote>
  </>
);

const Tips = () => (
  <>
    <Dim v={0.25} />
    <Window from="t1" to="future">
      <Panel side="left" kicker="Làm nail bền và kiếm khá" title="5 điều" width={900}>
        <Tip at="t1" n={1} title="Giữ khách quen" />
        <Tip at="t2" n={2} title="Học gel, đắp bột, vẽ móng" />
        <Tip at="t3" n={3} title="Khẩu trang đúng loại, găng tay, quạt hút tại bàn" />
        <Tip at="t4" n={4} title="Khai đủ thu nhập và tip" />
        <Tip at="t5" n={5} title="Tính kỹ trước khi mở tiệm riêng" />
      </Panel>
    </Window>
    <Window from="future">
      <Dim v={0.6} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 140}}>
        <div style={{width: 640}}>
          <Reveal at="future" sfx="impact" sfxVolume={0.45}>
            <StatCard icon={Store} label="Việc làm thợ nail 2025–2035 (BLS)" valueSize={64} value="+9,2%" note="Nhanh hơn mức chung (+3,5%)" color="teal" />
          </Reveal>
        </div>
      </AbsoluteFill>
    </Window>
    <SourceNote>BLS Employment Projections 2025–35 · Số liệu tham khảo</SourceNote>
  </>
);

const Outro = () => (
  <>
    <Window from={0} to="key">
      <Panel kicker="Tóm lại" title="Thợ nail ở Mỹ" width={760}>
        <PanelStat at={0.3} label="Trung vị / năm (BLS 2025)" value={35760} />
        <PanelStat at={0.3} label="Ví dụ thợ đông khách / tháng" value={5280} color="teal" />
      </Panel>
    </Window>
    <Window from="key" to="q">
      <Dim v={0.4} />
      <BigLine at="key" to="q" text="Tay nghề, lượng khách và sức khỏe quyết định thu nhập" size={80} />
    </Window>
    <Window from="q">
      <Dim v={0.5} />
      <QuestionCta at="q" subAt="sub" text="Bạn hoặc người thân làm nail ở Mỹ — thu nhập thật thế nào?" />
    </Window>
    <div style={{position: 'absolute', bottom: 26, width: '100%', textAlign: 'center', fontSize: 19, color: theme.faint}}>
      Số liệu tham khảo, không phải tư vấn thuế hay pháp lý · Video nền: Pixabay
    </div>
  </>
);

export default defineVideo({
  id: 'lam-nail-o-my',
  narration,
  shots,
  music: {src: 'sound/nhac-nen.mp3', volume: 0.22, duckedVolume: 0.075},
  transitionSfx: 'whoosh',
  cleanScenes: ['hook'],
  scenes: {hook: Hook, industry: Industry, wage: Wage, pay: Pay, tax: Tax, license: License, health: Health, tips: Tips, outro: Outro},
});
