import {interpolate} from 'remotion';
import {type At} from '../SceneContext';
import {type Accent, accent, theme} from '../theme';
import {AnimatedNumber} from './AnimatedNumber';
import {Reveal, useProgress} from './Reveal';

export type Bar = {label: string; sub?: string; value: number; valueLabel?: string; color?: Accent; at?: At};

const Row: React.FC<{bar: Bar; max: number; labelWidth: number}> = ({bar, max, labelWidth}) => {
  const p = useProgress(bar.at, 34, 4);
  const width = interpolate(p, [0, 1], [0, (bar.value / max) * 100]);
  const color = accent(bar.color ?? 'blue');
  return (
    <Reveal at={bar.at} y={16}>
      <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
        <div style={{width: labelWidth, flexShrink: 0}}>
          <div style={{fontSize: 36, fontWeight: 700, color: theme.text}}>{bar.label}</div>
          {bar.sub && <div style={{fontSize: 24, color: theme.muted, marginTop: 6, lineHeight: 1.3}}>{bar.sub}</div>}
        </div>
        <div style={{flex: 1, height: 92, position: 'relative', display: 'flex', alignItems: 'center'}}>
          <div
            style={{
              height: '100%',
              width: `${width}%`,
              borderRadius: 12,
              background: `linear-gradient(90deg, ${color}CC, ${color})`,
              boxShadow: `0 0 40px ${color}33`,
            }}
          />
          <div style={{marginLeft: 26, fontSize: 52, fontWeight: 800, color: theme.text, whiteSpace: 'nowrap'}}>
            {bar.valueLabel ?? <AnimatedNumber value={bar.value} at={bar.at} frames={34} />}
          </div>
        </div>
      </div>
    </Reveal>
  );
};

/** Biểu đồ cột ngang, từng cột hiện ra theo mốc lời đọc. */
export const BarChart: React.FC<{bars: Bar[]; max?: number; labelWidth?: number; caption?: string}> = ({
  bars,
  max,
  labelWidth = 330,
  caption,
}) => {
  const top = max ?? Math.max(...bars.map((b) => b.value)) * 1.22;
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 46}}>
      {caption && <div style={{fontSize: 29, color: theme.muted, fontWeight: 500}}>{caption}</div>}
      {bars.map((b) => (
        <Row key={b.label} bar={b} max={top} labelWidth={labelWidth} />
      ))}
    </div>
  );
};

