import type {LucideIcon} from 'lucide-react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import channel from '../channel.json';
import {Reveal, Sfx} from '../components/Reveal';
import {type At, useAt} from '../SceneContext';
import {type Accent, accent, theme} from '../theme';

/** Lớp tối phủ lên cảnh quay để chữ dễ đọc. */
export const Dim: React.FC<{v?: number}> = ({v = 0.5}) => <AbsoluteFill style={{background: `rgba(6,11,21,${v})`}} />;

/** Con số "nhảy" lần lượt (30 triệu? → 50 triệu? → …) kèm tiếng nhấn. */
export const FlipNumber: React.FC<{steps: {at: At; text: string; color?: string}[]; to: At; caption?: string}> = ({steps, to, caption}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const atf = useAt();
  const frames = steps.map((s) => atf(s.at, fps));
  const end = atf(to, fps);
  const idx = frames.reduce((acc, f, i) => (frame >= f ? i : acc), -1);
  return (
    <>
      {steps.map((s) => (
        <Sfx key={s.text} at={s.at} sound="impact" volume={0.5} />
      ))}
      {idx >= 0 && frame <= end + 12 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 140, opacity: interpolate(frame, [end, end + 12], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
          <div style={{fontSize: 190, fontWeight: 800, color: steps[idx].color ?? theme.text, transform: `scale(${interpolate(frame - frames[idx], [0, 6, 12], [1.25, 0.96, 1], {extrapolateRight: 'clamp'})})`, letterSpacing: '-0.03em', textShadow: '0 10px 60px rgba(0,0,0,0.75)'}}>
            {steps[idx].text}
          </div>
          {caption && <div style={{fontSize: 40, fontWeight: 600, color: theme.text, opacity: 0.85, textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>{caption}</div>}
        </AbsoluteFill>
      )}
    </>
  );
};

/** Nút đăng ký kênh (có tiếng chuông). */
export const Subscribe: React.FC<{at: At}> = ({at}) => (
  <Reveal at={at} y={0} scale sfx="ding" sfxVolume={0.4}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <div style={{padding: '18px 40px', borderRadius: 14, background: theme.red, color: 'white', fontSize: 36, fontWeight: 800}}>ĐĂNG KÝ KÊNH</div>
      <span style={{fontSize: 36, fontWeight: 700, color: theme.text, textShadow: '0 4px 20px rgba(0,0,0,0.7)'}}>{channel.name}</span>
    </div>
  </Reveal>
);

/** Màn câu hỏi bình luận + đăng ký ở cuối video. */
export const QuestionCta: React.FC<{at: At; subAt: At; text: string}> = ({at, subAt, text}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 50, paddingBottom: 150}}>
    <Reveal at={at}>
      <div style={{fontSize: 54, fontWeight: 700, color: theme.text, textAlign: 'center', maxWidth: 1400, lineHeight: 1.3, padding: '30px 50px', borderRadius: 24, background: 'rgba(7,12,22,0.75)', border: `1px solid ${theme.line}`, textWrap: 'balance'}}>
        “{text}”
      </div>
    </Reveal>
    <Subscribe at={subAt} />
  </AbsoluteFill>
);

/** Thẻ kết luận: đối tượng + phán quyết, có thanh màu bên trái. */
export const Verdict: React.FC<{at: At; who: string; verdict: string; color: Accent; icon: LucideIcon}> = ({at, who, verdict, color, icon: Icon}) => (
  <Reveal at={at} y={14} sfx="pop" sfxVolume={0.4}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 26px', borderRadius: 18, background: 'rgba(7,12,22,0.85)', borderLeft: `8px solid ${accent(color)}`}}>
      <Icon size={44} color={accent(color)} />
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <span style={{fontSize: 27, color: theme.muted, fontWeight: 600}}>{who}</span>
        <span style={{fontSize: 42, fontWeight: 800, color: accent(color)}}>{verdict}</span>
      </div>
    </div>
  </Reveal>
);

/** Mục đánh số (mẹo, lời khuyên). */
export const Tip: React.FC<{at: At; n: number; title: string; children?: React.ReactNode}> = ({at, n, title, children}) => (
  <Reveal at={at} y={14} sfx="pop" sfxVolume={0.35}>
    <div style={{display: 'flex', gap: 20, padding: '16px 20px', borderRadius: 16, background: theme.surfaceStrong}}>
      <span style={{fontSize: 58, fontWeight: 800, color: theme.gold, width: 44, lineHeight: 1}}>{n}</span>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8, flex: 1}}>
        <span style={{fontSize: 32, fontWeight: 700, color: theme.text}}>{title}</span>
        {children}
      </div>
    </div>
  </Reveal>
);

