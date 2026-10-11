import type {LucideIcon} from 'lucide-react';
import {AbsoluteFill} from 'remotion';
import {type At} from '../SceneContext';
import {AnimatedNumber} from '../components/AnimatedNumber';
import {Reveal} from '../components/Reveal';
import {SceneHeader} from '../components/SceneParts';
import {usd} from '../format';
import {theme} from '../theme';

export type ReceiptRow = {at: At; icon?: LucideIcon; label: string; value: number};

/** Hóa đơn tổng: từng dòng hiện ra, cuối cùng là tổng. Bên phải là phần diễn giải. */
export const ReceiptLayout: React.FC<{
  kicker: string;
  title: string;
  rows: ReceiptRow[];
  total: {at: At; label: string};
  aside?: React.ReactNode;
}> = ({kicker, title, rows, total, aside}) => {
  const sum = rows.reduce((s, r) => s + r.value, 0);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          inset: `${theme.safe.top - 10}px ${theme.safe.x}px ${theme.safe.bottom}px`,
          display: 'flex',
          gap: 56,
        }}
      >
        <div style={{flex: '0 0 900px', display: 'flex', flexDirection: 'column', gap: 22}}>
          <SceneHeader kicker={kicker} title={title} />
          <div
            style={{
              background: '#F4EFE4',
              color: '#1B2333',
              borderRadius: 20,
              padding: '18px 46px 20px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
            }}
          >
            {rows.map((r) => {
              const Icon = r.icon;
              return (
                <Reveal key={r.label} at={r.at} y={10}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      fontSize: 32,
                      padding: '7px 0',
                      borderBottom: '2px dashed rgba(27,35,51,0.16)',
                    }}
                  >
                    {Icon && <Icon size={32} color="#7A6A45" strokeWidth={2.1} />}
                    <span style={{fontWeight: 600}}>{r.label}</span>
                    <span style={{flex: 1}} />
                    <span style={{fontWeight: 800, fontVariantNumeric: 'tabular-nums'}}>{usd(r.value)}</span>
                  </div>
                </Reveal>
              );
            })}
            <Reveal at={total.at} y={10}>
              <div style={{display: 'flex', alignItems: 'baseline', paddingTop: 10}}>
                <span style={{fontSize: 34, fontWeight: 800, letterSpacing: '0.12em'}}>{total.label.toUpperCase()}</span>
                <span style={{flex: 1}} />
                <span style={{fontSize: 68, fontWeight: 800, color: '#A8741A'}}>
                  <AnimatedNumber value={sum} at={total.at} frames={40} />
                </span>
              </div>
            </Reveal>
          </div>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32}}>{aside}</div>
      </div>
    </AbsoluteFill>
  );
};
