import type {LucideIcon} from 'lucide-react';
import {AbsoluteFill} from 'remotion';
import {type At} from '../SceneContext';
import {PickBadge, SceneHeader, SourceNote} from '../components/SceneParts';
import {type Accent, theme} from '../theme';

/** Khung cho một khoản chi: tiêu đề, phần thân tự do, huy hiệu số chốt, nguồn. */
export const CostLayout: React.FC<{
  kicker: string;
  title: string;
  icon?: LucideIcon;
  color?: Accent;
  pick?: {at: At; value: number};
  source?: string;
  children: React.ReactNode;
}> = ({kicker, title, icon, color, pick, source, children}) => (
  <AbsoluteFill>
    <div
      style={{
        position: 'absolute',
        inset: `${theme.safe.top}px ${theme.safe.x}px ${theme.safe.bottom}px`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <SceneHeader kicker={kicker} title={title} icon={icon} color={color} />
        {pick && <PickBadge at={pick.at} value={pick.value} />}
      </div>
      <div style={{flex: 1, marginTop: 48, display: 'flex', gap: 48, minHeight: 0}}>{children}</div>
    </div>
    {source && <SourceNote>{source}</SourceNote>}
  </AbsoluteFill>
);
