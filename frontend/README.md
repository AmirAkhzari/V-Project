# V-Project frontend (Figma Make prototype)

**Source:** Figma Make [visitorClientSideApp](https://www.figma.com/make/xaGTCrCG6JKhhrwNRnWR48/visitorClientSideApp) (file key `xaGTCrCG6JKhhrwNRnWR48`), Version 38+ / latest with wallet top-up.

**Purpose:** Prototype frontend for V-Project — drop this folder into the repo as `frontend/` for Martin’s GitHub PR into `AmirAkhzari/V-Project`.

**Notes:**
- Currency displayed as **تومان** (wallet balance, top-up amounts, cart/checkout).
- **Demo login** (“ورود آزمایشی”) exists for non-production use only.
- Stack: React + Vite + TypeScript + Tailwind v4 (as exported from Figma Make).
- Includes Make-specific `.figma/make/` tooling used by the Make preview/dev environment.

```bash
pnpm install   # or npm install
pnpm dev       # Make vite config defaults to port 8443
```
