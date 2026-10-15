import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../shared/components/Reveal';
import {type At, useAt} from '../shared/SceneContext';
import {type Accent, accent, theme} from '../shared/theme';
import channel from '../shared/channel.json';

/**
 * Bố cục khung dọc 1080×1920 — chừa chỗ cho giao diện YouTube Shorts:
 *  trên 0–150 (thanh tìm kiếm), dưới 1460–1920 (tên kênh, tiêu đề), phải 960–1080 từ y≈1100 (nút thích/bình luận).
 */
export const SHORT = {header: 160, midTop: 470, midBottom: 1120, caption: 1200, x: 64} as const;

const shadow = '0 4px 0 rgba(0,0,0,0.5), 0 0 34px rgba(0,0,0,0.7)';

export const Header: React.FC<{title: [string, string]; source: string}> = ({title, source}) => (
  <div style={{position: 'absolute', top: SHORT.header, left: SHORT.x, right: SHORT.x, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22}}>
      <div style={{width: 8, height: 30, borderRadius: 3, background: theme.gold}} />
      <span style={{fontSize: 28, fontWeight: 800, letterSpacing: '0.16em'}}>{channel.name.toUpperCase()}</span>
    </div>
    <div style={{fontSize: 68, fontWeight: 800, lineHeight: 1.24, letterSpacing: '-0.01em', textShadow: shadow}}>{title[0]}</div>
    <div style={{fontSize: 68, fontWeight: 800, lineHeight: 1.24, letterSpacing: '-0.01em', color: theme.gold, textShadow: shadow}}>{title[1]}</div>
    <div style={{marginTop: 16, fontSize: 24, fontWeight: 500, color: theme.muted, textShadow: shadow}}>{source}</div>
  </div>
);

