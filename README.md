# claude-motion

Persian (RTL) motion graphics projects built with [Remotion](https://remotion.dev).

## Compositions
| ID | Size | Duration | Use |
|----|------|----------|-----|
| `AIRevolution` | 1920×1080 (16:9) | 60 s | Motion graphic «انقلاب هوش مصنوعی» (5 scenes in `src/ai/`) |
| `Reel` | 1080×1920 (9:16) | 30 s | Instagram Reels |
| `Tutorial` | 1920×1080 (16:9) | ~10 min | YouTube tutorial |

## Setup
```bash
npm install
npm run dev              # Remotion Studio
npm run render:reel      # out/reel.mp4
npm run render:tutorial  # out/tutorial.mp4
npm run render:ai        # out/ai-revolution.mp4
npm run still:reel       # quick PNG preview
```

## Structure
- `src/theme.ts`: Vazirmatn font (bundled in `public/fonts`, works offline), color palette, FPS
- `src/components.tsx`: `Stage` (RTL + font + background) and `FadeUp` (spring text animation)
- `src/ai/`: AI Revolution video. `tokens.ts` (palette, scene durations), `Scene1-5.tsx`, `AIRevolution.tsx`
- `src/scenes/`: scenes; add new ones and use them in `src/Root.tsx`

## Notes
- Every scene should be wrapped in `Stage` so direction and font stay consistent.
- Edit colors in one place: `colors` in `src/theme.ts`.
