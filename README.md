# Ein Jahr mit Laura - Anniversary Website

Static anniversary website built with Next.js, TypeScript, Tailwind, and shadcn-style structure.

## Stack

- Next.js (App Router, static export)
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn-compatible paths (`components/ui`, `lib/utils`)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Replace Photos

1. Put your photos into `public/images/laura-anniversary/`.
2. Run `npm run prepare:images` once (or just restart `npm run dev` / run `npm run build`).
3. The app automatically uses **all supported files in that folder** (`jpg`, `jpeg`, `png`, `webp`, `avif`, `heic`, `heif`), including WhatsApp exports.

During prepare step, optimized WebP variants are generated into `public/images/laura-anniversary-optimized/` and a manifest is written to `content/image-manifest.json`.

## Deploy to GitHub Pages (Project Site)

1. Push this repo to GitHub.
2. In GitHub repo settings:
   - `Settings -> Pages -> Build and deployment`
   - Source: `GitHub Actions`
3. Push to `main`.
4. Workflow `.github/workflows/deploy-pages.yml` builds static files and deploys them.

The project is configured for project-page paths (`https://<user>.github.io/<repo>/`) via `next.config.ts`.

## Useful Commands

```bash
npm run prepare:images
npm run lint
npm run build
```