/** Phụ đề cụm 2–4 từ, chữ to, bật lên theo giọng đọc. */
export const Captions: React.FC<{captions: {text: string; from: number; to: number}[]}> = ({captions}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cue = captions.find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;
  const p = spring({frame: frame - cue.from, fps, config: {damping: 14, mass: 0.5}, durationInFrames: 8});
  return (
    <div style={{position: 'absolute', top: SHORT.caption, left: 120, right: 120, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          transform: `scale(${0.86 + 0.14 * p})`,
          padding: '10px 26px',
          borderRadius: 18,
          background: 'rgba(5,9,17,0.72)',
          fontSize: 62,
          fontWeight: 800,
          lineHeight: 1.18,
          textAlign: 'center',
          textWrap: 'balance',
          color: theme.text,
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};

/** Vùng giữa khung (giữa tiêu đề và phụ đề). */
export const Mid: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{position: 'absolute', top: SHORT.midTop, left: SHORT.x, right: SHORT.x, height: SHORT.midBottom - SHORT.midTop, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...style}}>
    {children}
  </div>
);

export const card: React.CSSProperties = {
  width: '100%',
  borderRadius: 34,
  background: 'rgba(6,11,21,0.84)',
  border: `2px solid ${theme.line}`,
  boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
  padding: '34px 44px',
};

/** Hiện trong khoảng [from, to) — giống Window nhưng phóng nhẹ thay vì trượt ngang. */
export const Show: React.FC<{from?: At; to?: At; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = useAt();
  const a = at(from, fps);
  const b = to === undefined ? Infinity : at(to, fps);
  if (frame < a || frame >= b + 8) return null;
  const pin = spring({frame: frame - a, fps, config: {damping: 16, mass: 0.6}, durationInFrames: 14});
  const out = Number.isFinite(b) ? interpolate(frame, [b, b + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return <AbsoluteFill style={{opacity: Math.min(pin, out), transform: `scale(${0.9 + 0.1 * pin})`}}>{children}</AbsoluteFill>;
};

/** Một con số lớn: dòng nhỏ phía trên, số thật to, dòng giải thích phía dưới. */
export const Stat: React.FC<{from?: At; to?: At; kicker: string; value: string; sub?: string; color?: Accent; size?: number; sfx?: boolean}> = ({
  from,
  to,
  kicker,
  value,
  sub,
  color = 'gold',
  size = 170,
  sfx = true,
}) => (
  <>
    {sfx && <Sfx at={from ?? 0} sound="impact" volume={0.4} />}
    <Show from={from} to={to}>
      <Mid>
        <div style={{...card, textAlign: 'center', padding: '40px 40px 46px'}}>
          <div style={{fontSize: 38, fontWeight: 700, color: theme.muted, letterSpacing: '0.02em'}}>{kicker}</div>
          <div style={{fontSize: size, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', color: accent(color), fontVariantNumeric: 'tabular-nums', margin: '8px 0 6px'}}>{value}</div>
          {sub && <div style={{fontSize: 44, fontWeight: 700, color: theme.text}}>{sub}</div>}
        </div>
      </Mid>
    </Show>
  </>
);

/** Con số đổi liên tục theo mốc (vd. 30 triệu? → 50 triệu? → 100+ triệu?). */
export const Flip: React.FC<{steps: {at: At; text: string; color?: Accent}[]; to?: At; sub?: string}> = ({steps, to, sub}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = useAt();
  const frames = steps.map((s) => at(s.at, fps));
  const end = to === undefined ? Infinity : at(to, fps);
  const idx = frames.reduce((acc, f, i) => (frame >= f ? i : acc), -1);
  if (idx < 0 || frame >= end + 8) return null;
  const pop = interpolate(frame - frames[idx], [0, 5, 10], [1.3, 0.95, 1], {extrapolateRight: 'clamp'});
  const fade = Number.isFinite(end) ? interpolate(frame, [end, end + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const s = steps[idx];
  return (
    <>
      {steps.map((st, i) => (
        <Sfx key={i} at={st.at} sound="impact" volume={0.45} />
      ))}
      <Mid style={{opacity: fade}}>
        <div style={{fontSize: 150, fontWeight: 800, letterSpacing: '-0.03em', color: s.color ? accent(s.color) : theme.text, transform: `scale(${pop})`, textShadow: shadow, whiteSpace: 'nowrap'}}>
          {s.text}
        </div>
        {sub && <div style={{fontSize: 50, fontWeight: 700, textShadow: shadow, marginTop: 6}}>{sub}</div>}
      </Mid>
    </>
  );
};

/** Hóa đơn: từng dòng hiện theo mốc, dòng tổng ở cuối. */
export const Receipt: React.FC<{
  from?: At;
  to?: At;
  title: string;
  rows: {at: At; label: string; value: string}[];
  total?: {at: At; label: string; value: string; sub?: string};
}> = ({from, to, title, rows, total}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = useAt();
  const rowIn = (a: At) => spring({frame: frame - at(a, fps), fps, config: {damping: 200}, durationInFrames: 10});
  return (
    <>
      {rows.map((r, i) => (
        <Sfx key={i} at={r.at} sound="pop" volume={0.35} />
      ))}
      {total && <Sfx at={total.at} sound="ding" volume={0.45} />}
      <Show from={from} to={to}>
        <Mid>
          <div style={{...card, padding: '30px 42px 34px'}}>
            <div style={{fontSize: 32, fontWeight: 700, color: theme.muted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10}}>{title}</div>
            {rows.map((r, i) => {
              const p = rowIn(r.at);
              return (
                <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 44, fontWeight: 600, padding: '8px 0', borderBottom: `1px dashed ${theme.line}`, opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
                  <span>{r.label}</span>
                  <span style={{fontWeight: 800, fontVariantNumeric: 'tabular-nums'}}>{r.value}</span>
                </div>
              );
            })}
            {total && (() => {
              const p = rowIn(total.at);
              return (
                <div style={{marginTop: 18, opacity: p, transform: `scale(${0.92 + 0.08 * p})`, transformOrigin: 'left center'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <span style={{fontSize: 46, fontWeight: 800}}>{total.label}</span>
                    <span style={{fontSize: 92, fontWeight: 800, color: theme.gold, letterSpacing: '-0.02em'}}>{total.value}</span>
                  </div>
                  {total.sub && <div style={{textAlign: 'right', fontSize: 40, fontWeight: 700, color: theme.text}}>{total.sub}</div>}
                </div>
              );
            })()}
          </div>
        </Mid>
      </Show>
    </>
  );
};

/** Bảng so sánh hai nơi, từng dòng hiện theo mốc. */
export const Versus: React.FC<{
  from?: At;
  to?: At;
  left: string;
  right: string;
  rows: {at: At; label: string; left: string; right: string; win?: 'left' | 'right'}[];
}> = ({from, to, left, right, rows}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = useAt();
  return (
    <>
      {rows.map((r, i) => (
        <Sfx key={i} at={r.at} sound="pop" volume={0.35} />
      ))}
      <Show from={from} to={to}>
        <Mid>
          <div style={{...card, padding: '28px 34px 30px'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8}}>
              <div style={{textAlign: 'center', fontSize: 42, fontWeight: 800, color: theme.gold}}>{left}</div>
              <div style={{textAlign: 'center', fontSize: 42, fontWeight: 800, color: theme.teal}}>{right}</div>
            </div>
            {rows.map((r, i) => {
              const p = spring({frame: frame - at(r.at, fps), fps, config: {damping: 200}, durationInFrames: 10});
              const cell = (side: 'left' | 'right', v: string): React.CSSProperties => ({
                textAlign: 'center',
                fontSize: 62,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
                color: r.win === side ? theme.text : r.win ? theme.muted : theme.text,
                background: r.win === side ? 'rgba(67,194,168,0.16)' : 'transparent',
                borderRadius: 16,
                padding: '2px 0',
              });
              return (
                <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 20}px)`, borderTop: `1px solid ${theme.line}`, padding: '12px 0 10px'}}>
                  <div style={{textAlign: 'center', fontSize: 30, fontWeight: 600, color: theme.muted, marginBottom: 2}}>{r.label}</div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                    <div style={cell('left', r.left)}>{r.left}</div>
                    <div style={cell('right', r.right)}>{r.right}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Mid>
      </Show>
    </>
  );
};

/** Hai dòng đối lập: dòng gạch bỏ (sai) và dòng nhấn mạnh (đúng). */
export const Verdict: React.FC<{from?: At; to?: At; wrong: {at: At; text: string}; right: {at: At; text: string}}> = ({from, to, wrong, right}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = useAt();
  const pw = spring({frame: frame - at(wrong.at, fps), fps, config: {damping: 200}, durationInFrames: 12});
  const pr = spring({frame: frame - at(right.at, fps), fps, config: {damping: 14, mass: 0.6}, durationInFrames: 14});
  const strike = interpolate(frame - at(right.at, fps), [0, 10], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const line: React.CSSProperties = {...card, display: 'flex', alignItems: 'center', gap: 26, fontSize: 60, fontWeight: 800, padding: '30px 40px'};
  return (
    <>
      <Sfx at={wrong.at} sound="pop" volume={0.35} />
      <Sfx at={right.at} sound="ding" volume={0.45} />
      <Show from={from} to={to}>
        <Mid style={{gap: 34}}>
          <div style={{...line, opacity: pw * (pr > 0.01 ? 0.6 : 1), position: 'relative'}}>
            <span style={{color: theme.red, fontSize: 70}}>✕</span>
            <span style={{position: 'relative'}}>
              {wrong.text}
              <span style={{position: 'absolute', left: 0, top: '52%', height: 7, width: `${strike}%`, background: theme.red, borderRadius: 4}} />
            </span>
          </div>
          <div style={{...line, opacity: pr, transform: `scale(${0.9 + 0.1 * pr})`, border: `3px solid ${theme.teal}`}}>
            <span style={{color: theme.teal, fontSize: 70}}>✓</span>
            <span>{right.text}</span>
          </div>
        </Mid>
      </Show>
    </>
  );
};

/** Màn kết 2,8 giây: thumbnail tập dài + lời mời xem bản đầy đủ (gắn "Related video" khi đăng). */
export const EndCard: React.FC<{line: string; children?: React.ReactNode}> = ({line, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 16, mass: 0.7}, durationInFrames: 16});
  const bob = Math.sin(frame / 5) * 10;
  return (
    <AbsoluteFill style={{background: `radial-gradient(1100px 1300px at 50% 40%, #16233a, ${theme.bgDeep})`, alignItems: 'center', paddingTop: 300}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, opacity: p}}>
        <div style={{width: 8, height: 30, borderRadius: 3, background: theme.gold}} />
        <span style={{fontSize: 30, fontWeight: 800, letterSpacing: '0.16em'}}>{channel.name.toUpperCase()}</span>
      </div>
      <div style={{fontSize: 64, fontWeight: 800, textAlign: 'center', lineHeight: 1.15, padding: '0 70px', opacity: p}}>Xem bản đầy đủ</div>
      <div style={{fontSize: 44, fontWeight: 600, color: theme.gold, textAlign: 'center', lineHeight: 1.25, padding: '10px 80px 46px', opacity: p, textWrap: 'balance'}}>{line}</div>
      {children && (
        <div style={{width: 960, height: 540, borderRadius: 28, overflow: 'hidden', boxShadow: '0 30px 90px rgba(0,0,0,0.6)', border: `3px solid ${theme.gold}`, transform: `scale(${0.85 + 0.15 * p})`, opacity: p}}>
          <div style={{width: 1280, height: 720, transform: 'scale(0.75)', transformOrigin: 'top left', position: 'relative'}}>{children}</div>
        </div>
      )}
      <div style={{marginTop: 56, fontSize: 40, fontWeight: 700, color: theme.muted, opacity: p}}>Bấm vào video liên quan bên dưới</div>
      <div style={{fontSize: 80, color: theme.gold, transform: `translateY(${bob}px)`, opacity: p}}>↓</div>
    </AbsoluteFill>
  );
};
