import {staticFile} from 'remotion';
import channel from '../channel.json';
import {displayToSpoken, parseNarration, splitCues} from './parse';
import type {Manifest, Narration, TimedScene, Timeline} from './types';

/** Tốc độ đọc ước lượng (ký tự lời đọc / giây) khi chưa có audio. */
const EST_CHARS_PER_SEC = 14.5;

export const loadManifest = async (slug: string): Promise<Manifest | null> => {
  try {
    const res = await fetch(staticFile(`audio/${slug}/manifest.json`));
    if (!res.ok) return null;
    return (await res.json()) as Manifest;
  } catch {
    return null;
  }
};

const estimate = (text: string): Manifest['scenes'][number] => {
  const p = parseNarration(text);
  const total = p.spoken.length / EST_CHARS_PER_SEC;
  const t = (s: number) => (total * s) / Math.max(p.spoken.length, 1);
  return {
    id: '',
    file: '',
    durationSec: total,
    cues: splitCues(p.display).map(([a, b]) => ({
      text: p.display.slice(a, b),
      start: t(displayToSpoken(p, a)),
      end: t(displayToSpoken(p, b, true)),
    })),
    markers: Object.fromEntries(Object.entries(p.markers).map(([k, s]) => [k, t(s)])),
  };
};

/**
 * Ghép lời đọc + audio thành dòng thời gian (frame).
 * Cảnh nào chưa có audio thì ước lượng theo độ dài chữ, để vẫn xem trước được trong Studio.
 */
export const buildTimeline = (narration: Narration, manifest: Manifest | null): Timeline => {
  const {fps, sceneLeadInSec, sceneTailSec} = channel;
  const leadIn = Math.round(sceneLeadInSec * fps);
  const tail = Math.round(sceneTailSec * fps);
  let cursor = 0;
  let hasAudio = false;

  const scenes: TimedScene[] = narration.scenes.map((scene) => {
    const audio = manifest?.scenes.find((s) => s.id === scene.id);
    const data = audio ?? estimate(scene.text);
    if (audio) hasAudio = true;
    const f = (sec: number) => Math.round(sec * fps);
    const duration = leadIn + f(data.durationSec) + tail;
    const timed: TimedScene = {
      id: scene.id,
      from: cursor,
      duration,
      leadIn,
      audioSrc: audio ? `audio/${narration.slug}/${audio.file}` : null,
      markers: Object.fromEntries(Object.entries(data.markers).map(([k, v]) => [k, leadIn + f(v)])),
      cues: data.cues.map((c) => ({text: c.text, from: cursor + leadIn + f(c.start), to: cursor + leadIn + f(c.end)})),
    };
    cursor += duration;
    return timed;
  });

  return {scenes, durationInFrames: Math.max(cursor, 1), hasAudio};
};
