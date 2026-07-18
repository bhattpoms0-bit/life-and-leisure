# Getting started

## 1. Open this folder in VS Code
```
code luxe-voyage-project
```

## 2. Add your original Stitch HTML exports
Create `design-reference/mockups/` and drop your 6 original downloaded
`.html` files in there (home, destinations, hotels, package-detail, visa,
flights). Claude Code will use them as the exact visual reference.

## 3. Install Claude Code (if you haven't)
```
npm install -g @anthropic-ai/claude-code
```

## 4. Launch Claude Code in this folder
```
cd luxe-voyage-project
claude
```
Claude Code automatically reads `CLAUDE.md` in the project root as context —
that's the build brief. It also has `design-reference/PAGE_INVENTORY.md` and
`design-reference/design-tokens.js` available to read.

## 5. First prompt to give it
```
Read CLAUDE.md and design-reference/PAGE_INVENTORY.md, then scaffold the
Vite + React + Tailwind project and build the TopNav and Footer components
first, matching the mockups exactly. Show me before moving to the pages.
```

Then work through the "Build order" list in CLAUDE.md one step at a time —
review each step in the browser (`npm run dev`) before telling it to continue,
rather than asking it to build all 6 pages in one shot. You'll get far more
accurate results and it's easier to redirect early.

## Files in this folder
- `CLAUDE.md` — the build brief Claude Code will read automatically
- `design-reference/design-tokens.js` — exact color/spacing/type tokens, ready to paste into tailwind.config.js
- `design-reference/PAGE_INVENTORY.md` — what's on each of the 6 pages + shared components
- `design-reference/mockups/` — (you add these) your original Stitch HTML files
