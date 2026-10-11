import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import type {TimedShot} from './types';

const XFADE = 12;

/** Một cảnh quay: đẩy máy chậm (Ken Burns), mờ dần vào, kéo dài bằng cách giảm tốc nếu clip ngắn. */
const Shot: React.FC<{shot: TimedShot; index: number; showMissing: boolean}> = ({shot, index, showMissing}) => {
  const frame = useCurrentFrame();
  const total = shot.duration + XFADE;
  const opacity = index === 0 ? 1 : interpolate(frame, [0, XFADE], [0, 1], {extrapolateRight: 'clamp'});
  const zoomIn = index % 2 === 0;
  const scale = interpolate(frame, [0, total], zoomIn ? [1.04, 1.13] : [1.13, 1.04]);
  const drift = interpolate(frame, [0, total], index % 3 === 0 ? [-18, 18] : [14, -14]);
  // Clip ngắn hơn thời lượng cần: chạy chậm lại (tối thiểu 0,55x) thay vì đứng hình
  const rate = shot.clipFrames > 0 ? Math.min(1, Math.max(0.55, (shot.clipFrames - 6) / total)) : 1;

  return (
    <AbsoluteFill style={{opacity}}>
      {shot.src ? (
        <AbsoluteFill style={{transform: `scale(${scale}) translateX(${drift}px)`}}>
          <OffthreadVideo
            src={staticFile(shot.src)}
            muted
            playbackRate={rate}
            style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.06) contrast(1.05)'}}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background: `radial-gradient(1200px 800px at ${30 + index * 17 % 40}% 40%, #1d2b44, ${theme.bgDeep})`,
            transform: `scale(${scale})`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showMissing && (
            <div style={{fontSize: 30, color: theme.faint, fontWeight: 600, border: `2px dashed ${theme.faint}`, padding: '16px 28px', borderRadius: 14}}>
              Cảnh quay {shot.id}: “{shot.query}”
            </div>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/** Lớp cảnh quay nền cho một cảnh, kèm lớp tối để chữ/đồ họa dễ đọc. */
export const BrollTrack: React.FC<{shots: TimedShot[]; showMissing?: boolean; dim?: number}> = ({
  shots,
  showMissing = true,
  dim = 0,
}) => (
  <AbsoluteFill style={{backgroundColor: theme.bgDeep}}>
    {shots.map((s, i) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.duration + XFADE} name={`cảnh quay: ${s.query}`}>
        <Shot shot={s} index={i} showMissing={showMissing} />
      </Sequence>
    ))}
    {/* Lớp màu: tối hai mép + đáy cho phụ đề, giữ cảnh giữa sáng */}
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(4,8,16,0.55) 0%, rgba(4,8,16,0) 22%, rgba(4,8,16,0) 58%, rgba(4,8,16,0.82) 100%)',
      }}
    />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)'}} />
    {dim > 0 && <AbsoluteFill style={{background: `rgba(6,11,21,${dim})`}} />}
  </AbsoluteFill>
);
