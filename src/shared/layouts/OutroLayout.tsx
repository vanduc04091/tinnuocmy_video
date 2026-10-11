import {Bell} from 'lucide-react';
import {AbsoluteFill} from 'remotion';
import {type At} from '../SceneContext';
import {Reveal} from '../components/Reveal';
import channel from '../channel.json';
import {theme} from '../theme';

/** Cảnh kết: câu chốt, câu hỏi cho phần bình luận, lời mời đăng ký kênh. */
export const OutroLayout: React.FC<{
  headline: React.ReactNode;
  caption: string;
  question: {at: At; text: string};
  subscribeAt: At;
  disclaimer?: string;
}> = ({headline, caption, question, subscribeAt, disclaimer}) => (
  <AbsoluteFill style={{alignItems: 'center'}}>
    <div
      style={{
        position: 'absolute',
        inset: `${theme.safe.top}px ${theme.safe.x}px ${theme.safe.bottom}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
      }}
    >
      <Reveal>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: 32, fontWeight: 600, color: theme.muted, letterSpacing: '0.06em'}}>{caption}</div>
          <div style={{fontSize: 176, fontWeight: 800, color: theme.gold, lineHeight: 1.05, letterSpacing: '-0.03em'}}>
            {headline}
          </div>
        </div>
      </Reveal>
      <Reveal at={question.at}>
        <div
          style={{
            fontSize: 50,
            fontWeight: 600,
            color: theme.text,
            textAlign: 'center',
            maxWidth: 1560,
            textWrap: 'balance',
            lineHeight: 1.3,
            padding: '26px 44px',
            borderRadius: 20,
            border: `1px solid ${theme.line}`,
            background: theme.surface,
          }}
        >
          “{question.text}”
        </div>
      </Reveal>
      <Reveal at={subscribeAt} scale y={0}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div
            style={{
              padding: '18px 40px',
              borderRadius: 14,
              background: theme.red,
              color: 'white',
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: '0.04em',
            }}
          >
            ĐĂNG KÝ KÊNH
          </div>
          <Bell size={44} color={theme.text} />
          <span style={{fontSize: 34, fontWeight: 700, color: theme.text}}>{channel.name}</span>
        </div>
      </Reveal>
    </div>
    {disclaimer && (
      <div style={{position: 'absolute', bottom: 26, fontSize: 19, color: theme.faint}}>{disclaimer}</div>
    )}
  </AbsoluteFill>
);
