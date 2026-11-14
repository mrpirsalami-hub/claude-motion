# claude-motion

Persian (RTL) motion graphics projects built with [Remotion](https://remotion.dev).

## Compositions
| ID | Size | Duration | Use |
|----|------|----------|-----|
| `AIRevolution` | 1920×1080 (16:9) | 60 s | Motion graphic «انقلاب هوش مصنوعی» (5 scenes in `src/ai/`) |
| `AIMotionReel` | 1080×1920 (9:16) | 60 s | Cinematic AI motion reel: prompt → HyperFrames/HTML → Python-generated music → future of motion |
| `Reel` | 1080×1920 (9:16) | 30 s | Instagram Reels |
| `Tutorial` | 1920×1080 (16:9) | ~10 min | YouTube tutorial |

## Setup
```bash
npm install
npm run dev
npm run render:ai-reel     # generates original BGM, then renders out/ai-motion-reel.mp4
npm run render:reel
npm run render:tutorial
npm run render:ai
```

The AI Motion Reel soundtrack is synthesized locally with Python's standard library. No stock audio, external download, API key, or paid music service is used.

## Structure
- `src/theme.ts`: Vazirmatn font, color palette, FPS
- `src/components.tsx`: shared RTL stage and spring text components
- `src/scenes/AIMotionReel.tsx`: new 60-second vertical cinematic motion composition
- `scripts/generate_bgm.py`: original 60-second stereo electronic soundtrack generator
- `src/ai/`: AI Revolution video scenes

## Notes
- Every scene should preserve RTL direction and Vazirmatn for Persian copy.
- Edit colors in one place: `colors` in `src/theme.ts`.
