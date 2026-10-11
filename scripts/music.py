#!/usr/bin/env python3
"""Tổng hợp nhạc nền + hiệu ứng âm thanh bằng code (không bản quyền, dùng tự do).

    python3 scripts/music.py

Ghi vào public/sound/: nhac-nen.mp3 (vòng lặp liền mạch) và whoosh, pop, impact, ding (.mp3).
Muốn dùng nhạc khác: chép file vào public/sound/ rồi đổi tên file trong defineVideo(..., music).
"""
import os
import shutil
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/sound"
SR = 44100
rng = np.random.default_rng(7)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def tone(freq, dur, harmonics=6, rolloff=1.6, detune=0.0, phase=0.0):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(t)
    for h in range(1, harmonics + 1):
        f = freq * h * (1 + detune * (h % 2 * 2 - 1))
        if f > SR / 2.2:
            break
        out += np.sin(2 * np.pi * f * t + phase * h) / h ** rolloff
    return out


def env_adsr(n, a, r, sustain=1.0):
    e = np.full(n, sustain)
    ai, ri = int(a * SR), int(r * SR)
    e[:ai] = np.linspace(0, sustain, ai) if ai else e[:ai]
    if ri:
        e[-ri:] *= np.linspace(1, 0, ri) ** 2
    return e


def circular_reverb(x, seconds=2.6, mix=0.35):
    """Reverb bằng tích chập vòng (FFT) — đuôi reverb quấn về đầu nên vòng lặp liền mạch."""
    n = len(x)
    ir_len = int(seconds * SR)
    ir = rng.standard_normal(ir_len) * np.exp(-np.linspace(0, 7, ir_len))
    ir[: int(0.012 * SR)] = 0
    ir /= np.sqrt(np.sum(ir ** 2))
    H = np.fft.rfft(np.pad(ir, (0, n - ir_len)))
    wet = np.fft.irfft(np.fft.rfft(x) * H, n)
    return (1 - mix) * x + mix * wet / (np.max(np.abs(wet)) + 1e-9) * np.max(np.abs(x))


def highpass(x, cutoff):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (cutoff / np.maximum(f, 1e-6)) ** 4)
    return np.fft.irfft(X, len(x))


def lowpass(x, cutoff):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def music_loop():
    bpm = 80
    beat = 60 / bpm
    bar = 4 * beat
    # Am – F – C – G, mỗi hợp âm 2 ô nhịp → 8 ô, lặp 2 lần = 16 ô (~48 giây)
    prog = [(57, [57, 60, 64, 71]), (53, [53, 57, 60, 67]), (48, [55, 60, 64, 67]), (55, [55, 59, 62, 66])]
    total = int(16 * bar * SR)
    L = np.zeros(total)
    R = np.zeros(total)

    def add(sig, start, gain, pan=0.0):
        i = int(start * SR) % total
        idx = (np.arange(len(sig)) + i) % total  # quấn vòng để vòng lặp liền mạch
        np.add.at(L, idx, sig * gain * (1 - pan) ** 0.5)
        np.add.at(R, idx, sig * gain * (1 + pan) ** 0.5)

    for rep in range(2):
        for ci, (root, notes) in enumerate(prog):
            t0 = (rep * 8 + ci * 2) * bar
            dur = 2 * bar
            # Pad ấm: nhiều họa âm, hơi lệch tông giữa hai kênh, vào/ra chậm
            for k, n in enumerate(notes):
                for pan, det in ((-0.6, 0.0012), (0.6, -0.0012)):
                    s = tone(midi(n), dur + 1.2, harmonics=8, rolloff=1.9, detune=det, phase=k)
                    add(s * env_adsr(len(s), 1.4, 1.6, 1.0), t0, 0.030, pan)
            # Bass trầm
            b = tone(midi(root), dur, harmonics=4, rolloff=2.0)
            add(b * env_adsr(len(b), 0.25, 0.8), t0, 0.022)
            # Piano rải nhẹ: nốt 1/8, tắt dần
            arp = [notes[0] + 12, notes[1] + 12, notes[2] + 12, notes[3] + 12, notes[2] + 12, notes[1] + 12, notes[2] + 12, notes[3] + 12]
            for step in range(16):
                if step % 8 in (3, 7) and rng.random() < 0.5:
                    continue
                n = arp[step % 8]
                d = 1.6
                t = np.arange(int(d * SR)) / SR
                s = tone(midi(n), d, harmonics=5, rolloff=2.2) * np.exp(-t * 3.2) * (1 - np.exp(-t * 400))
                vel = 0.035 + 0.012 * rng.random()
                add(s, t0 + step * beat / 2, vel, pan=(step % 4 - 1.5) * 0.25)
    # Shaker rất nhẹ ở phách lẻ để giữ nhịp
    for b in range(16 * 4):
        sh = rng.standard_normal(int(0.08 * SR))
        sh = np.diff(sh, prepend=0) * np.exp(-np.linspace(0, 8, len(sh)))
        add(sh, b * beat + beat / 2, 0.012, pan=0.3)
    L, R = (highpass(highpass(circular_reverb(lowpass(c, 7000)), 110), 110) for c in (L, R))
    st = np.stack([L, R], 1)
    return st / np.max(np.abs(st)) * 0.7


