import {
  AlertTriangle,
  Building2,
  Car,
  ClipboardList,
  GraduationCap,
  HeartPulse,
  Home,
  KeyRound,
  Landmark,
  Lightbulb,
  MapPin,
  Package,
  Receipt,
  Scissors,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Siren,
  Smartphone,
  Thermometer,
  Ticket,
  Tv,
  User,
  UtensilsCrossed,
  Wallet,
  WashingMachine,
  Wifi,
  Zap,
} from 'lucide-react';
import {BarChart} from '../../shared/components/BarChart';
import {Callout, Card, StatCard} from '../../shared/components/Card';
import {Reveal} from '../../shared/components/Reveal';
import {defineVideo} from '../../shared/defineVideo';
import {ChecklistLayout} from '../../shared/layouts/ChecklistLayout';
import {CostLayout} from '../../shared/layouts/CostLayout';
import {HookLayout} from '../../shared/layouts/HookLayout';
import {OutroLayout} from '../../shared/layouts/OutroLayout';
import {ReceiptLayout} from '../../shared/layouts/ReceiptLayout';
import {ScenariosLayout} from '../../shared/layouts/ScenariosLayout';
import {theme} from '../../shared/theme';
import narration from './narration.json';

// Các con số chốt cho bảng tính — dùng chung cho từng cảnh, ô ngân sách và hóa đơn tổng.
const BUDGET = {
  housing: 1500,
  utilities: 250,
  food: 500,
  car: 650,
  health: 150,
  other: 300,
};
const TOTAL = Object.values(BUDGET).reduce((a, b) => a + b, 0); // 3.350

const Column: React.FC<{flex?: number; gap?: number; children: React.ReactNode}> = ({flex = 1, gap = 28, children}) => (
  <div style={{flex, display: 'flex', flexDirection: 'column', gap, justifyContent: 'center', minWidth: 0}}>
    {children}
  </div>
);

const Hook = () => (
  <HookLayout
    value={3000}
    unit="/tháng"
    sides={[
      {at: 'vn', label: 'Ở Việt Nam', text: 'Thu nhập mơ ước', color: 'teal'},
      {at: 'us', label: 'Ở Mỹ', text: 'Chỉ vừa đủ trang trải', color: 'red'},
    ]}
    question={{
      at: 'q',
      text: 'Sống ở Mỹ một tháng hết bao nhiêu tiền?',
      chip: {at: 'data', text: 'Số liệu cập nhật năm 2026'},
    }}
  />
);

const Assumptions = () => (
  <ChecklistLayout
    kicker="TRƯỚC KHI TÍNH"
    title="Giả định của bảng tính"
    icon={ClipboardList}
    items={[
      {at: 'p1', icon: User, text: 'Một người, độc thân'},
      {at: 'p2', icon: Building2, text: 'Thuê căn hộ 1 phòng ngủ'},
      {at: 'p3', icon: MapPin, text: 'Thành phố có mức giá trung bình'},
      {at: 'p4', icon: Car, text: 'Có xe hơi riêng để đi làm'},
      {at: 'p5', icon: Receipt, text: 'Tiền chi tiêu sau thuế, tính bằng USD'},
    ]}
    footer={{at: 'end', text: 'Cuối video: New York  ·  thành phố nhỏ  ·  du học sinh'}}
  />
);

const Housing = () => (
  <CostLayout
    kicker="KHOẢN 1/6"
    title="Nhà ở"
    icon={Home}
    pick={{at: 'pick', value: BUDGET.housing}}
    source="Zumper National Rent Report, 9/2026"
  >
    <Column flex={1.65}>
      <BarChart
        caption="Giá thuê trung vị, căn hộ 1 phòng ngủ / tháng"
        max={5600}
        labelWidth={330}
        bars={[
          {label: 'Toàn nước Mỹ', value: 1518, color: 'teal', at: 'median'},
          {label: 'New York', value: 4580, color: 'red', at: 'nyc'},
          {label: 'San Francisco', value: 4400, color: 'red', at: 'sf'},
        ]}
      />
    </Column>
    <Column>
      <Reveal at="rule">
        <Callout icon={Wallet} color="gold" title="Điều kiện thuê">
          Thu nhập thường phải gấp khoảng <b>3 lần</b> tiền thuê
        </Callout>
      </Reveal>
      <Reveal at="deposit">
        <Callout icon={KeyRound} color="gold" title="Tiền cọc">
          Chuẩn bị sẵn <b>1–2 tháng</b> tiền nhà
        </Callout>
      </Reveal>
    </Column>
  </CostLayout>
);

