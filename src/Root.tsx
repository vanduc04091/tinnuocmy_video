import {Composition, Still} from 'remotion';
import {Thumbnail} from './thumbnails/Thumbnail';
import {thumbnails} from './thumbnails/list';
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
    {Object.entries(thumbnails).flatMap(([slug, set]) =>
      Object.entries(set).map(([k, props]) => (
        <Still key={`${slug}-${k}`} id={`thumb-${slug}-${k}`} component={Thumbnail as React.FC<Record<string, unknown>>} width={1280} height={720} defaultProps={props as Record<string, unknown>} />
      )),
    )}
  </>
);
