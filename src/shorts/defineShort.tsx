import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import type {CalculateMetadataFunction} from 'remotion';
import channel from '../shared/channel.json';
import {BrollTrack} from '../shared/broll/BrollTrack';
import {buildShots, loadBrollManifest} from '../shared/broll/timeline';
import type {TimedShot} from '../shared/broll/types';
import type {DefinedVideo} from '../shared/defineVideo';
import {useFonts} from '../shared/fonts';
import {displayToSpoken, parseNarration} from '../shared/narration/parse';
import {buildTimeline, loadManifest} from '../shared/narration/timeline';
import {SceneContext} from '../shared/SceneContext';
import {theme} from '../shared/theme';
import {Thumbnail} from '../thumbnails/Thumbnail';
import {thumbnails} from '../thumbnails/list';
import {Captions, EndCard, Header} from './parts';

/**
 * Một đoạn cắt từ giọng đọc của tập dài. `from`/`to` = mốc {key} trong narration.json hoặc số giây
 * tính từ đầu file audio của cảnh. Bỏ trống = từ đầu / tới hết cảnh.
 * `Visual` dùng được Reveal/Window/useAt như trong tập dài — mốc được quy về đầu đoạn cắt.
 */
export type Clip = {scene: string; from?: string | number; to?: string | number; Visual?: React.FC};

export type ShortDef = {
  /** Chữ cái của Short trong tập: a, b, c… → id composition "short-<slug>-a". */
  key: string;
  video: DefinedVideo;
  /** Câu hook 2 dòng cố định ở đầu khung; dòng 2 tô vàng. */
  title: [string, string];
  clips: Clip[];
  /** Dòng nguồn nhỏ dưới tiêu đề. */
  source: string;
  /** Màn kết dẫn về video dài (gắn "Related video" khi đăng). */
  end: {line: string};
};

type ShortClip = {
  scene: string;
  from: number;
  duration: number;
  audioSrc: string;
  trimBefore: number;
  markers: Record<string, number>;
  shots: TimedShot[];
  shotOffset: number;
};

export type ShortTimeline = {
  clips: ShortClip[];
  captions: {text: string; from: number; to: number}[];
  endFrom: number;
  durationInFrames: number;
};

type ShortProps = {timeline: ShortTimeline | null};

const PAD_IN = 0.06;
const PAD_OUT = 0.22;
const GAP = 4;
const END_FRAMES = 84;
const EDGE_FADE = 3;

type Words = {words: [string, number, number][]};

/** Gắn mỗi từ có mốc thời gian với vị trí trong câu đọc (giống locate_words trong scripts/tts.py). */
const locate = (spoken: string, words: Words['words']) => {
  const low = spoken.toLowerCase();
  const out: {a: number; b: number; start: number; end: number}[] = [];
  let cursor = 0;
  for (const [text, start, end] of words) {
    const idx = low.indexOf(text.toLowerCase(), cursor);
    if (idx < 0) continue;
    out.push({a: idx, b: idx + text.length, start, end});
    cursor = idx + text.length;
  }
  return out;
};

const MAX_CHUNK_CHARS = 20;
const MAX_CHUNK_WORDS = 6;

/** Chia lời hiển thị thành cụm 2–4 từ kiểu phụ đề Shorts, kèm thời điểm bắt đầu (giây trong file audio). */
const chunkCaptions = (text: string, located: ReturnType<typeof locate>) => {
  const p = parseNarration(text);
  const timeAt = (d: number) => {
    const s = displayToSpoken(p, d);
    const w = located.find((x) => x.b > s) ?? located[located.length - 1];
    return w ? w.start : 0;
  };
  const chunks: {text: string; start: number}[] = [];
  let cur: {words: string[]; start: number} | null = null;
  const close = () => {
    if (cur) chunks.push({text: cur.words.join(' ').replace(/[.,;:]+$/, ''), start: cur.start});
    cur = null;
  };
  for (const m of p.display.matchAll(/\S+/g)) {
    const word = m[0];
    if (!cur) cur = {words: [], start: timeAt(m.index ?? 0)};
    cur.words.push(word);
    const len = cur.words.join(' ').length;
    if (/[.,?!:;]$/.test(word) || len >= MAX_CHUNK_CHARS || cur.words.length >= MAX_CHUNK_WORDS) close();
  }
  close();
  return chunks;
};

const loadWords = async (slug: string, scene: string): Promise<Words | null> => {
  try {
    const res = await fetch(staticFile(`audio/${slug}/${scene}.words.json`));
    return res.ok ? ((await res.json()) as Words) : null;
  } catch {
    return null;
  }
};