const Utilities = () => (
  <CostLayout
    kicker="KHOẢN 2/6"
    title="Điện nước & liên lạc"
    icon={Zap}
    color="teal"
    pick={{at: 'pick', value: BUDGET.utilities}}
    source="Ước tính tổng hợp cho căn hộ nhỏ, đã làm tròn"
  >
    <Column gap={36}>
      <div style={{display: 'flex', gap: 32}}>
        <Reveal at="power" style={{flex: 1.2}}>
          <StatCard icon={Zap} color="teal" label="Điện, nước, gas, rác" value="$100–250" note="Tùy mùa và tiểu bang" />
        </Reveal>
        <Reveal at="net" style={{flex: 1}}>
          <StatCard icon={Wifi} color="teal" label="Internet" value="$60–80" note="Tốc độ cao" />
        </Reveal>
        <Reveal at="phone" style={{flex: 1}}>
          <StatCard icon={Smartphone} color="teal" label="Điện thoại" value="$30–50" note="Nhà mạng giá rẻ" />
        </Reveal>
      </div>
      <Reveal at="season">
        <Callout icon={Thermometer} color="red" title="Lưu ý">
          Mùa hè ở Texas, mùa đông ở vùng Trung Tây: hóa đơn điện, sưởi có thể tăng mạnh
        </Callout>
      </Reveal>
    </Column>
  </CostLayout>
);

const Food = () => (
  <CostLayout
    kicker="KHOẢN 3/6"
    title="Ăn uống"
    icon={ShoppingCart}
    pick={{at: 'pick', value: BUDGET.food}}
    source="USDA Thrifty Food Plan, 6/2026 (người 20–50 tuổi)"
  >
    <Column flex={1.2}>
      <Reveal at="usda">
        <StatCard
          icon={ShoppingCart}
          label="Tự nấu ăn, mức tiết kiệm"
          value={
            <>
              $250–320<span style={{fontSize: 34, color: theme.muted, fontWeight: 600}}>/tháng</span>
            </>
          }
          note="Ước tính của Bộ Nông nghiệp Mỹ (USDA)"
        />
      </Reveal>
      <Reveal at="out">
        <StatCard
          icon={UtensilsCrossed}
          color="red"
          label="Một bữa trưa bên ngoài"
          value={
            <>
              $15–20<span style={{fontSize: 34, color: theme.muted, fontWeight: 600}}> + tip</span>
            </>
          }
        />
      </Reveal>
    </Column>
    <Column>
      <Reveal at="tip">
        <Callout icon={Lightbulb} color="teal" title="Mẹo nhỏ">
          Chợ Á Đông và chợ Việt thường rẻ hơn đáng kể cho các món quen thuộc
        </Callout>
      </Reveal>
    </Column>
  </CostLayout>
);

const CarScene = () => (
  <CostLayout
    kicker="KHOẢN 4/6"
    title="Xe hơi"
    icon={Car}
    color="blue"
    pick={{at: 'pick', value: BUDGET.car}}
    source="AAA Your Driving Costs 2025"
  >
    <Column flex={1.65}>
      <BarChart
        caption="Chi phí nuôi xe / tháng"
        max={1350}
        labelWidth={400}
        bars={[
          {label: 'Xe mới', sub: 'khấu hao, bảo hiểm, xăng, bảo dưỡng', value: 965, color: 'red', at: 'aaa'},
          {label: 'Xe cũ tốt', sub: 'góp xe, bảo hiểm, xăng, sửa chữa', value: 650, valueLabel: '$600–700', color: 'teal', at: 'used'},
        ]}
      />
    </Column>
    <Column>
      <Reveal at="aaa" delay={20}>
        <StatCard icon={Landmark} color="blue" label="Hiệp hội Ô tô Mỹ (AAA)" value="$11.577/năm" note="Chi phí sở hữu một xe mới" />
      </Reveal>
      <Reveal at="ins">
        <Callout icon={AlertTriangle} color="red" title="Người mới đến Mỹ">
          Chưa có lịch sử lái xe ở Mỹ: bảo hiểm thường cao hơn mức trung bình
        </Callout>
      </Reveal>
    </Column>
  </CostLayout>
);

