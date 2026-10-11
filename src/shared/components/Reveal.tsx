import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {type At, useAt} from '../SceneContext';

/** Hiện phần tử (mờ dần + trượt lên) đúng lúc lời đọc tới mốc `at`. */
export const Reveal: React.FC<{
  at?: At;
  delay?: number;
  y?: number;
  scale?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at, delay = 0, y = 28, scale, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = useAt()(at, fps) + delay;
  const p = spring({frame: frame - start, fps, config: {damping: 200, mass: 0.7}, durationInFrames: 20});
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * y}px) scale(${scale ? 0.92 + 0.08 * p : 1})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Tiến độ 0..1 kể từ mốc `at`, dùng cho các hiệu ứng tự viết. */
export const useProgress = (at: At, durationInFrames = 24, delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = useAt()(at, fps) + delay;
  return spring({frame: frame - start, fps, config: {damping: 200}, durationInFrames});
};
