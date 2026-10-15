import {Composition, Still} from 'remotion';
import {Avatar, AvatarSang, Banner} from './thumbnails/Brand';
import {Thumbnail} from './thumbnails/Thumbnail';
import {thumbnails} from './thumbnails/list';
import {shorts} from './shorts/registry';
import {videos} from './videos/registry';

export const RemotionRoot: React.FC = () => (
  <>
    {videos.map((v) => (
      <Composition
        key={v.id}
        id={v.id}
        component={v.Component}
        calculateMetadata={v.calculateMetadata}
        defaultProps={{timeline: null}}
        durationInFrames={300}
        fps={v.fps}
        width={v.width}
        height={v.height}
      />
    ))}
    {shorts.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={s.Component}
        calculateMetadata={s.calculateMetadata}
        defaultProps={{timeline: null}}
        durationInFrames={300}
        fps={s.fps}
        width={s.width}
        height={s.height}
      />
    ))}
    {Object.entries(thumbnails).flatMap(([slug, set]) =>
      Object.entries(set).map(([k, props]) => (
        <Still key={`${slug}-${k}`} id={`thumb-${slug}-${k}`} component={Thumbnail as React.FC<Record<string, unknown>>} width={1280} height={720} defaultProps={props as Record<string, unknown>} />
      )),
    )}
    <Still id="thumb-kenh-avatar-chu" component={Avatar} width={800} height={800} defaultProps={{variant: 'chu' as const}} />
    <Still id="thumb-kenh-avatar-tuong" component={Avatar} width={800} height={800} defaultProps={{variant: 'tuong' as const}} />
    <Still id="thumb-kenh-avatar-sang-1" component={AvatarSang} width={800} height={800} defaultProps={{img: 'brand-liberty-11-sq', x: 0, y: 0, scale: 1}} />
    <Still id="thumb-kenh-avatar-sang-2" component={AvatarSang} width={800} height={800} defaultProps={{img: 'brand-liberty-16-sq', x: 0, y: 0, scale: 1}} />
    <Still id="thumb-kenh-avatar-sang-3" component={AvatarSang} width={800} height={800} defaultProps={{img: 'brand-liberty-18-sq', x: 0, y: 0, scale: 1}} />
    <Still id="thumb-kenh-banner" component={Banner} width={2560} height={1440} />
  </>
);