const Health = () => (
  <CostLayout
    kicker="KHOẢN 5/6"
    title="Bảo hiểm sức khỏe"
    icon={HeartPulse}
    color="red"
    pick={{at: 'pick', value: BUDGET.health}}
    source="KFF 2026 (phí ACA chuẩn, 40 tuổi); KFF Employer Health Benefits Survey 2025"
  >
    <Column flex={1.65}>
      <BarChart
        caption="Phí bảo hiểm một người phải tự đóng / tháng"
        max={900}
        labelWidth={400}
        bars={[
          {label: 'Qua công ty', sub: 'phần người lao động đóng', value: 120, color: 'teal', at: 'job'},
          {label: 'Tự mua, 40 tuổi', sub: 'sàn bảo hiểm ACA, chưa trợ cấp', value: 625, color: 'red', at: 'aca'},
        ]}
      />
    </Column>
    <Column>
      <Reveal at="warn">
        <Callout icon={Siren} color="red" title="Đừng bỏ qua">
          Một lần vào phòng cấp cứu khi không có bảo hiểm có thể tốn <b>hàng ngàn đô</b>
        </Callout>
      </Reveal>
    </Column>
  </CostLayout>
);

const OTHER_ITEMS = [
  {at: 'i1', icon: Shirt, text: 'Quần áo'},
  {at: 'i2', icon: Package, text: 'Đồ dùng cá nhân'},
  {at: 'i3', icon: Scissors, text: 'Cắt tóc'},
  {at: 'i4', icon: WashingMachine, text: 'Giặt đồ'},
  {at: 'i5', icon: Tv, text: 'Gói xem phim'},
  {at: 'i6', icon: Ticket, text: 'Đi chơi cuối tuần'},
];