def sfx_whoosh():
    d = 0.9
    n = int(d * SR)
    t = np.linspace(0, 1, n)
    out = np.zeros(n)
    frame = 1024
    noise = rng.standard_normal(n + frame)
    win = np.hanning(frame)
    for i in range(0, n - frame, frame // 4):
        p = i / n
        center = 250 * (14 ** np.sin(np.pi * p))  # quét lên rồi xuống
        spec = np.fft.rfft(noise[i:i + frame] * win)
        f = np.fft.rfftfreq(frame, 1 / SR)
        spec *= np.exp(-((np.log(f + 1) - np.log(center)) ** 2) / 0.5)
        out[i:i + frame] += np.fft.irfft(spec, frame) * win
    out *= np.sin(np.pi * t) ** 1.5
    return out / np.max(np.abs(out)) * 0.6


def sfx_pop():
    t = np.arange(int(0.18 * SR)) / SR
    f = 900 + 500 * np.exp(-t * 60)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 32)
    return s / np.max(np.abs(s)) * 0.45


def sfx_impact():
    t = np.arange(int(1.4 * SR)) / SR
    f = 42 + 60 * np.exp(-t * 18)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.5)
    hit = lowpass(rng.standard_normal(len(t)) * np.exp(-t * 25), 1800)
    s = boom + 0.4 * hit / np.max(np.abs(hit))
    return s / np.max(np.abs(s)) * 0.7


def sfx_ding():
    t = np.arange(int(1.6 * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * 1318.5 * r * t) * np.exp(-t * dcy) for a, r, dcy in
            ((1, 1, 3), (0.5, 2.0, 5), (0.3, 2.76, 7), (0.2, 5.4, 10)))
    return s / np.max(np.abs(s)) * 0.4


def write_mp3(name, data):
    if data.ndim == 1:
        data = np.stack([data, data], 1)
    wav = OUT / f"{name}.wav"
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(data, -1, 1) * 32767).astype("<i2").tobytes())
    ff = ["ffmpeg"] if shutil.which("ffmpeg") else (["npx.cmd" if os.name == "nt" else "npx", "remotion", "ffmpeg"])
    subprocess.run(ff + ["-y", "-v", "error", "-i", str(wav), "-c:a", "libmp3lame", "-b:a", "160k", str(OUT / f"{name}.mp3")], check=True)
    wav.unlink()
    print(f"  ✓ public/sound/{name}.mp3")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    write_mp3("nhac-nen", music_loop())
    write_mp3("whoosh", sfx_whoosh())
    write_mp3("pop", sfx_pop())
    write_mp3("impact", sfx_impact())
    write_mp3("ding", sfx_ding())


if __name__ == "__main__":
    main()
