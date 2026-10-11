import type {LucideIcon} from 'lucide-react';
import {AbsoluteFill} from 'remotion';
import {type At} from '../SceneContext';
import {Card} from '../components/Card';
import {Reveal} from '../components/Reveal';
import {SceneHeader} from '../components/SceneParts';
import {type Accent, accent, theme} from '../theme';

export type Scenario = {
  at: At;
  icon: LucideIcon;
  title: string;
  value: string;
  unit?: string;
  color: Accent;
  details: string[];
};

/** So sánh nhiều kịch bản dạng thẻ, có dòng tham chiếu (mức trung bình). */
export const ScenariosLayout: React.FC<{
  kicker: string;
  title: string;
  reference?: string;
  cards: Scenario[];
}> = ({kicker, title, reference, cards}) => (
  <AbsoluteFill>
    <div
      style={{
        position: 'absolute',
        inset: `${theme.safe.top}px ${theme.safe.x}px ${theme.safe.bottom}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: 44,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <SceneHeader kicker={kicker} title={title} />
        {reference && (
          <Reveal>
            <div style={{fontSize: 32, color: theme.muted, fontWeight: 500}}>{reference}</div>
          </Reveal>
        )}
      </div>
      <div style={{display: 'flex', gap: 36, flex: 1, alignItems: 'center'}}>
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Reveal key={c.title} at={c.at} style={{flex: 1, display: 'flex', alignSelf: 'stretch', alignItems: 'center'}}>
              <Card highlight={c.color} style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 22, padding: '40px 40px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <Icon size={46} color={accent(c.color)} strokeWidth={2} />
                  <span style={{fontSize: 38, fontWeight: 700, color: theme.text, whiteSpace: 'nowrap'}}>{c.title}</span>
                </div>
                <div style={{fontSize: 64, fontWeight: 800, color: accent(c.color), lineHeight: 1.05, whiteSpace: 'nowrap'}}>
                  {c.value}
                  {c.unit && <span style={{fontSize: 32, color: theme.muted, fontWeight: 600}}>{c.unit}</span>}
                </div>
                <div style={{height: 1, background: theme.line}} />
                {c.details.map((d) => (
                  <div key={d} style={{fontSize: 31, color: theme.muted, lineHeight: 1.35, display: 'flex', gap: 12}}>
                    <span style={{color: accent(c.color)}}>•</span>
                    {d}
                  </div>
                ))}
              </Card>
            </Reveal>
          );
        })}
      </div>
    </div>
  </AbsoluteFill>
);
