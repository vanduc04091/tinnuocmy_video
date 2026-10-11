import {Composition} from 'remotion';
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
  </>
);
