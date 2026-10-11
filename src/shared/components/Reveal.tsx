import {Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {type At, useAt} from '../SceneContext';

/** Hiện phần tử (mờ dần + trượt lên) đúng lúc lời đọc tới mốc `at`. */
export const Reveal: React.FC<{
  at?: At;
  delay?: number;
  y?: number;
  scale?: boolean;
  /** Hiệu ứng âm thanh khi xuất hiện, ví dụ "pop" (file trong public/sound/). */
  sfx?: string;
  sfxVolume?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at, delay = 0, y = 28, scale, sfx, sfxVolume = 0.5, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = useAt()(at, fps) + delay;
  const p = spring({frame: frame - start, fps, config: {damping: 200, mass: 0.7}, durationInFrames: 20});
  return (
    <>
    {sfx && (
      <Sequence from={start} durationInFrames={2 * fps} layout="none">
        <Audio src={staticFile(`sound/${sfx}.mp3`)} volume={sfxVolume} />
      </Sequence>
    )}
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * y}px) scale(${scale ? 0.92 + 0.08 * p : 1})`,
        ...style,
      }}
    >
      {children}
    </div>
    </>
  );
};

/** Tiến độ 0..1 kể từ mốc `at`, dùng cho các hiệu ứng tự viết. */
export const useProgress = (at: At, durationInFrames = 24, delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = useAt()(at, fps) + delay;
  return spring({frame: frame - start, fps, config: {damping: 200}, durationInFrames});
};

/** Chỉ phát một hiệu ứng âm thanh tại mốc `at` (không hiển thị gì). */
export const Sfx: React.FC<{at: At; sound: string; volume?: number}> = ({at, sound, volume = 0.5}) => {
  const {fps} = useVideoConfig();
  const start = useAt()(at, fps);
  return (
    <Sequence from={start} durationInFrames={2 * fps} layout="none">
      <Audio src={staticFile(`sound/${sound}.mp3`)} volume={volume} />
    </Sequence>
  );
};
