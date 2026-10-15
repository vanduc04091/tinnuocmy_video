// In mốc thời gian bắt đầu từng cảnh (dùng làm chương trong mô tả YouTube). Chạy sau `npm run tts`.
//   node scripts/tools/moc-chuong.mjs <slug>
import {readFileSync} from 'node:fs';
const slug = process.argv[2];
const ch = JSON.parse(readFileSync('src/shared/channel.json', 'utf8'));
const fps = ch.fps, leadIn = Math.round(ch.sceneLeadInSec * fps), tail = Math.round(ch.sceneTailSec * fps);
const man = JSON.parse(readFileSync(`public/audio/${slug}/manifest.json`, 'utf8'));
const nar = JSON.parse(readFileSync(`src/videos/${slug}/narration.json`, 'utf8'));
let cursor = 0;
for (const sc of nar.scenes) {
  const a = man.scenes.find((s) => s.id === sc.id);
  const sec = Math.floor(cursor / fps);
  console.log(`${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')} ${sc.id}`);
  if (a) cursor += leadIn + Math.round(a.durationSec * fps) + tail;
}
console.log(`Tổng: ${(cursor / fps).toFixed(1)} giây`);
