import type {LucideIcon} from 'lucide-react';
import {type Accent, accent, theme} from '../theme';

export const Card: React.FC<{style?: React.CSSProperties; children: React.ReactNode; highlight?: Accent}> = ({
  style,
  children,
  highlight,
}) => (
  <div
    style={{
      background: theme.surface,
      border: `1.5px solid ${highlight ? accent(highlight) : theme.line}`,
      borderRadius: theme.radius,
      padding: '36px 44px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Thẻ số liệu: nhãn nhỏ, con số lớn, ghi chú. */
export const StatCard: React.FC<{
  icon?: LucideIcon;
  label: string;
  value: React.ReactNode;
  note?: string;
  color?: Accent;
  valueSize?: number;
  style?: React.CSSProperties;
}> = ({icon: Icon, label, value, note, color = 'gold', valueSize = 74, style}) => (
  <Card style={{display: 'flex', flexDirection: 'column', gap: 10, ...style}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 14, color: theme.muted, fontSize: 31, fontWeight: 500}}>
      {Icon && <Icon size={36} color={accent(color)} strokeWidth={2} />}
      {label}
    </div>
    <div style={{fontSize: valueSize, fontWeight: 800, color: theme.text, letterSpacing: '-0.01em', lineHeight: 1.1, whiteSpace: 'nowrap'}}>{value}</div>
    {note && <div style={{fontSize: 27, color: theme.muted, lineHeight: 1.4}}>{note}</div>}
  </Card>
);

/** Ghi chú có thanh màu bên trái — dùng cho mẹo / cảnh báo. */
export const Callout: React.FC<{icon?: LucideIcon; color?: Accent; title?: string; children: React.ReactNode}> = ({
  icon: Icon,
  color = 'teal',
  title,
  children,
}) => (
  <div
    style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start',
      background: theme.surface,
      borderLeft: `6px solid ${accent(color)}`,
      borderRadius: 14,
      padding: '30px 34px',
    }}
  >
    {Icon && <Icon size={42} color={accent(color)} strokeWidth={2} style={{flexShrink: 0, marginTop: 2}} />}
    <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
      {title && (
        <div style={{fontSize: 24, fontWeight: 700, letterSpacing: '0.12em', color: accent(color)}}>
          {title.toUpperCase()}
        </div>
      )}
      <div style={{fontSize: 34, lineHeight: 1.42, color: theme.text, fontWeight: 500}}>{children}</div>
    </div>
  </div>
);
