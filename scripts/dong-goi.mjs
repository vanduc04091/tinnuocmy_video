// Gom mỗi tập vào một thư mục riêng trong out/, sẵn sàng để đăng YouTube:
//   npm run dong-goi                    -> mọi tập đã render
//   npm run dong-goi -- chi-phi-o-to    -> chỉ tập này
//
// out/Tap-01-song-o-my-phong-su/
//   song-o-my-phong-su.mp4     video (chuyển từ out/ vào đây)
//   youtube.md                 tiêu đề, mô tả, tags, cài đặt upload — tất cả trong một file
//   thumbnail.jpg              thumbnail chính (= mẫu A)
//   thumb-test-A/B/C.jpg       3 mẫu cho "Test & Compare"
//   phu-de.vi.srt              phụ đề tiếng Việt (Subtitles → Upload file → With timing)
//   nguon-canh-quay.txt        tên tác giả cảnh quay Pixabay
//   shorts/short-a.mp4 …       Shorts dọc (npm run render -- short-<slug>-a)
//   shorts/youtube-shorts.md   tiêu đề, mô tả, lịch đăng Shorts (từ docs/youtube/shorts/tap-XX-<slug>.md)
import {copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync} from 'node:fs';

const only = process.argv.slice(2).find((a) => !a.startsWith('-'));
const channel = JSON.parse(readFileSync('src/shared/channel.json', 'utf8'));
const fps = channel.fps;
const leadIn = Math.round(channel.sceneLeadInSec * fps);
const tail = Math.round(channel.sceneTailSec * fps);

// Phụ đề: cùng cách tính thời gian với video (src/shared/narration/timeline.ts)
const srt = (slug) => {
  const man = JSON.parse(readFileSync(`public/audio/${slug}/manifest.json`, 'utf8'));
  const narration = JSON.parse(readFileSync(`src/videos/${slug}/narration.json`, 'utf8'));
  const f = (s) => Math.round(s * fps);
  const ts = (frame) => {
    const ms = Math.round((frame / fps) * 1000);
    const p = (n, w = 2) => String(n).padStart(w, '0');
    return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
  };
  let cursor = 0;
  const lines = [];
  for (const scene of narration.scenes) {
    const a = man.scenes.find((s) => s.id === scene.id);
    if (!a) continue;
    for (const c of a.cues) lines.push([cursor + leadIn + f(c.start), cursor + leadIn + f(c.end), c.text]);
    cursor += leadIn + f(a.durationSec) + tail;
  }
  return lines.map(([from, to, text], i) => `${i + 1}\n${ts(from)} --> ${ts(to)}\n${text}\n`).join('\n');
};

// Tách các phần trong docs/youtube/tap-XX-*.md
const parseDoc = (md) => {
  const section = (name) => md.split(/\n## /).find((s) => s.startsWith(name)) ?? '';
  const block = (s) => (s.match(/```\n([\s\S]*?)\n```/) ?? [])[1] ?? '';
  const titles = section('Tiêu đề').split('\n').filter((l) => /^\d+\./.test(l)).map((l) => l.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').replace(/\s*←.*$/, '').trim());
  return {titles, desc: block(section('Mô tả')), tags: block(section('Tags')), settings: section('Cài đặt').replace(/^Cài đặt[^\n]*\n/, '').replace(/\*\*/g, '').trim()};
};

let done = 0;
for (const doc of readdirSync('docs/youtube').filter((d) => /^tap-\d+/.test(d)).sort()) {
  const md = readFileSync(`docs/youtube/${doc}`, 'utf8').replace(/\r\n/g, '\n'); // Windows (CRLF) -> LF
  const slug = (md.match(/File: `out\/(.+?)\.mp4`/) ?? [])[1];
  if (!slug || (only && only !== slug)) continue;
  const num = doc.match(/^tap-(\d+)/)[1];
  const dir = `out/Tap-${num}-${slug}`;
  mkdirSync(dir, {recursive: true});

  const video = `out/${slug}.mp4`;
  if (existsSync(video) && !existsSync(`out/${slug}.raw.mp4`)) renameSync(video, `${dir}/${slug}.mp4`);
  const hasVideo = existsSync(`${dir}/${slug}.mp4`);

  const {titles, desc, tags, settings} = parseDoc(md);
  const heading = (md.match(/^# YouTube — (.+)$/m) ?? [])[1] ?? slug;
  writeFileSync(`${dir}/youtube.md`, [
    `# ${heading}`,
    '',
    `Video: \`${slug}.mp4\` · Thumbnail: \`thumbnail.jpg\` · Test & Compare: \`thumb-test-A/B/C.jpg\` · Phụ đề: \`phu-de.vi.srt\``,
    '',
    '## Tiêu đề (Title)',
    '',
    '```',
    titles[0] ?? '',
    '```',
    '',
    ...(titles.length > 1 ? ['Phương án khác:', '', ...titles.slice(1).map((t) => `- ${t}`), ''] : []),
    '## Mô tả (Description)',
    '',
    '```',
    desc,
    '```',
    '',
    '## Tags',
    '',
    '```',
    tags,
    '```',
    '',
    '## Cài đặt khi upload',
    '',
    settings,
    '',
    '## Phụ đề',
    '',
    'Subtitles → Add language: Vietnamese → Upload file → With timing → chọn `phu-de.vi.srt`.',
    '',
  ].join('\n'));
  for (const old of ['1-tieu-de.txt', '2-mo-ta.txt', '3-tags.txt', '4-cai-dat.txt']) rmSync(`${dir}/${old}`, {force: true});

  for (const v of ['a', 'b', 'c']) {
    const src = `thumbnails/${slug}-${v}.jpg`;
    if (existsSync(src)) copyFileSync(src, `${dir}/thumb-test-${v.toUpperCase()}.jpg`);
  }
  if (existsSync(`thumbnails/${slug}-a.jpg`)) copyFileSync(`thumbnails/${slug}-a.jpg`, `${dir}/thumbnail.jpg`);
  if (existsSync(`public/audio/${slug}/manifest.json`)) writeFileSync(`${dir}/phu-de.vi.srt`, srt(slug));
  if (existsSync(`public/broll/${slug}/credits.txt`)) copyFileSync(`public/broll/${slug}/credits.txt`, `${dir}/nguon-canh-quay.txt`);

  // Shorts của tập này
  const shortFiles = readdirSync('out').filter((f) => f.startsWith(`short-${slug}-`) && /-[a-z]\.mp4$/.test(f));
  const shortDoc = `docs/youtube/shorts/tap-${num}-${slug}.md`;
  if (shortFiles.length || existsSync(shortDoc)) {
    mkdirSync(`${dir}/shorts`, {recursive: true});
    for (const f of shortFiles) renameSync(`out/${f}`, `${dir}/shorts/short-${f.slice(-5)}`);
    if (existsSync(shortDoc)) copyFileSync(shortDoc, `${dir}/shorts/youtube-shorts.md`);
  }
  const nShorts = existsSync(`${dir}/shorts`) ? readdirSync(`${dir}/shorts`).filter((f) => f.endsWith('.mp4')).length : 0;

  console.log(`${hasVideo ? '✓' : '… (chưa có video — render xong chạy lại)'} ${dir}${nShorts ? ` (+${nShorts} Shorts)` : ''}`);
  done++;
}
console.log(`Xong ${done} tập.`);
