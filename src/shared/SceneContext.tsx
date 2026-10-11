import {createContext, useContext} from 'react';
import type {TimedScene} from './narration/types';

export const SceneContext = createContext<TimedScene | null>(null);

/** Thời điểm xuất hiện: tên mốc {key} trong lời đọc, hoặc số giây tính từ đầu cảnh. */
export type At = string | number | undefined;

export const useScene = () => {
  const scene = useContext(SceneContext);
  if (!scene) throw new Error('useScene() phải nằm trong một cảnh');
  return scene;
};

/** Quy At ra frame (tương đối với đầu cảnh). */
export const useAt = () => {
  const scene = useScene();
  return (at: At, fps = 30) => {
    if (at === undefined) return 0;
    if (typeof at === 'number') return Math.round(at * fps);
    const frame = scene.markers[at];
    if (frame === undefined) {
      console.warn(`Cảnh "${scene.id}" không có mốc {${at}}`);
      return 0;
    }
    return frame;
  };
};
