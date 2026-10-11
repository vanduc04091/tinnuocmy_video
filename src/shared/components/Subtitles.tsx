import {interpolate, useCurrentFrame} from 'remotion';
import type {TimedScene} from '../narration/types';
import {theme} from '../theme';

/** Phụ đề tiếng Việt chạy theo lời đọc (đốt cứng vào video). */
export const Subtitles: React.FC<{scenes: TimedScene[]}> = ({scenes}) => {
  const frame = useCurrentFrame();
  const cue = scenes.flatMap((s) => s.cues).find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;
  const opacity = interpolate(frame, [cue.from, cue.from + 4], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 70,
        display: 'flex',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          padding: '14px 30px',
          borderRadius: 14,
          background: 'rgba(5,9,17,0.78)',
          border: `1px solid ${theme.line}`,
          color: theme.text,
          fontSize: 40,
          fontWeight: 500,
          lineHeight: 1.38,
          textAlign: 'center',
          textWrap: 'balance',
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};
