// Render một video ra thư mục out/ (không đưa lên GitHub).
//   npm run render -- song-o-my-1-thang            -> out/song-o-my-1-thang.mp4
//   npm run render -- song-o-my-1-thang --no-audio -> cho phép render khi chưa tạo giọng
// Các tham số khác được chuyển thẳng cho `remotion render` (vd: --scale=0.5, --frames=0-300).
import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';

const [slug, ...rest] = process.argv.slice(2);
if (!slug) {
  console.error('Cách dùng: npm run render -- <slug> [--no-audio] [tham số remotion...]');
  process.exit(1);
}
const allowNoAudio = rest.includes('--no-audio');
const passthrough = rest.filter((a) => a !== '--no-audio');

if (!existsSync(`public/audio/${slug}/manifest.json`) && !allowNoAudio) {
  console.error(`Chưa có giọng đọc cho "${slug}". Chạy trước:  npm run tts -- ${slug}`);
  console.error('(hoặc thêm --no-audio để render bản xem thử không tiếng)');
  process.exit(1);
}

mkdirSync('out', {recursive: true});
const output = passthrough.find((a) => !a.startsWith('-')) ?? `out/${slug}${allowNoAudio ? '-khong-tieng' : ''}.mp4`;
const args = ['remotion', 'render', 'src/index.ts', slug, output, ...passthrough.filter((a) => a !== output)];
console.log('>', 'npx', args.join(' '));
const res = spawnSync('npx', args, {stdio: 'inherit', shell: process.platform === 'win32'});
if (res.status === 0) console.log(`\nĐã lưu: ${output}`);
process.exit(res.status ?? 1);
