import type {LucideIcon} from 'lucide-react';
import {AbsoluteFill} from 'remotion';
import {type At} from '../SceneContext';
import {Reveal} from '../components/Reveal';
import {SceneHeader} from '../components/SceneParts';
import {type Accent, accent, theme} from '../theme';

export type CheckItem = {at: At; icon?: LucideIcon; text: string; sub?: string};

/** Danh sách các ý (giả định, lời khuyên…), mỗi ý hiện đúng lúc được đọc tới. */
export const ChecklistLayout: React.FC<{
  kicker: string;
  title: string;
  icon?: LucideIcon;
  color?: Accent;
  items: CheckItem[];
  numbered?: boolean;
  footer?: {at: At; text: string};
}> = ({kicker, title, icon, color = 'gold', items, numbered, footer}) => (
  <AbsoluteFill>
    <div
      style={{
        position: 'absolute',
        inset: `${theme.safe.top}px ${theme.safe.x}px ${theme.safe.bottom}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: numbered ? 40 : 30,
      }}
    >
      <SceneHeader kicker={kicker} title={title} icon={icon} color={color} />
      <div style={{display: 'flex', flexDirection: 'column', gap: numbered ? 30 : 20, marginTop: 10}}>
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <Reveal key={it.text} at={it.at} y={18}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 28,
                  padding: numbered ? '30px 40px' : '20px 32px',
                  borderRadius: 18,
                  background: theme.surface,
                  border: `1px solid ${theme.line}`,
                }}
              >
                {numbered ? (
                  <span style={{fontSize: 80, fontWeight: 800, color: accent(color), width: 84, textAlign: 'center'}}>
                    {i + 1}
                  </span>
                ) : (
                  Icon && <Icon size={46} color={accent(color)} strokeWidth={2} />
                )}
                <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                  <span style={{fontSize: numbered ? 46 : 42, fontWeight: 700, color: theme.text}}>{it.text}</span>
                  {it.sub && <span style={{fontSize: 30, color: theme.muted, lineHeight: 1.4}}>{it.sub}</span>}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
      {footer && (
        <Reveal at={footer.at}>
          <div style={{fontSize: 32, color: theme.muted, fontWeight: 500}}>{footer.text}</div>
        </Reveal>
      )}
    </div>
  </AbsoluteFill>
);
