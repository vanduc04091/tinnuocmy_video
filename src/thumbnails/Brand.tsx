import {AbsoluteFill, Img, staticFile} from 'remotion';
import {useFonts} from '../shared/fonts';
import {theme} from '../shared/theme';

/** Ảnh đại diện kênh 800×800. YouTube cắt thành hình tròn — giữ chữ trong ~70% ở giữa. */
export const Avatar: React.FC<{variant: 'chu' | 'tuong'}> = ({variant}) => {
  useFonts();
  const photo = variant === 'tuong';
  return (
    <AbsoluteFill style={{background: theme.bgDeep, fontFamily: theme.font, alignItems: 'center', justifyContent: 'center'}}>
      {photo && (
        <>
          <Img src={staticFile('thumbs/bg/brand-statue.jpg')} style={{position: 'absolute', height: '100%', left: -260, filter: 'brightness(0.75) saturate(1.2)'}} />
          <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 62%, rgba(6,11,21,0.15) 0%, rgba(6,11,21,0.92) 70%)'}} />
        </>
      )}
      {!photo && <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, #16233B 0%, ${theme.bgDeep} 70%)`}} />}
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: photo ? 260 : 0}}>
        {!photo && <div style={{width: 120, height: 14, borderRadius: 7, background: theme.gold, marginBottom: 34}} />}
        <div style={{fontSize: photo ? 120 : 170, fontWeight: 800, color: theme.text, lineHeight: 1, letterSpacing: '0.04em'}}>TIN</div>
        <div style={{fontSize: photo ? 104 : 140, fontWeight: 800, color: theme.gold, lineHeight: 1.15, letterSpacing: '0.02em', whiteSpace: 'nowrap'}}>NƯỚC MỸ</div>
      </div>
    </AbsoluteFill>
  );
};

/** Ảnh bìa kênh 2560×1440. Vùng an toàn hiện trên mọi thiết bị: 1546×423 ở giữa. */
export const Banner: React.FC = () => {
  useFonts();
  const tiles = ['ep1-empire', 'ep9-pink', 'ep7-students', 'ep10-house', 'ep3-txflag', 'ep8-doctor', 'ep6-wheel', 'ep4-family', 'ep5-goldengate', 'ep2-cash'];
  return (
    <AbsoluteFill style={{background: theme.bgDeep, fontFamily: theme.font}}>
      <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(2, 1fr)'}}>
        {tiles.map((t) => (
          <Img key={t} src={staticFile(`thumbs/bg/${t}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55) saturate(1.1)'}} />
        ))}
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,11,21,0.55) 0%, rgba(6,11,21,0.93) 38%, rgba(6,11,21,0.93) 62%, rgba(6,11,21,0.55) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: 1546, height: 423, display: 'flex', alignItems: 'center', gap: 46}}>
          <div style={{width: 16, alignSelf: 'stretch', margin: '40px 0', borderRadius: 8, background: theme.gold}} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            <div style={{fontSize: 150, fontWeight: 800, color: theme.text, lineHeight: 1, letterSpacing: '0.02em'}}>
              TIN <span style={{color: theme.gold}}>NƯỚC MỸ</span>
            </div>
            <div style={{fontSize: 50, fontWeight: 700, color: theme.text}}>Chi phí · Thu nhập · Cuộc sống thật ở Mỹ — bằng con số</div>
            <div style={{fontSize: 38, fontWeight: 600, color: theme.teal}}>Video mới thứ Ba &amp; thứ Sáu · 20:00 giờ Houston</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Ảnh đại diện sáng: tượng Nữ thần Tự do trên trời xanh + dải vàng có tên kênh ở dưới. */
export const AvatarSang: React.FC<{img: string; x: number; y: number; scale: number}> = ({img, x, y, scale}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: '#3E8EDE', fontFamily: theme.font, overflow: 'hidden'}}>
      <Img src={staticFile(`thumbs/bg/${img}.jpg`)} style={{position: 'absolute', left: x, top: y, width: 800 * scale, filter: 'brightness(1.12) saturate(1.3) contrast(1.05)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 540, bottom: 0, background: theme.gold, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 14}}>
        <div style={{fontSize: 56, fontWeight: 800, color: '#0A1220', lineHeight: 1, letterSpacing: '0.12em'}}>TIN</div>
        <div style={{fontSize: 104, fontWeight: 800, color: '#0A1220', lineHeight: 1.05, whiteSpace: 'nowrap'}}>NƯỚC MỸ</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 530, height: 10, background: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};