/** Nhạc nền: nhỏ khi có giọng, lớn dần ở màn kết. */
const Music: React.FC<{src: string; endFrom: number; end: number}> = ({src, endFrom, end}) => (
  <Audio
    src={staticFile(src)}
    loop
    volume={(f) => {
      const v = interpolate(f, [endFrom - 6, endFrom + 10], [0.075, 0.24], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      const fade = Math.min(1, f / 10, (end - f) / 20);
      return Math.max(0, v * fade);
    }}
  />
);

const ClipAudio: React.FC<{clip: ShortClip}> = ({clip}) => (
  <Audio
    src={staticFile(clip.audioSrc)}
    trimBefore={clip.trimBefore}
    volume={(f) => Math.min(1, f / EDGE_FADE, (clip.duration - f) / EDGE_FADE)}
  />
);

/** Tạo một Short dọc 1080×1920 từ giọng đọc + cảnh quay của tập dài (không cần tạo giọng mới). */
export const defineShort = (def: ShortDef) => {
  const slug = def.video.narration.slug;
  const id = `short-${slug}-${def.key}`;
  const thumb = thumbnails[slug]?.a;

  const Component: React.FC<ShortProps> = ({timeline}) => {
    useFonts();
    const frame = useCurrentFrame();
    if (!timeline) return null;
    const inEnd = frame >= timeline.endFrom;
    return (
      <AbsoluteFill style={{fontFamily: theme.font, color: theme.text, backgroundColor: theme.bgDeep}}>
        {timeline.clips.map((c, i) => {
          const Visual = def.clips[i].Visual;
          return (
            <Sequence key={i} from={c.from} durationInFrames={c.duration + (i + 1 < timeline.clips.length ? GAP : 0)} name={`${c.scene} ${i + 1}`}>
              <AbsoluteFill>
                <Sequence from={-c.shotOffset} layout="none">
                  <BrollTrack shots={c.shots} showMissing={false} />
                </Sequence>
              </AbsoluteFill>
              <AbsoluteFill
                style={{
                  background:
                    'linear-gradient(180deg, rgba(4,8,16,0.88) 0%, rgba(4,8,16,0.55) 22%, rgba(4,8,16,0.42) 50%, rgba(4,8,16,0.7) 72%, rgba(4,8,16,0.88) 100%)',
                }}
              />
              <SceneContext.Provider value={{id: c.scene, from: 0, duration: c.duration, leadIn: 0, audioSrc: c.audioSrc, markers: c.markers, cues: []}}>
                {Visual ? <Visual /> : null}
              </SceneContext.Provider>
              <Sequence durationInFrames={c.duration} name="giọng" layout="none">
                <ClipAudio clip={c} />
              </Sequence>
            </Sequence>
          );
        })}
        <Sequence from={timeline.endFrom} name="màn kết">
          <EndCard line={def.end.line}>{thumb ? <Thumbnail {...thumb} /> : null}</EndCard>
          <Audio src={staticFile('sound/whoosh.mp3')} volume={0.3} />
        </Sequence>
        {!inEnd && <Header title={def.title} source={def.source} />}
        <Captions captions={timeline.captions} />
        {def.video.music && <Music src={def.video.music.src} endFrom={timeline.endFrom} end={timeline.durationInFrames} />}
      </AbsoluteFill>
    );
  };

  const calculateMetadata: CalculateMetadataFunction<ShortProps> = async ({props}) => {
    const {fps} = channel;
    const manifest = await loadManifest(slug);
    if (!manifest) throw new Error(`Chưa có giọng đọc cho "${slug}" (public/audio/${slug}/manifest.json)`);
    const long = buildTimeline(def.video.narration, manifest);
    const broll = def.video.shots ? await loadBrollManifest(slug) : null;
    const shots = def.video.shots ? buildShots(slug, def.video.shots, long.scenes, broll, fps) : {};

    const clips: ShortClip[] = [];
    const captions: ShortTimeline['captions'] = [];
    let cursor = 0;
    for (const clip of def.clips) {
      const audio = manifest.scenes.find((s) => s.id === clip.scene);
      const text = def.video.narration.scenes.find((s) => s.id === clip.scene)?.text;
      const words = await loadWords(slug, clip.scene);
      if (!audio || !text || !words) throw new Error(`[${id}] Thiếu audio/lời đọc của cảnh "${clip.scene}"`);
      const p = parseNarration(text);
      const located = locate(p.spoken, words.words);
      const markerSec = (k: string) => {
        if (!(k in audio.markers)) throw new Error(`[${id}] Cảnh "${clip.scene}" không có mốc {${k}}`);
        return audio.markers[k];
      };
      const lastEnd = located.length ? located[located.length - 1].end : audio.durationSec;
      const start = Math.max(0, (clip.from === undefined ? 0 : typeof clip.from === 'number' ? clip.from : markerSec(clip.from)) - PAD_IN);
      let end: number;
      if (clip.to === undefined) end = lastEnd;
      else if (typeof clip.to === 'number') end = clip.to;
      else {
        // Kết thúc ở từ cuối cùng TRƯỚC mốc (không lấy tiếng thở/đầu từ kế tiếp)
        const pos = p.markers[clip.to];
        markerSec(clip.to);
        const before = located.filter((w) => w.b <= pos);
        end = before.length ? before[before.length - 1].end : markerSec(clip.to);
      }
      end = Math.min(audio.durationSec, end + PAD_OUT);
      const duration = Math.max(1, Math.round((end - start) * fps));
      const local = (sec: number) => Math.round((sec - start) * fps);
      const scene = long.scenes.find((s) => s.id === clip.scene);

      clips.push({
        scene: clip.scene,
        from: cursor,
        duration,
        audioSrc: `audio/${slug}/${audio.file}`,
        trimBefore: Math.round(start * fps),
        markers: Object.fromEntries(Object.entries(audio.markers).map(([k, v]) => [k, local(v)])),
        shots: shots[clip.scene] ?? [],
        shotOffset: (scene?.leadIn ?? 0) + Math.round(start * fps),
      });

      const chunks = chunkCaptions(text, located).filter((c) => c.start >= start && c.start < end - PAD_OUT);
      chunks.forEach((c, i) => {
        const next = i + 1 < chunks.length ? chunks[i + 1].start : end;
        captions.push({text: c.text, from: cursor + local(c.start), to: cursor + local(next)});
      });
      cursor += duration + GAP;
    }
    const endFrom = cursor - GAP;
    return {durationInFrames: endFrom + END_FRAMES, props: {...props, timeline: {clips, captions, endFrom, durationInFrames: endFrom + END_FRAMES}}};
  };

  return {id, slug, def, Component, calculateMetadata, fps: channel.fps, width: 1080, height: 1920};
};

export type DefinedShort = ReturnType<typeof defineShort>;
