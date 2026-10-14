import {AbsoluteFill, Img, staticFile} from 'remotion';
import {useFonts} from '../shared/fonts';
import {type Accent, accent, theme} from '../shared/theme';

/**
 * Ảnh thumbnail YouTube 1280×720. Ba kiểu bố cục:
 *  - "so":  một con số thật lớn + một dòng giải thích (kiểu dễ bấm nhất cho kênh số liệu)
 *  - "hoi": câu hỏi hai dòng, dòng sau nằm trên khối màu
 *  - "vs":  hai nửa ảnh so sánh, chữ VS ở giữa
 * Quy tắc: tối đa ~6 chữ, chữ to đọc được trên điện thoại, góc dưới phải để trống (YouTube đè thời lượng).
 */
export type ThumbSo = {kind: 'so'; bg: string; kicker: string; big: string; unit?: string; line: string; badge?: string; color?: Accent; side?: 'left' | 'right'};
export type ThumbHoi = {kind: 'hoi'; bg: string; top: string; hi: string; badge?: string; color?: Accent};
export type ThumbVs = {kind: 'vs'; left: {bg: string; name: string; value?: string; color?: Accent}; right: {bg: string; name: string; value?: string; color?: Accent}; bottom: string};
export type ThumbProps = ThumbSo | ThumbHoi | ThumbVs;

const stroke = '0 6px 0 rgba(0,0,0,0.55), 0 0 40px rgba(0,0,0,0.65)';

const Bg: React.FC<{src: string; dim?: number; style?: React.CSSProperties}> = ({src, dim = 0.85, style}) => (
  <Img src={staticFile(`thumbs/bg/${src}.jpg`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${dim}) saturate(1.25) contrast(1.08)`, ...style}} />
);

const Brand: React.FC = () => (
  <div style={{position: 'absolute', top: 28, left: 32, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 10, background: 'rgba(6,11,21,0.82)'}}>
    <div style={{width: 6, height: 26, background: theme.gold, borderRadius: 3}} />
    <span style={{fontSize: 24, fontWeight: 800, letterSpacing: '0.08em', color: theme.text}}>TIN NƯỚC MỸ</span>
  </div>
);

const Badge: React.FC<{text: string; color?: Accent; style?: React.CSSProperties}> = ({text, color = 'red', style}) => (
  <div style={{position: 'absolute', padding: '10px 22px', borderRadius: 14, background: accent(color), color: '#0A1220', fontSize: 46, fontWeight: 800, transform: 'rotate(-3deg)', boxShadow: '0 10px 30px rgba(0,0,0,0.45)', ...style}}>{text}</div>
);

const So: React.FC<ThumbSo> = ({bg, kicker, big, unit, line, badge, color = 'gold', side = 'left'}) => {
  const left = side === 'left';
  return (
    <>
      <Bg src={bg} />
      <AbsoluteFill style={{background: `linear-gradient(${left ? 90 : 270}deg, rgba(6,11,21,0.92) 0%, rgba(6,11,21,0.75) 45%, rgba(6,11,21,0) 78%)`}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: left ? 'flex-start' : 'flex-end', padding: '0 56px', textAlign: left ? 'left' : 'right'}}>
        <div style={{fontSize: 40, fontWeight: 800, color: theme.text, letterSpacing: '0.03em', background: 'rgba(255,255,255,0.12)', padding: '6px 18px', borderRadius: 10, textShadow: stroke}}>{kicker}</div>
        <div style={{fontSize: 190, fontWeight: 800, lineHeight: 1, color: accent(color), letterSpacing: '-0.02em', textShadow: stroke, marginTop: 10, whiteSpace: 'nowrap'}}>
          {big}
          {unit && <span style={{fontSize: 80, color: theme.text}}>{unit}</span>}
        </div>
        <div style={{fontSize: 64, fontWeight: 800, color: theme.text, lineHeight: 1.1, marginTop: 14, maxWidth: 760, textShadow: stroke}}>{line}</div>
      </AbsoluteFill>
      {badge && <Badge text={badge} style={left ? {right: 48, top: 120} : {left: 48, top: 120}} />}
    </>
  );
};

const Hoi: React.FC<ThumbHoi> = ({bg, top, hi, badge, color = 'gold'}) => (
  <>
    <Bg src={bg} dim={0.75} />
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(6,11,21,0.92) 0%, rgba(6,11,21,0.55) 45%, rgba(6,11,21,0.05) 75%)'}} />
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-start', padding: '0 56px 70px'}}>
      <div style={{fontSize: 96, fontWeight: 800, color: theme.text, lineHeight: 1.05, textShadow: stroke}}>{top}</div>
      <div style={{fontSize: 104, fontWeight: 800, color: '#0A1220', background: accent(color), padding: '4px 26px 12px', borderRadius: 16, marginTop: 14, lineHeight: 1.05, maxWidth: 1160}}>{hi}</div>
    </AbsoluteFill>
    {badge && <Badge text={badge} style={{right: 48, top: 40}} />}
  </>
);

const Vs: React.FC<ThumbVs> = ({left, right, bottom}) => {
  const half = (s: ThumbVs['left'], isLeft: boolean) => (
    <div style={{position: 'absolute', top: 0, bottom: 0, width: '50%', left: isLeft ? 0 : '50%', overflow: 'hidden'}}>
      <Bg src={s.bg} dim={0.7} />
      <AbsoluteFill style={{background: `linear-gradient(0deg, rgba(6,11,21,0.85), rgba(6,11,21,0) 60%)`}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 150}}>
        <div style={{fontSize: s.name.length > 8 ? 58 : 76, fontWeight: 800, color: accent(s.color ?? (isLeft ? 'teal' : 'gold')), textShadow: stroke, textAlign: 'center', lineHeight: 1, padding: isLeft ? '0 90px 0 20px' : '0 20px 0 90px'}}>{s.name}</div>
        {s.value && <div style={{fontSize: s.value.length > 7 ? 66 : 92, fontWeight: 800, color: theme.text, textShadow: stroke, marginTop: 10, padding: isLeft ? '0 90px 0 20px' : '0 20px 0 90px'}}>{s.value}</div>}
      </AbsoluteFill>
    </div>
  );
  return (
    <>
      {half(left, true)}
      {half(right, false)}
      <div style={{position: 'absolute', left: 637, top: 0, bottom: 0, width: 6, background: theme.text, opacity: 0.9}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 150}}>
        <div style={{width: 150, height: 150, borderRadius: 75, background: theme.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 70, fontWeight: 800, color: theme.text, boxShadow: '0 10px 40px rgba(0,0,0,0.6)', border: `6px solid ${theme.text}`}}>VS</div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 44, display: 'flex', justifyContent: 'center'}}>
        <div style={{fontSize: 70, fontWeight: 800, color: '#0A1220', background: theme.gold, padding: '6px 30px 12px', borderRadius: 16}}>{bottom}</div>
      </div>
    </>
  );
};

export const Thumbnail: React.FC<ThumbProps> = (p) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: theme.bgDeep, fontFamily: theme.font, overflow: 'hidden'}}>
      {p.kind === 'so' && <So {...p} />}
      {p.kind === 'hoi' && <Hoi {...p} />}
      {p.kind === 'vs' && <Vs {...p} />}
      <Brand />
    </AbsoluteFill>
  );
};
