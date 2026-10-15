// Xuất ảnh tĩnh tại mọi mốc {marker} của một tập để soát bố cục (chồng chữ, tràn khung) trước khi render.
//   node scripts/tools/anh-kiem-tra.mjs <slug>            -> out/kiem-tra/<slug>/khung-*.jpg + bang-*.jpg (lưới 3×4)
//   node scripts/tools/anh-kiem-tra.mjs <slug> 1200,4500  -> chỉ các frame này
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync, readFileSync, rmSync} from 'node:fs';
import path from 'node:path';

const [slug, list] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const browserExecutable = process.argv.find((a) => a.startsWith('--browser-executable='))?.split('=')[1];
const channel = JSON.parse(readFileSync('src/shared/channel.json', 'utf8'));
const fps = channel.fps, leadIn = Math.round(channel.sceneLeadInSec * fps), tail = Math.round(channel.sceneTailSec * fps);

let frames;
if (list) frames = list.split(',').map(Number);
else {
  const man = JSON.parse(readFileSync(`public/audio/${slug}/manifest.json`, 'utf8'));
  const nar = JSON.parse(readFileSync(`src/videos/${slug}/narration.json`, 'utf8'));
  const f = (s) => Math.round(s * fps);
  const set = new Set();
  let cursor = 0;
  for (const sc of nar.scenes) {
    const a = man.scenes.find((s) => s.id === sc.id);
    if (!a) continue;
    const dur = leadIn + f(a.durationSec) + tail;
    set.add(cursor + 75);
    for (const v of Object.values(a.markers)) set.add(cursor + leadIn + f(v) + 40);
    set.add(cursor + dur - 8);
    cursor += dur;
  }
  frames = [...set].sort((x, y) => x - y);
}
const out = `out/kiem-tra/${slug}`;
rmSync(out, {recursive: true, force: true});
mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: slug, browserExecutable});
for (const frame of frames.filter((x) => x < composition.durationInFrames)) {
  await renderStill({serveUrl, composition, frame, output: `${out}/khung-${String(frame).padStart(5, '0')}.jpg`, imageFormat: 'jpeg', browserExecutable, scale: 0.3});
}
rmSync(serveUrl, {recursive: true, force: true});
console.log(`Xong ${frames.length} ảnh trong ${out} (ghép lưới: python scripts/tools/ghep-luoi.py ${out})`);
