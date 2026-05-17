# OrthoLens

## Overview

OrthoLens is a Next.js application for fracture analysis from X-ray images. Users upload a radiograph, the app proxies it to a server-side prediction route, and the UI renders the verdict, confidence metrics, class probabilities, and Grad-CAM heatmap comparison.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Framer Motion
- Lucide React
- Tailwind CSS utilities and custom CSS variables

## Local Setup

1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.local.example` to `.env.local`.
4. Set `HF_API_TOKEN` in `.env.local`.
5. Start the app with `npm run dev`.

## Vercel Deploy

1. Connect the repository to Vercel.
2. Add `HF_API_TOKEN` in Project Settings → Environment Variables.
3. Deploy using the default Next.js pipeline.

## Architecture Notes

The client never talks to the backend directly. Uploads go through `src/app/api/predict/route.ts`, which runs on the server and forwards the request with `HF_API_TOKEN` from the server environment. That proxy pattern keeps the token out of the bundled client JavaScript, lets the route enforce validation and size checks, and makes deployment simpler because Vercel only needs the environment variable configured in the dashboard.

The UI is composed from focused presentation components: `DiagnosticCard` assembles the verdict and metrics, `HeatmapViewer` handles the X-ray/Grad-CAM comparison, and the app shell provides loading, error, and 404 states.
