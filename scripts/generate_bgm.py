#!/usr/bin/env python3
"""Generate an original 60-second cinematic electronic bed using Python stdlib only."""
import math
import os
import random
import struct
import wave

SR = 44100
DURATION = 60
OUT = os.path.join("public", "audio", "ai-tech-bed.wav")
random.seed(17)

def clamp(x):
    return max(-1.0, min(1.0, x))

def sample(t):
    beat = 60 / 112
    bar = int(t / (beat * 4))
    phase = (t % beat) / beat
    # Soft sub-bass pulse, ducked between beats.
    bass_env = math.exp(-phase * 5.5)
    bass_note = [55.0, 65.41, 73.42, 49.0][(bar // 2) % 4]
    bass = math.sin(2 * math.pi * bass_note * t) * bass_env * 0.17
    # Airy, evolving synth chord.
    chord = [220.0, 261.63, 329.63, 392.0][bar % 4]
    pad = sum(math.sin(2 * math.pi * chord * k * t + k * 0.4) / k for k in (1, 2, 3))
    pad *= 0.045 * (0.6 + 0.4 * math.sin(2 * math.pi * t / 13))
    # Short electronic kick and bright tick.
    kick_env = math.exp(-phase * 22)
    kick = math.sin(2 * math.pi * (48 - 15 * phase) * t) * kick_env * 0.28
    tick_env = math.exp(-((phase - 0.5) / 0.055) ** 2)
    tick = (random.random() * 2 - 1) * tick_env * 0.035
    # Transition riser every eight seconds.
    transition = (t % 8) / 8
    riser = math.sin(2 * math.pi * (300 + 900 * transition) * t) * (transition ** 3) * 0.035
    fade_in = min(1.0, t / 2)
    fade_out = min(1.0, (DURATION - t) / 3)
    return clamp((bass + pad + kick + tick + riser) * fade_in * fade_out)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with wave.open(OUT, "wb") as wav:
    wav.setnchannels(2)
    wav.setsampwidth(2)
    wav.setframerate(SR)
    frames = bytearray()
    for i in range(SR * DURATION):
        t = i / SR
        v = int(sample(t) * 32767)
        frames.extend(struct.pack("<hh", v, v))
    wav.writeframes(frames)
print(f"Created {OUT} ({DURATION}s, stereo, {SR}Hz)")
