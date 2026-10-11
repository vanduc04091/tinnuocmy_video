import type {LucideIcon} from 'lucide-react';
import {Reveal} from '../components/Reveal';
import {AnimatedNumber} from '../components/AnimatedNumber';
import {type At} from '../SceneContext';
import {type Accent, accent, theme} from '../theme';

/** Khung kính tối đặt ở một bên khung hình — nơi duy nhất hiện số liệu. */
export const Panel: React.FC<{
  side?: 'left' | 'right';
  width?: number;
  top?: number;
  kicker?: string;
  title?: string;
  color?: Accent;
  children: React.ReactNode;
}> = ({side = 'right', width = 760, top = 150, kicker, title, color = 'gold', children}) => (
  <div
    style={{
      position: 'absolute',
      top,
      [side]: 100,
      width,
      padding: '34px 40px',
      borderRadius: 26,
      background: 'rgba(7,12,22,0.80)',
      border: `1px solid ${theme.line}`,
      boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
      display: 'flex',
      flexDirection: 'column',
      gap: 22,
    }}
  >
    {(kicker || title) && (
      <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
        {kicker && (
          <span style={{fontSize: 22, fontWeight: 700, letterSpacing: '0.18em', color: accent(color)}}>
            {kicker.toUpperCase()}
          </span>
        )}
        {title && <span style={{fontSize: 40, fontWeight: 800, color: theme.text, lineHeight: 1.15}}>{title}</span>}
      </div>
    )}
    {children}
  </div>
);

/** Một dòng số liệu lớn trong Panel. */
export const PanelStat: React.FC<{
  at?: At;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  text?: string;
  note?: string;
  color?: Accent;
  sfx?: string;
}> = ({at, label, value, prefix = '$', suffix = '', text, note, color = 'gold', sfx = 'pop'}) => (
  <Reveal at={at} y={14} sfx={sfx}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
      <span style={{fontSize: 26, color: theme.muted, fontWeight: 500}}>{label}</span>
      <span style={{fontSize: 70, fontWeight: 800, color: accent(color), lineHeight: 1.05, whiteSpace: 'nowrap'}}>
        {text ?? <AnimatedNumber value={value} at={at} prefix={prefix} suffix={suffix} />}
      </span>
      {note && <span style={{fontSize: 22, color: theme.faint, lineHeight: 1.35}}>{note}</span>}
    </div>
  </Reveal>
);

/** Danh sách "thẻ" từ khóa hiện lần lượt theo lời đọc. */
export const ChipList: React.FC<{
  items: {at: At; text: string; icon?: LucideIcon}[];
  color?: Accent;
  columns?: number;
}> = ({items, color = 'gold', columns = 1}) => (
  <div style={{display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 14}}>
    {items.map(({at, text, icon: Icon}) => (
      <Reveal key={text} at={at} y={12} sfx="pop" sfxVolume={0.35}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '16px 22px',
            borderRadius: 14,
            background: theme.surfaceStrong,
            borderLeft: `5px solid ${accent(color)}`,
          }}
        >
          {Icon && <Icon size={36} color={accent(color)} strokeWidth={2} />}
          <span style={{fontSize: 34, fontWeight: 600, color: theme.text}}>{text}</span>
        </div>
      </Reveal>
    ))}
  </div>
);
