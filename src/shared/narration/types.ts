/** Kịch bản lời đọc của một video (narration.json). */
export type Narration = {
  slug: string;
  title: string;
  voice?: string;
  rate?: string;
  scenes: {id: string; text: string}[];
};

/** Kết quả do scripts/tts.py sinh ra (public/audio/<slug>/manifest.json). Đơn vị: giây. */
export type Manifest = {
  slug: string;
  voice: string;
  scenes: {
    id: string;
    file: string;
    durationSec: number;
    cues: {text: string; start: number; end: number}[];
    markers: Record<string, number>;
  }[];
};

/** Mốc thời gian đã quy ra frame, dùng khi dựng video. */
export type TimedScene = {
  id: string;
  from: number;
  duration: number;
  leadIn: number;
  audioSrc: string | null;
  /** Mốc {key} tính bằng frame, tương đối với đầu cảnh. */
  markers: Record<string, number>;
  /** Phụ đề, frame tuyệt đối trong video. */
  cues: {text: string; from: number; to: number}[];
};

export type Timeline = {
  scenes: TimedScene[];
  durationInFrames: number;
  hasAudio: boolean;
};
