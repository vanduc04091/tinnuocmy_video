import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {type At, useAt} from '../SceneContext';

/** Chỉ hiện nội dung trong khoảng [from, to) của cảnh (mốc lời đọc hoặc giây), có mờ vào/ra. */
export const Window: React.FC<{
  from?: At;
  to?: At;
  slide?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({from, to, slide = 40, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = useAt();
  const a = at(from, fps);
  const b = to === undefined ? Infinity : at(to, fps);
  if (frame < a - 1 || frame > b + 14) return null;
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const p = Number.isFinite(b)
    ? interpolate(frame, [a, a + 14, Math.max(a + 15, b), Math.max(a + 15, b) + 12], [0, 1, 1, 0], clamp)
    : interpolate(frame, [a, a + 14], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - p, 3);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: eased, transform: `translateX(${(1 - eased) * slide}px)`, ...style}}>
      {children}
    </div>
  );
};
