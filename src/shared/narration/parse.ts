// Bản TypeScript của parse()/split_cues() trong scripts/tts.py.
// Chỉ dùng khi chưa có audio, để ước lượng thời gian và xem trước video.

const TOKEN = /\[([^|\]]+)\|([^\]]+)\]|\{(\w+)\}/g;
const MAX_CUE_CHARS = 86;

export type Parsed = {
  display: string;
  spoken: string;
  /** [d0, d1, s0, s1] */
  segments: [number, number, number, number][];
  markers: Record<string, number>; // vị trí trong spoken
};

export const parseNarration = (text: string): Parsed => {
  let display = '';
  let spoken = '';
  const segments: Parsed['segments'] = [];
  const markers: Parsed['markers'] = {};
  const push = (d: string, s: string) => {
    segments.push([display.length, display.length + d.length, spoken.length, spoken.length + s.length]);
    display += d;
    spoken += s;
  };
  let pos = 0;
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > pos) push(text.slice(pos, at), text.slice(pos, at));
    if (m[3]) markers[m[3]] = spoken.length;
    else push(m[1], m[2]);
    pos = at + m[0].length;
  }
  if (pos < text.length) push(text.slice(pos), text.slice(pos));
  return {display, spoken, segments, markers};
};

export const displayToSpoken = (p: Parsed, d: number, end = false) => {
  for (const [d0, d1, s0, s1] of p.segments) {
    if ((d >= d0 && d < d1) || (end && d === d1)) {
      if (d1 - d0 === s1 - s0) return s0 + (d - d0);
      return end ? s1 : s0;
    }
  }
  return p.spoken.length;
};

const trimmed = (t: string, a: number, b: number): [number, number][] => {
  while (a < b && t[a] === ' ') a++;
  while (b > a && t[b - 1] === ' ') b--;
  return a < b ? [[a, b]] : [];
};

const splitLong = (t: string, a: number, b: number): [number, number][] => {
  if (b - a <= MAX_CUE_CHARS) return [[a, b]];
  const mid = (a + b) / 2;
  let cuts: number[] = [];
  for (let i = a + 14; i < b - 14; i++) if (',:;'.includes(t[i]) && t[i + 1] === ' ') cuts.push(i + 1);
  if (!cuts.length) for (let i = a + 14; i < b - 14; i++) if (t[i] === ' ') cuts.push(i);
  if (!cuts.length) return [[a, b]];
  const cut = cuts.reduce((x, y) => (Math.abs(y - mid) < Math.abs(x - mid) ? y : x));
  return [...trimmed(t, a, cut), ...trimmed(t, cut, b)].flatMap(([x, y]) => splitLong(t, x, y));
};

export const splitCues = (display: string): [number, number][] => {
  const out: [number, number][] = [];
  let a = 0;
  for (const m of display.matchAll(/[.?!]+(?=\s|$)/g)) {
    const end = (m.index ?? 0) + m[0].length;
    out.push(...trimmed(display, a, end));
    a = end;
  }
  out.push(...trimmed(display, a, display.length));
  return out.flatMap(([x, y]) => splitLong(display, x, y));
};
