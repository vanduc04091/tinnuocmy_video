// Chạy script Python bằng lệnh có sẵn trên máy (python3 / python / py) — dùng được cả Windows, macOS, Linux.
import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2);
for (const cmd of ['python3', 'python', 'py']) {
  const probe = spawnSync(cmd, ['--version'], {stdio: 'ignore', shell: process.platform === 'win32'});
  if (probe.status !== 0) continue;
  const res = spawnSync(cmd, args, {stdio: 'inherit', shell: process.platform === 'win32'});
  process.exit(res.status ?? 1);
}
console.error('Không tìm thấy Python. Cài tại https://www.python.org rồi chạy: pip install edge-tts');
process.exit(1);
