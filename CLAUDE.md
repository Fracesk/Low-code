# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Type-check with `vue-tsc -b`, then `vite build`
- `npm run preview` — Preview production build locally

## Tech Stack

- **Vue 3** (Composition API, `<script setup lang="ts">`)
- **Pinia** for state management
- **Vite** for build
- **TypeScript** (strict mode, `@/` path alias to `./src/`)
- No router, no testing framework, no linter, no CSS framework

## Architecture

Single-page low-code drag-and-drop editor. Layout: fixed 280px sidebar + flexible canvas area.

### Key Files

| File | Role |
|---|---|
| `src/main.ts` | Bootstrap — creates Vue app, installs Pinia, mounts `#app` |
| `src/App.vue` | Root layout shell (sidebar + canvas) |
| `src/components/ComponentPanel.vue` | Sidebar — draggable component palette with custom virtual scrolling (1000 items, overscan 5) |
| `src/components/Canvas.vue` | Drop target — renders components positioned by grid layout, handles selection |
| `src/stores/canvas.ts` | Pinia store — `components[]`, `selectedId`, CRUD methods (uses `shallowReactive`/`shallowRef` for perf) |
| `src/types/schema.ts` | All TS types — `ComponentSchema`, `ComponentType` (text/button/image/container/form), `LayoutInput`/`LayoutResult` |
| `src/workers/layout.worker.ts` | Web Worker — 3-column grid layout algorithm (12px gap, 120px item height) |

### Data Flow

1. **Drag** from ComponentPanel → `dataTransfer.setData('component-type', type)`
2. **Drop** on Canvas → `store.addComponent(type)`
3. **Layout** → Canvas watcher calls `requestLayout()` → sends cloned components to Web Worker (or falls back to main-thread computation on Worker failure) → receives absolute positions
4. **Select** → click sets `store.selectedId`, highlights component

### Important Implementation Notes

- **Custom virtual scrolling** in ComponentPanel.vue — computed visible range from scrollTop, renders only visible + overscan items. No library used.
- **Worker degradation path** — if the Web Worker fails to load or postMessage throws, Canvas falls back to an identical main-thread `calculateLayout()` function.
- **State must be deep-cloned before posting to Worker** — Pinia's `shallowReactive` array cannot be cloned by `postMessage`. Always `JSON.parse(JSON.stringify(store.components))` before sending.
- **Canvas watches by array length** — the watcher is `store.components.length`, so in-place prop mutations on existing items won't trigger re-layout.

### Known Issues / Gotchas

- `@/` path alias is configured in `tsconfig.app.json` but NOT in `vite.config.ts` — Vite needs `resolve.alias` added for runtime resolution.
- No `.gitignore` exists.
- No tests or linting setup exist.
