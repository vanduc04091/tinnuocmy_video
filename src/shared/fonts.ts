import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/be-vietnam-pro/800.css';
import {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';

const WEIGHTS = [400, 500, 600, 700, 800];
const SAMPLE = 'Sống ở Mỹ một tháng hết bao nhiêu tiền? $1.518 ếạữ';

/** Chặn render cho tới khi font tiếng Việt đã tải xong (tránh khung hình đầu bị sai font). */
export const useFonts = () => {
  const [handle] = useState(() => delayRender('Tải font Be Vietnam Pro'));
  useEffect(() => {
    Promise.all(WEIGHTS.map((w) => document.fonts.load(`${w} 40px "Be Vietnam Pro"`, SAMPLE)))
      .catch((err) => console.warn('Không tải được font', err))
      .finally(() => continueRender(handle));
  }, [handle]);
};
