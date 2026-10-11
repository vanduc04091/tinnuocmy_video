import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import type {CalculateMetadataFunction} from 'remotion';
import channel from './channel.json';
import {Background} from './components/Background';
import {BrandBug} from './components/BrandBug';
import {type BudgetItem, RunningTotal} from './components/RunningTotal';
import {Subtitles} from './components/Subtitles';
import {useFonts} from './fonts';
import {BrollTrack} from './broll/BrollTrack';
import {buildShots, loadBrollManifest} from './broll/timeline';
import type {ShotList, TimedShot} from './broll/types';
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
  /** Nhạc nền trong public/, ví dụ "sound/nhac-nen.mp3". Tự giảm âm lượng khi có giọng đọc. */
  music?: {src: string; volume?: number; duckedVolume?: number};
  /** Cảnh quay nền (shots.json). Có thì mỗi cảnh tự có lớp video nền phía sau đồ họa. */
  shots?: ShotList;
  /** Hiệu ứng âm thanh khi chuyển cảnh, ví dụ "whoosh". */
  transitionSfx?: string;
  /** Ẩn logo + ô ngân sách ở các cảnh này (vd. cảnh mở đầu toàn màn hình). */
  cleanScenes?: string[];
};

export type VideoProps = {timeline: (Timeline & {shots?: Record<string, TimedShot[]>}) | null};

const FADE = 9;

/** Nhạc nền lặp, to hơn ở khoảng nghỉ và nhỏ lại khi có giọng đọc. */
const Music: React.FC<{timeline: Timeline; music: NonNullable<VideoDef['music']>}> = ({timeline, music}) => {
  const {fps} = channel;
  const loud = music.volume ?? 0.2;
  const ducked = music.duckedVolume ?? 0.07;
  // Khoảng có giọng đọc của từng cảnh (từ câu đầu tới câu cuối)
  const speech = timeline.scenes
    .filter((s) => s.cues.length)
    .map((s) => [s.cues[0].from, s.cues[s.cues.length - 1].to]);
  const end = timeline.durationInFrames;
  return (
    <Audio
      src={staticFile(music.src)}
      loop
      volume={(f) => {
        const fadeIO = Math.min(1, f / fps, (end - f) / (2 * fps));
        // Gần đoạn có giọng (±0,4 s) thì nhỏ lại
        const near = speech.some(([a, b]) => f >= a - 0.4 * fps && f <= b + 0.4 * fps);
        const edge = speech.reduce((m, [a, b]) => Math.min(m, Math.abs(f - (a - 0.4 * fps)), Math.abs(f - (b + 0.4 * fps))), Infinity);
        const t = Math.min(1, edge / (0.35 * fps));
        const v = near ? ducked : ducked + (loud - ducked) * t;
        return Math.max(0, v * fadeIO);
      }}
    />
  );
};

const SceneFade: React.FC<{duration: number; children: React.ReactNode}> = ({duration, children}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, FADE, duration - FADE, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const HideIn: React.FC<{scenes: Timeline['scenes']; ids?: string[]; children: React.ReactNode}> = ({scenes, ids, children}) => {
  const frame = useCurrentFrame();
  const hidden = ids?.some((id) => {
    const s = scenes.find((x) => x.id === id);
    return s && frame >= s.from && frame < s.from + s.duration;
  });
  return hidden ? null : <>{children}</>;
};

/** Tạo component + calculateMetadata cho một video dựng từ narration.json. */
export const defineVideo = (def: VideoDef) => {
  const Component: React.FC<VideoProps> = ({timeline}) => {
    useFonts();
    if (!timeline) return null;
    return (
      <AbsoluteFill style={{fontFamily: theme.font, color: theme.text}}>
        <Background />
        {timeline.scenes.map((s, i) => {
          const Visual = def.scenes[s.id];
          const shots = timeline.shots?.[s.id];
          return (
            <Sequence key={s.id} from={s.from} durationInFrames={s.duration} name={s.id}>
              <SceneContext.Provider value={s}>
                <SceneFade duration={s.duration}>
                  {shots && shots.length > 0 && <BrollTrack shots={shots} />}
                  {Visual ? <Visual /> : null}
                </SceneFade>
              </SceneContext.Provider>
              {def.transitionSfx && i > 0 && (
                <Sequence from={0} durationInFrames={30} name="chuyển cảnh" layout="none">
                  <Audio src={staticFile(`sound/${def.transitionSfx}.mp3`)} volume={0.32} />
                </Sequence>
              )}
              {s.audioSrc && (
                <Sequence from={s.leadIn} name={`giọng: ${s.id}`}>
                  <Audio src={staticFile(s.audioSrc)} />
                </Sequence>
              )}
            </Sequence>
          );
        })}
        <HideIn scenes={timeline.scenes} ids={def.cleanScenes}>
          <BrandBug />
        </HideIn>
        {def.budget && <RunningTotal scenes={timeline.scenes} items={def.budget} />}
        <Subtitles scenes={timeline.scenes} />
        {def.music && <Music timeline={timeline} music={def.music} />}
      </AbsoluteFill>
    );
  };

  const calculateMetadata: CalculateMetadataFunction<VideoProps> = async ({props}) => {
    const manifest = await loadManifest(def.narration.slug);
    const base = buildTimeline(def.narration, manifest);
    const broll = def.shots ? await loadBrollManifest(def.narration.slug) : null;
    const timeline = def.shots
      ? {...base, shots: buildShots(def.narration.slug, def.shots, base.scenes, broll, channel.fps)}
      : base;
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
