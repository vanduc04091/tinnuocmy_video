import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {type At, useAt} from '../SceneContext';
import {num} from '../format';

/** Số đếm lên từ `from` tới `value` bắt đầu tại mốc `at`. */
export const AnimatedNumber: React.FC<{
  value: number;
  from?: number;
  at?: At;
  frames?: number;
  prefix?: string;
  suffix?: string;
}> = ({value, from = 0, at, frames = 36, prefix = '$', suffix = ''}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = useAt()(at, fps);
  const v = interpolate(frame, [start, start + frames], [from, value], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <span style={{fontVariantNumeric: 'tabular-nums'}}>
      {prefix}
      {num(v)}
      {suffix}
    </span>
  );
};