// ───────── So kè hai bên (California vs Texas, …) ─────────

export type Side = {name: string; color: Accent};

/** Một hàng so sánh hai bên; bên thắng sáng lên tại mốc `winAt`. */
export const VsRow: React.FC<{
  at: At;
  label: string;
  left: string;
  right: string;
  note?: string;
  winner?: 'left' | 'right';
  winAt?: At;
  big?: boolean;
}> = ({at, label, left, right, note, winner, winAt, big}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const atf = useAt();
  const won = winner && winAt !== undefined ? interpolate(frame, [atf(winAt, fps), atf(winAt, fps) + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const cell = (v: string, side: 'left' | 'right') => {
    const isWin = winner === side;
    return (
      <div style={{flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 14, background: isWin ? `rgba(233,180,76,${0.22 * won})` : undefined, border: `2px solid rgba(233,180,76,${isWin ? won : 0})`}}>
        <span style={{fontSize: big ? 66 : 50, fontWeight: 800, color: theme.text, opacity: winner && !isWin ? 1 - 0.45 * won : 1}}>{v}</span>
      </div>
    );
  };
  return (
    <Reveal at={at} y={12} sfx="pop" sfxVolume={0.3}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
        <span style={{fontSize: 25, color: theme.muted, fontWeight: 600, textAlign: 'center'}}>{label}</span>
        <div style={{display: 'flex', gap: 18, alignItems: 'center'}}>
          {cell(left, 'left')}
          <span style={{fontSize: 26, color: theme.faint, fontWeight: 800}}>vs</span>
          {cell(right, 'right')}
        </div>
        {note && <span style={{fontSize: 22, color: theme.faint, textAlign: 'center'}}>{note}</span>}
      </div>
    </Reveal>
  );
};

/** Bảng so kè: tiêu đề hai bên + các hàng VsRow. */
export const VsPanel: React.FC<{left: Side; right: Side; title?: string; children: React.ReactNode; width?: number}> = ({left, right, title, children, width = 1100}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 175}}>
    <div style={{width, background: 'rgba(7,12,22,0.86)', borderRadius: 26, border: `1px solid ${theme.line}`, padding: '24px 40px 28px', display: 'flex', flexDirection: 'column', gap: 18, boxShadow: '0 30px 80px rgba(0,0,0,0.5)'}}>
      {title && <div style={{fontSize: 24, fontWeight: 800, letterSpacing: '0.14em', color: theme.muted, textAlign: 'center'}}>{title.toUpperCase()}</div>}
      <div style={{display: 'flex', gap: 18, alignItems: 'center'}}>
        <div style={{flex: 1, textAlign: 'center', fontSize: 34, fontWeight: 800, letterSpacing: '0.08em', color: accent(left.color)}}>{left.name}</div>
        <span style={{width: 34}} />
        <div style={{flex: 1, textAlign: 'center', fontSize: 34, fontWeight: 800, letterSpacing: '0.08em', color: accent(right.color)}}>{right.name}</div>
      </div>
      {children}
    </div>
  </AbsoluteFill>
);

/** Bảng tỷ số góc trên phải; tỷ số đổi tại mốc `at`. */
export const Scoreboard: React.FC<{left: Side; right: Side; before: [number, number]; after: [number, number]; at?: At}> = ({left, right, before, after, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const atf = useAt();
  const t = at === undefined ? -1 : atf(at, fps);
  const on = t >= 0 && frame >= t;
  const [l, r] = on ? after : before;
  const flash = on ? interpolate(frame - t, [0, 6, 40], [0, 1, 0], {extrapolateRight: 'clamp'}) : 0;
  return (
    <>
      {at !== undefined && <Sfx at={at} sound="ding" volume={0.25} />}
      <div style={{position: 'absolute', right: 140, top: 44, display: 'flex', alignItems: 'center', gap: 18, padding: '12px 24px', borderRadius: 16, background: 'rgba(5,9,17,0.7)', border: `1.5px solid rgba(233,180,76,${0.3 + 0.7 * flash})`, boxShadow: `0 0 ${40 * flash}px rgba(233,180,76,0.45)`}}>
        <span style={{fontSize: 22, fontWeight: 800, color: accent(left.color), letterSpacing: '0.08em'}}>{left.name}</span>
        <span style={{fontSize: 44, fontWeight: 800, color: theme.text, fontVariantNumeric: 'tabular-nums'}}>
          {l} – {r}
        </span>
        <span style={{fontSize: 22, fontWeight: 800, color: accent(right.color), letterSpacing: '0.08em'}}>{right.name}</span>
      </div>
    </>
  );
};
