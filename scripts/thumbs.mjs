// Render ảnh thumbnail YouTube (1280×720, JPG) cho mọi tập, hoặc chỉ một tập:
//   npm run thumbs                    -> thumbnails/<slug>-a.jpg, -b.jpg, -c.jpg
//   npm run thumbs -- chi-phi-o-to    -> chỉ tập này
// Nội dung chữ sửa ở src/thumbnails/list.ts, ảnh nền ở public/thumbs/bg/.
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import {mkdirSync, rmSync} from 'node:fs';
import path from 'node:path';

const only = process.argv.slice(2).find((a) => !a.startsWith('-'));
const browserExecutable = process.argv.find((a) => a.startsWith('--browser-executable='))?.split('=')[1];
mkdirSync('thumbnails', {recursive: true});
console.log('Đang đóng gói…');
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comps = (await getCompositions(serveUrl, {browserExecutable})).filter((c) => c.id.startsWith('thumb-') && (!only || c.id.startsWith(`thumb-${only}-`)));
for (const composition of comps) {
  const output = `thumbnails/${composition.id.replace(/^thumb-/, '')}.jpg`;
  await renderStill({serveUrl, composition, output, imageFormat: 'jpeg', jpegQuality: 92, browserExecutable});
  console.log('✓', output);
}
rmSync(serveUrl, {recursive: true, force: true});
console.log(`Xong ${comps.length} ảnh trong thư mục thumbnails/`);
