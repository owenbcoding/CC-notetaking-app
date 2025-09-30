# CC Note‑Taking App

A lightweight note‑taking web app built with Next.js and TypeScript. This repository currently contains the application scaffold; domain features will be iterated on here.

## Quick Start

Prerequisites: Node.js 18+ and your preferred package manager (npm, yarn, pnpm, or bun).

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

You can start editing the UI by modifying `app/page.tsx`. The page will auto‑update during development.

## Scripts

- `npm run dev`: Start the Next.js development server
- `npm run build`: Create a production build
- `npm run start`: Start the production server (after build)
- `npm run lint`: Lint the codebase

## Project Structure

- `app/`: Routes and UI (App Router). Entry page is `app/page.tsx`.
- `public/`: Static assets served at the root path.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript

## Deployment

You can deploy to any platform that supports Node.js. For a streamlined experience, see the Next.js deployment guide: https://nextjs.org/docs/app/building-your-application/deploying

---

If you have ideas or run into issues, feel free to open an issue or PR.
