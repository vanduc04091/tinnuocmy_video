import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {num} from '../format';
import type {TimedScene} from '../narration/types';
import {theme} from '../theme';

export type BudgetItem = {scene: string; marker: string; label: string; value: number};

/**
 * Ô "ngân sách tháng" góc trên phải, cộng dồn mỗi khi một khoản được chốt.
 * Hiện từ cảnh có khoản đầu tiên tới hết cảnh có khoản cuối cùng.
 */
export const RunningTotal: React.FC<{scenes: TimedScene[]; items: BudgetItem[]}> = ({scenes, items}) => {
  const frame = useCurrentFrame();
  const events = items
    .map((it) => {
      const s = scenes.find((x) => x.id === it.scene);
      return s ? {...it, frame: s.from + (s.markers[it.marker] ?? 0)} : null;
    })
    .filter((x): x is BudgetItem & {frame: number} => x !== null);
  if (!events.length) return null;

  const first = scenes.find((s) => s.id === items[0].scene)!;
  const last = scenes.find((s) => s.id === items[items.length - 1].scene)!;
  const showFrom = first.from;
  const showTo = last.from + last.duration;
  if (frame < showFrom - 10 || frame > showTo + 10) return null;

  const total = events.reduce((sum, e) => {
    const p = interpolate(frame, [e.frame, e.frame + 30], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
    return sum + e.value * p;
  }, 0);
  const lastHit = [...events].reverse().find((e) => frame >= e.frame);
  const flash = lastHit ? interpolate(frame - lastHit.frame, [0, 6, 40], [0, 1, 0], {extrapolateRight: 'clamp'}) : 0;
  const opacity = interpolate(frame, [showFrom, showFrom + 15, showTo - 15, showTo], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        right: theme.safe.x,
        top: 44,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '14px 26px',
        borderRadius: 16,
        background: 'rgba(5,9,17,0.6)',
        border: `1.5px solid rgba(233,180,76,${0.25 + flash * 0.75})`,
        boxShadow: `0 0 ${40 * flash}px rgba(233,180,76,0.45)`,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.2}}>
        <span style={{fontSize: 17, fontWeight: 700, letterSpacing: '0.14em', color: theme.muted}}>NGÂN SÁCH THÁNG</span>
        <span style={{fontSize: 17, color: theme.faint}}>
          {events.filter((e) => frame >= e.frame).length}/{events.length} khoản
        </span>
      </div>
      <span style={{fontSize: 44, fontWeight: 800, color: theme.gold, fontVariantNumeric: 'tabular-nums'}}>
        ${num(total)}
      </span>
    </div>
  );
};
