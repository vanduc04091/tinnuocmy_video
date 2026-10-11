export const theme = {
  bg: '#0A1220',
  bgDeep: '#060B15',
  surface: 'rgba(255,255,255,0.045)',
  surfaceStrong: 'rgba(255,255,255,0.085)',
  line: 'rgba(255,255,255,0.10)',
  text: '#F3EFE6',
  muted: '#9BA8BC',
  faint: '#64728A',
  gold: '#E9B44C',
  teal: '#43C2A8',
  red: '#EF6B5E',
  blue: '#6A9CFF',
  font: '"Be Vietnam Pro", system-ui, sans-serif',
  radius: 22,
  /** Vùng an toàn: chừa trên cho logo/tổng tiền, dưới cho phụ đề. */
  safe: {x: 140, top: 150, bottom: 230},
} as const;

export type Accent = 'gold' | 'teal' | 'red' | 'blue';
export const accent = (a: Accent = 'gold') => theme[a];
