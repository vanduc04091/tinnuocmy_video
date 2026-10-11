import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {type At, useAt} from '../SceneContext';
import {AnimatedNumber} from '../components/AnimatedNumber';
import {Card} from '../components/Card';
import {Reveal} from '../components/Reveal';
import {type Accent, accent, theme} from '../theme';

type Side = {at: At; label: string; text: string; color: Accent};

/**
 * Cảnh mở đầu: con số lớn + hai vế đối lập, sau đó chuyển sang câu hỏi tiêu đề.
 */
export const HookLayout: React.FC<{
  value: number;
  unit: string;
  sides: [Side, Side];
  question: {at: At; text: string; chip?: {at: At; text: string}};
}> = ({value, unit, sides, question}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const qAt = useAt()(question.at, fps);
  const swap = interpolate(frame, [qAt - 6, qAt + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 64,
          paddingBottom: 40,
          opacity: 1 - swap,
          transform: `scale(${1 - swap * 0.06})`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <span style={{fontSize: 240, fontWeight: 800, color: theme.gold, letterSpacing: '-0.03em', lineHeight: 1}}>
            <AnimatedNumber value={value} frames={40} />
          </span>
          <span style={{fontSize: 72, fontWeight: 600, color: theme.muted}}>{unit}</span>
        </div>
        <div style={{display: 'flex', gap: 40}}>
          {sides.map((s) => (
            <Reveal key={s.label} at={s.at}>
              <Card style={{width: 660, padding: '34px 44px'}} highlight={s.color}>
                <div style={{fontSize: 24, fontWeight: 700, letterSpacing: '0.2em', color: accent(s.color)}}>
                  {s.label.toUpperCase()}
                </div>
                <div style={{fontSize: 50, fontWeight: 700, color: theme.text, marginTop: 10}}>{s.text}</div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 60,
          gap: 48,
          opacity: swap,
          transform: `translateY(${(1 - swap) * 30}px)`,
        }}
      >
        <div style={{width: 120, height: 8, borderRadius: 4, background: theme.gold}} />
        <div
          style={{
            fontSize: 118,
            fontWeight: 800,
            color: theme.text,
            textAlign: 'center',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            maxWidth: 1500,
            textWrap: 'balance',
          }}
        >
          {question.text}
        </div>
        {question.chip && (
          <Reveal at={question.chip.at}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 600,
                color: theme.teal,
                padding: '12px 28px',
                borderRadius: 999,
                border: `1.5px solid ${theme.teal}66`,
                background: `${theme.teal}14`,
              }}
            >
              {question.chip.text}
            </div>
          </Reveal>
        )}
      </div>
    </AbsoluteFill>
  );
};
