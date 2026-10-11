import {geoAlbersUsa, geoPath} from 'd3-geo';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {feature} from 'topojson-client';
import type {GeometryCollection, Topology} from 'topojson-specification';
import states from 'us-atlas/states-albers-10m.json';
import {type At, useAt} from '../SceneContext';
import {type Accent, accent, theme} from '../theme';

// File us-atlas đã chiếu sẵn theo Albers USA, khung 975×610
const topo = states as unknown as Topology<{states: GeometryCollection<{name: string}>}>;
const shapes = feature(topo, topo.objects.states).features;
const path = geoPath();
const projection = geoAlbersUsa().scale(1300).translate([487.5, 305]);

export type MapHighlight = {at: At; stateId: string; color: Accent; label?: string};
export type MapCity = {at: At; name: string; lon: number; lat: number; color?: Accent};

/** Bản đồ nước Mỹ: tô sáng tiểu bang và chấm thành phố theo mốc lời đọc. */
export const UsMap: React.FC<{
  highlights?: MapHighlight[];
  cities?: MapCity[];
  width?: number;
  style?: React.CSSProperties;
}> = ({highlights = [], cities = [], width = 1100, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const atf = useAt();
  const intro = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const lit = (h: {at: At}) => interpolate(frame, [atf(h.at, fps), atf(h.at, fps) + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <svg viewBox="0 0 975 610" width={width} style={{opacity: intro, overflow: 'visible', ...style}}>
      {shapes.map((s) => {
        const h = highlights.find((x) => x.stateId === s.id);
        const p = h ? lit(h) : 0;
        const c = h ? accent(h.color) : theme.text;
        return (
          <path
            key={String(s.id)}
            d={path(s) ?? ''}
            fill={h ? c : 'rgba(255,255,255,0.08)'}
            fillOpacity={h ? 0.12 + 0.6 * p : 1}
            stroke={h && p > 0 ? c : 'rgba(255,255,255,0.28)'}
            strokeWidth={h ? 0.6 + 1.6 * p : 0.6}
          />
        );
      })}
      {cities.map((c) => {
        const xy = projection([c.lon, c.lat]);
        if (!xy) return null;
        const p = lit(c);
        const pulse = (frame % 45) / 45;
        const col = accent(c.color ?? 'gold');
        return (
          <g key={c.name} opacity={p} transform={`translate(${xy[0]} ${xy[1]})`}>
            <circle r={6 + 22 * pulse} fill="none" stroke={col} strokeWidth={2} opacity={1 - pulse} />
            <circle r={7} fill={col} stroke="#0A1220" strokeWidth={2} />
            <text x={14} y={-12} fill={theme.text} fontSize={26} fontWeight={800} style={{paintOrder: 'stroke', stroke: '#0A1220', strokeWidth: 6}}>
              {c.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
