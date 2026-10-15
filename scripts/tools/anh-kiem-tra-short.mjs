// Xuất ảnh tĩnh của một Short (mỗi ~1,5 giây + mỗi lần đổi phụ đề lớn) để soát bố cục trước khi render.
//   node scripts/tools/anh-kiem-tra-short.mjs short-song-o-my-phong-su-a   -> out/kiem-tra/<id>/khung-*.jpg
// Ghép lưới để xem nhanh: python scripts/tools/ghep-luoi.py out/kiem-tra/<id>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync, rmSync} from 'node:fs';
import path from 'node:path';

const [id, step = '45'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!id) {
  console.error('Cách dùng: node scripts/tools/anh-kiem-tra-short.mjs <short-id> [bước-frame]');
  process.exit(1);
}
const out = `out/kiem-tra/${id}`;
rmSync(out, {recursive: true, force: true});
mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id});
const frames = [];
for (let f = 20; f < composition.durationInFrames; f += Number(step)) frames.push(f);
frames.push(composition.durationInFrames - 5);
for (const frame of frames) {
  await renderStill({serveUrl, composition, frame, output: `${out}/khung-${String(frame).padStart(5, '0')}.jpg`, imageFormat: 'jpeg', scale: 0.4});
}
console.log(`${frames.length} ảnh -> ${out} (tổng ${(composition.durationInFrames / 30).toFixed(1)} giây)`);
