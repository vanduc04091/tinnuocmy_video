import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import type {CalculateMetadataFunction} from 'remotion';
import channel from './channel.json';
import {Background} from './components/Background';
import {BrandBug} from './components/BrandBug';
import {type BudgetItem, RunningTotal} from './components/RunningTotal';
import {Subtitles} from './components/Subtitles';
import {useFonts} from './fonts';
import {buildTimeline, loadManifest} from './narration/timeline';
import type {Narration, Timeline} from './narration/types';
import {SceneContext} from './SceneContext';
import {theme} from './theme';

export type VideoDef = {
  /** ID composition trong Remotion (chỉ chữ, số, dấu gạch). */
  id: string;
  narration: Narration;
  /** Hình ảnh cho từng cảnh, khóa = id cảnh trong narration.json. */
  scenes: Record<string, React.FC>;
  /** Các khoản cộng dồn vào ô "Ngân sách tháng" (tùy chọn). */
  budget?: BudgetItem[];
  /** Nhạc nền trong public/, ví dụ "music/nen.mp3" (tùy chọn). */
  music?: {src: string; volume?: number};
};

export type VideoProps = {timeline: Timeline | null};

const FADE = 9;

const SceneFade: React.FC<{duration: number; children: React.ReactNode}> = ({duration, children}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, FADE, duration - FADE, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

/** Tạo component + calculateMetadata cho một video dựng từ narration.json. */
export const defineVideo = (def: VideoDef) => {
  const Component: React.FC<VideoProps> = ({timeline}) => {
    useFonts();
    if (!timeline) return null;
    return (
      <AbsoluteFill style={{fontFamily: theme.font, color: theme.text}}>
        <Background />
        {timeline.scenes.map((s) => {
          const Visual = def.scenes[s.id];
          return (
            <Sequence key={s.id} from={s.from} durationInFrames={s.duration} name={s.id}>
              <SceneContext.Provider value={s}>
                <SceneFade duration={s.duration}>{Visual ? <Visual /> : null}</SceneFade>
              </SceneContext.Provider>
              {s.audioSrc && (
                <Sequence from={s.leadIn} name={`giọng: ${s.id}`}>
                  <Audio src={staticFile(s.audioSrc)} />
                </Sequence>
              )}
            </Sequence>
          );
        })}
        <BrandBug />
        {def.budget && <RunningTotal scenes={timeline.scenes} items={def.budget} />}
        <Subtitles scenes={timeline.scenes} />
        {def.music && <Audio src={staticFile(def.music.src)} volume={def.music.volume ?? 0.06} loop />}
      </AbsoluteFill>
    );
  };

  const calculateMetadata: CalculateMetadataFunction<VideoProps> = async ({props}) => {
    const manifest = await loadManifest(def.narration.slug);
    const timeline = buildTimeline(def.narration, manifest);
    if (!timeline.hasAudio) {
      console.warn(`[${def.id}] Chưa có audio — đang dùng thời lượng ước lượng. Chạy: npm run tts -- ${def.narration.slug}`);
    }
    return {durationInFrames: timeline.durationInFrames, props: {...props, timeline}};
  };

  return {
    ...def,
    Component,
    calculateMetadata,
    fps: channel.fps,
    width: channel.width,
    height: channel.height,
  };
};

export type DefinedVideo = ReturnType<typeof defineVideo>;