const Other = () => (
  <CostLayout
    kicker="KHOẢN 6/6"
    title="Chi tiêu khác"
    icon={ShoppingBag}
    pick={{at: 'pick', value: BUDGET.other}}
    source="Ước tính ở mức tiết chế"
  >
    <Column gap={30}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
        {OTHER_ITEMS.map(({at, icon: Icon, text}) => (
          <Reveal key={text} at={at} y={16}>
            <Card style={{display: 'flex', alignItems: 'center', gap: 24, padding: '34px 36px'}}>
              <Icon size={48} color={theme.gold} strokeWidth={1.9} />
              <span style={{fontSize: 38, fontWeight: 600}}>{text}</span>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal at="note">
        <Callout icon={Wallet} color="blue" title="Chưa bao gồm">
          Tiền gửi về gia đình và khoản tiết kiệm cho tương lai
        </Callout>
      </Reveal>
    </Column>
  </CostLayout>
);

const Total = () => (
  <ReceiptLayout
    kicker="TỔNG KẾT"
    title="Một tháng ở Mỹ"
    rows={[
      {at: 'l1', icon: Home, label: 'Nhà ở', value: BUDGET.housing},
      {at: 'l2', icon: Zap, label: 'Điện nước & liên lạc', value: BUDGET.utilities},
      {at: 'l3', icon: ShoppingCart, label: 'Ăn uống', value: BUDGET.food},
      {at: 'l4', icon: Car, label: 'Xe hơi', value: BUDGET.car},
      {at: 'l5', icon: HeartPulse, label: 'Bảo hiểm sức khỏe', value: BUDGET.health},
      {at: 'l6', icon: ShoppingBag, label: 'Chi tiêu khác', value: BUDGET.other},
    ]}
    total={{at: 'sum', label: 'Tổng / tháng'}}
    aside={
      <>
        <Reveal at="vnd">
          <StatCard label="Quy đổi tham khảo" valueSize={60} value="Hơn 85 triệu đồng" note="Tỷ giá khoảng 26.000 đ / USD" color="teal" />
        </Reveal>
        <Reveal at="income">
          <StatCard
            icon={Wallet}
            label="Thu nhập trước thuế nên có"
            valueSize={60}
            value="≥ $55.000/năm"
            note="Để vẫn để dành được một phần"
          />
        </Reveal>
      </>
    }
  />
);

const Scenarios = () => (
  <ScenariosLayout
    kicker="MỖI NƠI MỘT GIÁ"
    title="Con số thay đổi thế nào?"
    reference={`Mức trung bình: $${TOTAL.toLocaleString('de-DE')}/tháng`}
    cards={[
      {
        at: 'small',
        icon: MapPin,
        title: 'Thành phố nhỏ',
        value: '~$2.700',
        unit: '/tháng',
        color: 'teal',
        details: ['Hoặc vùng ven đô', 'Tiền nhà khoảng $1.000', 'Vẫn cần xe hơi'],
      },
      {
        at: 'big',
        icon: Building2,
        title: 'Thành phố đắt đỏ',
        value: '$6.000+',
        unit: '/tháng',
        color: 'red',
        details: ['New York, San Francisco', 'Tiền nhà hơn $4.000', 'Có thể bỏ xe, đi tàu điện'],
      },
      {
        at: 'student',
        icon: GraduationCap,
        title: 'Du học sinh',
        value: '$1.500–2.000',
        color: 'blue',
        details: ['Ở ghép, không có xe', 'Dùng bảo hiểm của trường', 'Chưa tính học phí'],
      },
    ]}
  />
);

const Tips = () => (
  <ChecklistLayout
    kicker="LỜI KHUYÊN"
    title="3 cách giảm chi phí"
    icon={Lightbulb}
    color="teal"
    numbered
    items={[
      {at: 't1', text: 'Giữ tiền nhà dưới ~30% thu nhập', sub: 'Ở ghép là cách tiết kiệm nhanh nhất trong những năm đầu'},
      {at: 't2', text: 'Mua xe cũ đáng tin cậy', sub: 'So sánh giá bảo hiểm xe ở nhiều hãng mỗi năm'},
      {at: 't3', text: 'Xây dựng lịch sử tín dụng sớm', sub: 'Dễ thuê nhà hơn, vay mua xe và mua nhà với lãi suất thấp hơn'},
    ]}
  />
);

const Outro = () => (
  <OutroLayout
    caption="MỘT NGƯỜI ĐỘC THÂN · THÀNH PHỐ MỨC GIÁ TRUNG BÌNH"
    headline={
      <>
        ${TOTAL.toLocaleString('de-DE')}
        <span style={{fontSize: 60, color: theme.muted, fontWeight: 600}}>/tháng</span>
      </>
    }
    question={{at: 'q', text: 'Quý vị đang sống ở đâu, và chi phí mỗi tháng là bao nhiêu?'}}
    subscribeAt="sub"
    disclaimer="Số liệu mang tính tham khảo, không phải tư vấn tài chính."
  />
);

export default defineVideo({
  id: 'song-o-my-1-thang',
  narration,
  scenes: {
    hook: Hook,
    assumptions: Assumptions,
    housing: Housing,
    utilities: Utilities,
    food: Food,
    car: CarScene,
    health: Health,
    other: Other,
    total: Total,
    scenarios: Scenarios,
    tips: Tips,
    outro: Outro,
  },
  budget: [
    {scene: 'housing', marker: 'pick', label: 'Nhà ở', value: BUDGET.housing},
    {scene: 'utilities', marker: 'pick', label: 'Điện nước', value: BUDGET.utilities},
    {scene: 'food', marker: 'pick', label: 'Ăn uống', value: BUDGET.food},
    {scene: 'car', marker: 'pick', label: 'Xe hơi', value: BUDGET.car},
    {scene: 'health', marker: 'pick', label: 'Bảo hiểm', value: BUDGET.health},
    {scene: 'other', marker: 'pick', label: 'Khác', value: BUDGET.other},
  ],
});
