# BOUNCE DEPT. — Spring Bounce Logo

A Lottie/Skottie animation of the **BOUNCE DEPT.** wordmark, built with the
`text-to-lottie` skill for the local Skia Skottie player.

![preview](../../../preview/bounce-dept.gif)

## Motion beats (60 fps, 372 frames ≈ 6.2s)

1. **Spring pulse ×4** — logo springs small→big four times in place, each pop
   with an elastic overshoot.
2. **Shrink + tumble roll** — logo shrinks small, then bounces along the floor
   to the left (squash on ground contact, stretch at apex) while spinning.
3. **Roll back + elastic land** — rolls back to center, growing to full size and
   landing with a squash-and-settle overshoot.
4. **Settle pop** — a small secondary grow as it locks up.
5. **Cat peek** — a cat pops its face out above the **B** with a bouncy
   overshoot, then ducks back in.

All hero motion (position, scale, rotation) is **physics-baked per frame** with
easing/bounce/squash functions in the generator, so playback reads naturally
rather than stepping between sparse keyframes.

## Files

- `scene-1/lottie.json` — the animation (1920×1080, transparent-safe on black).
- `scene-1/LuckiestGuy.ttf` — display font (embedded family: *Luckiest Guy*).
- `scene-1/controls.json` — exposes the `bgColor` slot in the player panel.
- `../../tools/bounce-dept.gen.cjs` — generator that rebuilds `lottie.json`.

## Preview / edit

Scaffold the official player, then drop this project under `public/projects/`:

```bash
npx degit diffusionstudio/lottie my-animation
cd my-animation
npm install
npm run dev   # open the printed URL, then /bounce-dept/scene-1
```

Rebuild the JSON after editing the generator:

```bash
node tools/bounce-dept.gen.cjs
```
