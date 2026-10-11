import type {LucideIcon} from 'lucide-react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Reveal} from '../components/Reveal';
import {num} from '../format';
import {type At, useAt} from '../SceneContext';
import {theme} from '../theme';

export type Deduction = {at: At; label: string; value: number; icon?: LucideIcon};

/** Số dư tụt dần: bắt đầu từ một khoản tiền, mỗi mốc lời đọc trừ đi một khoản. */
export const BalanceDrain: React.FC<{
  start: {at: At; value: number; label: string};
  items: Deduction[];
  result?: {at: At; label: string};
}> = ({start, items, result}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const atf = useAt();
  const spent = items.reduce((sum, it) => {
    const f = atf(it.at, fps);
    return sum + it.value * interpolate(frame, [f, f + 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  }, 0);
  const balance = start.value - spent;
  const low = balance < start.value * 0.2;
  const resultOn = result ? frame >= atf(result.at, fps) : false;
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
      <Reveal at={start.at} sfx="pop">
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{fontSize: 26, color: theme.muted, fontWeight: 500}}>{resultOn && result ? result.label : start.label}</span>
          <span style={{fontSize: 96, fontWeight: 800, lineHeight: 1.05, color: balance < 0 ? theme.red : low ? theme.gold : theme.teal, fontVariantNumeric: 'tabular-nums', transform: resultOn ? 'scale(1.04)' : undefined, transformOrigin: 'left center'}}>
            {balance < 0 ? '−' : ''}${num(Math.abs(balance))}
          </span>
        </div>
      </Reveal>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        {items.map(({at, label, value, icon: Icon}) => (
          <Reveal key={label} at={at} y={10} sfx="pop" sfxVolume={0.3}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, padding: '8px 0', borderBottom: `1px solid ${theme.line}`}}>
              {Icon && <Icon size={30} color={theme.red} strokeWidth={2} />}
              <span style={{color: theme.text, fontWeight: 500}}>{label}</span>
              <span style={{flex: 1}} />
              <span style={{color: theme.red, fontWeight: 800, fontVariantNumeric: 'tabular-nums'}}>−${num(value)}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

/** Hàng người (ví dụ 6/10): tô màu `highlight` người đầu tiên. */
export const PeopleRow: React.FC<{at: At; total?: number; highlight: number; color?: string; dim?: string}> = ({
  at,
  total = 10,
  highlight,
  color = theme.teal,
  dim = 'rgba(255,255,255,0.18)',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = useAt()(at, fps);
  return (
    <div style={{display: 'flex', gap: 14}}>
      {Array.from({length: total}).map((_, i) => {
        const p = interpolate(frame, [start + i * 3, start + i * 3 + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const c = i < highlight ? color : dim;
        return (
          <svg key={i} width={46} height={92} viewBox="0 0 46 92" style={{opacity: p, transform: `translateY(${(1 - p) * 12}px)`}}>
            <circle cx={23} cy={14} r={12} fill={c} />
            <path d="M6 38 Q6 28 16 28 H30 Q40 28 40 38 V64 H33 V90 H13 V64 H6 Z" fill={c} />
          </svg>
        );
      })}
    </div>
  );
};
