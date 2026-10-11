/** Danh sách cảnh quay của một video (src/videos/<slug>/shots.json). */
export type ShotList = {
  scenes: Record<string, {at: string | number; offset?: number; query: string}[]>;
};

/** Kết quả do scripts/broll.py sinh ra (public/broll/<slug>/manifest.json). */
export type BrollManifest = {
  shots: Record<string, {file: string; query: string; durationSec: number; author: string}>;
};

/** Một cảnh quay đã quy ra frame, tương đối với đầu cảnh. */
export type TimedShot = {
  id: string;
  from: number;
  duration: number;
  query: string;
  src: string | null;
  clipFrames: number;
};
