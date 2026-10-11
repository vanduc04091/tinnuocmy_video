import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

/** Nền tối, lưới mờ và hai quầng sáng trôi chậm — dùng chung cho mọi video. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = frame / Math.max(durationInFrames, 1);
  const drift = interpolate(t, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 700px at ${18 + drift * 20}% ${12 + drift * 10}%, rgba(233,180,76,0.10), transparent 70%),
            radial-gradient(1100px 800px at ${88 - drift * 15}% ${92 - drift * 12}%, rgba(67,194,168,0.08), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          backgroundPosition: `${-frame * 0.15}px ${-frame * 0.08}px`,
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />
      <AbsoluteFill
        style={{background: `radial-gradient(ellipse at center, transparent 55%, ${theme.bgDeep} 100%)`, opacity: 0.85}}
      />
    </AbsoluteFill>
  );
};
