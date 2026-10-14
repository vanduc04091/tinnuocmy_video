// Render một video ra thư mục out/ (không đưa lên GitHub).
//   npm run render -- song-o-my-1-thang            -> out/song-o-my-1-thang.mp4
//   npm run render -- song-o-my-1-thang --no-audio -> cho phép render khi chưa tạo giọng
// Các tham số khác được chuyển thẳng cho `remotion render` (vd: --scale=0.5, --frames=0-300).
// Sau khi render, âm lượng được chuẩn hóa về -14 LUFS (chuẩn YouTube) bằng ffmpeg đi kèm Remotion.
import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, renameSync, rmSync} from 'node:fs';

const [slug, ...rest] = process.argv.slice(2);
if (!slug) {
  console.error('Cách dùng: npm run render -- <slug> [--no-audio] [tham số remotion...]');
  process.exit(1);
}
const noAudio = rest.includes('--no-audio');
const passthrough = rest.filter((a) => a !== '--no-audio' && a !== '--allow-missing-broll');

if (!existsSync(`public/audio/${slug}/manifest.json`) && !noAudio) {
  console.error(`Chưa có giọng đọc cho "${slug}". Chạy trước:  npm run tts -- ${slug}`);
  console.error('(hoặc thêm --no-audio để render bản xem thử không tiếng)');
  process.exit(1);
}

// Gọi thẳng Remotion đã cài trong node_modules (không qua npx — trên Windows npx hay báo
// "could not determine executable to run" khi chưa cài đủ gói).
const cli = 'node_modules/@remotion/cli/remotion-cli.js';
if (!existsSync(cli)) {
  console.error('Chưa cài Remotion trong thư mục dự án. Chạy lệnh này ở thư mục tinnuocmy_video rồi thử lại:');
  console.error('   npm install');
  process.exit(1);
}
const run = (args) => {
  console.log('> remotion', args.join(' '));
  return spawnSync(process.execPath, [cli, ...args], {stdio: 'inherit'}).status ?? 1;
};

// Video có shots.json thì phải có đủ cảnh quay (npm run broll) trước khi render bản chính thức
const shotsPath = `src/videos/${slug}/shots.json`;
if (existsSync(shotsPath) && !rest.includes('--allow-missing-broll')) {
  const shots = JSON.parse(readFileSync(shotsPath, 'utf8')).scenes;
  const manPath = `public/broll/${slug}/manifest.json`;
  const have = existsSync(manPath) ? JSON.parse(readFileSync(manPath, 'utf8')).shots : {};
  const missing = Object.entries(shots).flatMap(([scene, items]) => items.map((_, i) => `${scene}-${i}`)).filter((id) => !have[id]);
  if (missing.length) {
    console.error(`Thiếu ${missing.length} cảnh quay nền. Chạy trước:  npm run broll -- ${slug}`);
    console.error('(hoặc thêm --allow-missing-broll để render bản nháp có ô báo thiếu cảnh)');
    process.exit(1);
  }
}

mkdirSync('out', {recursive: true});
const output = passthrough.find((a) => !a.startsWith('-')) ?? `out/${slug}${noAudio ? '-khong-tieng' : ''}.mp4`;
const raw = noAudio ? output : output.replace(/\.mp4$/, '.raw.mp4');
const status = run(['render', 'src/index.ts', slug, raw, ...passthrough.filter((a) => a !== output)]);
if (status !== 0) process.exit(status);

if (!noAudio) {
  console.log('\nChuẩn hóa âm lượng về -14 LUFS...');
  const norm = run([
    'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', raw,
    '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k',
    output,
  ]);
  if (norm === 0) rmSync(raw);
  else {
    console.warn('Không chuẩn hóa được âm lượng, giữ bản gốc.');
    renameSync(raw, output);
  }
}
console.log(`\nĐã lưu: ${output}`);
