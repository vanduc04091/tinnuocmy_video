import channel from '../channel.json';
import {theme} from '../theme';

export const BrandBug: React.FC = () => (
  <div style={{position: 'absolute', left: theme.safe.x, top: 56, display: 'flex', alignItems: 'center', gap: 16}}>
    <div style={{width: 10, height: 34, borderRadius: 3, background: theme.gold}} />
    <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.1}}>
      <span style={{fontSize: 24, fontWeight: 800, letterSpacing: '0.16em', color: theme.text}}>
        {channel.name.toUpperCase()}
      </span>
      <span style={{fontSize: 16, fontWeight: 500, letterSpacing: '0.06em', color: theme.muted}}>{channel.tagline}</span>
    </div>
  </div>
);
