# idle-vue v3 — agent instructions

Single toolchain: Vite+ local CLI only (`./node_modules/.bin/vp`).

- `vp install` / `vp check` / `vp test` / `vp pack` / `vp dev`
- Library entries: `src/index.ts`, `src/pinia.ts` (see `pack` block in `vite.config.ts`)
- Core (`src/`) never imports `pinia` or `vuex`; pinia only in `src/pinia.ts`
- Deps: `idle-js` (file:../idle-js locally, `^2.0.0` on publish), peer `vue@^3`
- No packed components/assets; overlay lives in `examples/vue3-overlay/` only
