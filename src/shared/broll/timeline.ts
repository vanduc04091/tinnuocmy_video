import {staticFile} from 'remotion';
import type {TimedScene} from '../narration/types';
import type {BrollManifest, ShotList, TimedShot} from './types';

export const loadBrollManifest = async (slug: string): Promise<BrollManifest | null> => {
  try {
    const res = await fetch(staticFile(`broll/${slug}/manifest.json`));
    return res.ok ? ((await res.json()) as BrollManifest) : null;
  } catch {
    return null;
  }
};

/** Quy danh sách cảnh quay ra frame theo mốc lời đọc của từng cảnh. */
export const buildShots = (
  slug: string,
  shots: ShotList,
  scenes: TimedScene[],
  manifest: BrollManifest | null,
  fps: number,
): Record<string, TimedShot[]> =>
  Object.fromEntries(
    scenes.map((scene) => {
      const items = shots.scenes[scene.id] ?? [];
      const starts = items.map((it) => {
        const base = typeof it.at === 'number' ? Math.round(it.at * fps) : (scene.markers[it.at] ?? 0);
        return Math.max(0, base + Math.round((it.offset ?? 0) * fps));
      });
      starts[0] = 0;
      const timed = items.map((it, i): TimedShot => {
        const id = `${scene.id}-${i}`;
        const entry = manifest?.shots[id];
        const end = i + 1 < items.length ? starts[i + 1] : scene.duration;
        return {
          id,
          from: starts[i],
          duration: Math.max(1, end - starts[i]),
          query: it.query,
          src: entry ? `broll/${slug}/${entry.file}` : null,
          clipFrames: entry ? Math.floor(entry.durationSec * fps) : 0,
        };
      });
      return [scene.id, timed];
    }),
  );
