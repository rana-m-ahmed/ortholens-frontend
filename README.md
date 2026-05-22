<!-- SVG header: gradient hero matching app theme -->
<svg width="100%" height="160" viewBox="0 0 1200 160" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#0ea5a4"/>
      <stop offset="1" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="160" fill="#0f172a" rx="8"/>
  <g transform="translate(40,24)">
    <g>
      <circle cx="70" cy="60" r="44" fill="url(#g)" opacity="0.95" />
      <circle cx="70" cy="60" r="28" fill="#071133" opacity="0.12" />
      <g transform="translate(42,36)">
        <rect x="0" y="0" width="56" height="8" rx="4" fill="#fff" opacity="0.12"/>
      </g>
    </g>
    <text x="140" y="80" fill="#fff" font-size="36" font-family="Inter, Arial, sans-serif">OrthoLens — Clinical Imaging Frontend</text>
  </g>
</svg>

# OrthoLens

> A visual-first frontend for clinical imaging prediction and review. Built with Next.js, TypeScript, and Tailwind CSS — optimized for clarity, performance, and clinical workflows.

---

**Status:** Active development • **Framework:** Next.js (app router) • **Styling:** Tailwind CSS

---

## Table of contents

- Quick start
- Architecture & data flow
- Components & pages (developer map)
- Visual assets & screenshots
- Environment & configuration
- Development scripts
- Tests & quality
- Deployment (Vercel)
- Contributing, PRs, and code style
- Troubleshooting

---

## Quick start

Minimum requirements

- Node 18+ and npm (or pnpm/yarn)
- Git

Local development

```bash
git clone <your-repo-url>
cd ortholens-frontend
npm install
npm run dev
```

Open http://localhost:3000

Build and preview production

```bash
npm run build
npm run start
```

Recommended workflow

- Use feature branches named `feature/<brief-desc>`
- Run `npm run lint` and `npm run test` before opening PRs

---

## Architecture & data flow

High-level flow:

1. User uploads a scan via `DropZone` (client-side validations & preview)
2. Upload is sent to the prediction API (`/api/predict` proxy or `NEXT_PUBLIC_API_BASE/predict`)
3. API returns { probabilities, heatmap, metadata }
4. App renders `HeatmapViewer` overlayed on the source image, `ConfidenceGauge`, and `DiagnosticCard`

The frontend keeps UI logic focused on rendering and interaction; any heavy compute or model inference is performed server-side or via a remote model endpoint.

---

## Components & pages (developer map)

Key components and where to find them:

- `src/components/upload/DropZone.tsx` — upload UI, drag-and-drop and file validation
- `src/components/results/HeatmapViewer.tsx` — core canvas-based overlay rendering
- `src/components/results/ProbabilityBars.tsx` — bar UI for class probabilities
- `src/components/results/ConfidenceGauge.tsx` — circular confidence meter
- `src/components/results/DiagnosticCard.tsx` — printable diagnostic summary
- `src/components/layout/BackgroundCanvas.tsx` — subtle background visuals used across pages
- `src/components/analysis/ScanAnimation.tsx` — animated scan progress for UX polish
- Hooks: `src/hooks/usePredict.ts` (API integration), `src/hooks/useDragDrop.ts` (upload helpers)

Pages and routes

- `src/app/page.tsx` — main upload and results flow
- `src/app/api/predict/route.ts` — local API proxy that forwards to model endpoint (see `src/lib/api.ts`)
- `src/app/test/` — playground/test pages used for development

---

## Visual assets & screenshots

Add optimized screenshots or animated previews under `public/assets/` and reference them here.

Example (add image to `public/assets/preview.webp`):

![OrthoLens preview](/assets/preview.webp)

For animated previews use WebP or short, optimized GIFs. Keep file sizes small (<500KB) for README display.

---

## Environment & configuration

Create a `.env.local` in the repository root (do not commit it).

Example `.env.local`:

```
NEXT_PUBLIC_API_BASE=https://api.example.com
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_DEFAULT_COLORMAP=viridis
```

Notes

- The frontend expects prediction responses to include a `heatmap` (float32 array or base64 image), a `probabilities` object, and `confidence` as a float. See `src/lib/api.ts` for the exact contract.
- Keep secrets and internal endpoints out of the client when possible. Use server-side proxy routes to hide API keys.

---

## Development scripts

- `npm run dev` — start dev server
- `npm run build` — build production bundle
- `npm run start` — start production server after build
- `npm run lint` — run ESLint
- `npm run format` — run Prettier (if configured)
- `npm run test` — run tests (Jest/React Testing Library if present)

If a script above is missing, check `package.json` and add the corresponding tooling.

---

## Tests & quality

We use ESLint and TypeScript strict checks to keep UI code predictable. To add tests, prefer React Testing Library and small unit tests for hook logic (e.g., `usePredict`).

---

## Deployment (Vercel)

This project is configured to work with Vercel; the root `vercel.json` and Next.js setup support serverless routes. Recommended deploy steps:

1. Connect the repository to Vercel
2. Add environment variables in the Vercel dashboard (same keys as `.env.local`)
3. Set builds to use Node 18+ if applicable

Static assets and optimized images are served from `/public` by default.

---

## Contributing & PR guidelines

- One feature per PR. Keep changes small and focused.
- Include screenshots or recordings for UI changes.
- Run `npm run lint` and `npm run test` locally.
- Use conventional commits in the format `feat:`, `fix:`, `chore:`, etc.

Pull request checklist

- [ ] Title and description clearly explain the change
- [ ] All tests pass (if applicable)
- [ ] Linting completed
- [ ] Screenshots/gif attached for UI changes

---

## Troubleshooting

- If uploads fail: check CORS on the API and proxy configuration in `src/app/api/predict/route.ts`.
- If heatmaps don't render: confirm the API returns base64-encoded PNG or a numeric array matching image dimensions.
- If performance is poor: disable heavy animations in `BackgroundCanvas` and enable lower-resolution heatmaps.

---

## Design & theme tokens

The color palette and spacing are controlled in `tailwind.config.ts`. Core tokens live in `src/lib/constants.ts` — update there to change palettes globally.

---

## Example: calling prediction API (client)

```ts
// src/hooks/usePredict.ts (simplified)
async function predict(file: File) {
  const form = new FormData();
  form.append('scan', file);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/predict`, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Prediction failed');
  return res.json();
}
```

---

## License & maintainers

See `package.json` for license details. For contributor questions open an issue or contact the maintainers on the repo.

---

If you'd like, I can:

- add example screenshots to `public/assets/` and embed them in this README
- generate a small GIF demo from the app for the top of the README
- create a `CONTRIBUTING.md` with PR templates

Tell me which you'd like next.

---

Made with care — OrthoLens UI team
