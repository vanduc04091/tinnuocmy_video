import type {LucideIcon} from 'lucide-react';
import {type At} from '../SceneContext';
import {usd} from '../format';
import {type Accent, accent, theme} from '../theme';
import {Reveal} from './Reveal';

/** Tiêu đề chương: "KHOẢN 1/6" + tên + icon. */
export const SceneHeader: React.FC<{kicker: string; title: string; icon?: LucideIcon; color?: Accent}> = ({
  kicker,
  title,
  icon: Icon,
  color = 'gold',
}) => (
  <Reveal y={20}>
    <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
      {Icon && (
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${accent(color)}1F`,
            border: `1.5px solid ${accent(color)}55`,
          }}
        >
          <Icon size={56} color={accent(color)} strokeWidth={1.9} />
        </div>
      )}
      <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
        <span style={{fontSize: 26, fontWeight: 700, letterSpacing: '0.2em', color: accent(color)}}>{kicker}</span>
        <span style={{fontSize: 76, fontWeight: 800, color: theme.text, letterSpacing: '-0.01em', lineHeight: 1.05}}>
          {title}
        </span>
      </div>
    </div>
  </Reveal>
);

/** Huy hiệu "Đưa vào bảng tính: $1.500/tháng". */
export const PickBadge: React.FC<{at: At; value: number; label?: string}> = ({at, value, label = 'Đưa vào bảng tính'}) => (
  <Reveal at={at} y={0} scale>
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 22,
        padding: '20px 34px',
        borderRadius: 18,
        background: theme.gold,
        color: '#1A1408',
        boxShadow: '0 18px 50px rgba(233,180,76,0.30)',
      }}
    >
      <span style={{fontSize: 26, fontWeight: 700, letterSpacing: '0.06em'}}>{label.toUpperCase()}</span>
      <span style={{fontSize: 54, fontWeight: 800}}>
        {usd(value)}
        <span style={{fontSize: 26, fontWeight: 600}}>/tháng</span>
      </span>
    </div>
  </Reveal>
);

/** Dòng nguồn số liệu, góc dưới phải (dưới phụ đề). */
export const SourceNote: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      position: 'absolute',
      right: theme.safe.x,
      bottom: 26,
      fontSize: 20,
      color: theme.faint,
      fontWeight: 500,
    }}
  >
    Nguồn: {children}
  </div>
);
