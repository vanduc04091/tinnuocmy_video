import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Reveal} from '../components/Reveal';
import {type At, useAt} from '../SceneContext';
import {theme} from '../theme';

/** Tiêu đề chương ở góc dưới trái lúc mở cảnh, sau đó thu nhỏ thành nhãn góc trên. */
export const ChapterTitle: React.FC<{index: string; title: string; hold?: number}> = ({index, title, hold = 3.2}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const end = Math.round(hold * fps);
  const big = interpolate(frame, [4, 18, end, end + 14], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const small = interpolate(frame, [end + 6, end + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bar = interpolate(frame, [4, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <div style={{position: 'absolute', left: 140, bottom: 250, opacity: big, transform: `translateY(${(1 - big) * 20}px)`}}>
        <div style={{fontSize: 30, fontWeight: 700, color: theme.gold, letterSpacing: '0.24em'}}>{index}</div>
        <div style={{fontSize: 104, fontWeight: 800, color: theme.text, lineHeight: 1.05, letterSpacing: '-0.02em', textShadow: '0 6px 40px rgba(0,0,0,0.6)'}}>
          {title}
        </div>
        <div style={{height: 8, width: 220 * bar, background: theme.gold, borderRadius: 4, marginTop: 18}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 116,
          opacity: small,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: theme.text,
          padding: '8px 16px',
          borderRadius: 10,
          background: 'rgba(7,12,22,0.6)',
        }}
      >
        <span style={{color: theme.gold}}>{index}</span>
        {title.toUpperCase()}
      </div>
    </>
  );
};

/** Nhãn địa danh (lower third), ví dụ "HOUSTON, TEXAS". */
export const PlaceTag: React.FC<{at: At; to?: At; place: string; sub?: string}> = ({at, to, place, sub}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const atf = useAt();
  const a = atf(at, fps);
  const b = to === undefined ? a + 4 * fps : atf(to, fps);
  if (frame < a || frame > b + 12) return null;
  const p = interpolate(frame, [a, a + 14, Math.max(a + 15, b), Math.max(a + 15, b) + 12], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 140, bottom: 250, opacity: p, display: 'flex', alignItems: 'stretch', gap: 18}}>
      <div style={{width: 8, background: theme.gold, borderRadius: 4, transform: `scaleY(${p})`}} />
      <div>
        <div style={{fontSize: 58, fontWeight: 800, color: theme.text, letterSpacing: '0.02em', textShadow: '0 4px 30px rgba(0,0,0,0.7)'}}>
          {place}
        </div>
        {sub && <div style={{fontSize: 28, color: theme.text, opacity: 0.85, fontWeight: 500}}>{sub}</div>}
      </div>
    </div>
  );
};

/** Chữ lớn giữa màn hình trên nền cảnh quay (câu hỏi, câu chốt). */
export const BigLine: React.FC<{at?: At; to?: At; text: string; sub?: string; size?: number}> = ({at, to, text, sub, size = 92}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const atf = useAt();
  const a = atf(at, fps);
  const b = to === undefined ? Infinity : atf(to, fps);
  if (frame > b + 12) return null;
  const out = b === Infinity ? 1 : interpolate(frame, [b, b + 12], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', inset: '0 140px 220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: out}}>
      <Reveal at={a / fps} y={24}>
        <div style={{fontSize: size, fontWeight: 800, color: theme.text, textAlign: 'center', lineHeight: 1.12, letterSpacing: '-0.02em', textWrap: 'balance', textShadow: '0 6px 50px rgba(0,0,0,0.7)', maxWidth: 1500}}>
          {text}
        </div>
      </Reveal>
      {sub && (
        <Reveal at={a / fps} delay={10}>
          <div style={{fontSize: 34, color: theme.gold, fontWeight: 600, marginTop: 24}}>{sub}</div>
        </Reveal>
      )}
    </div>
  );
};
