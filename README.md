# Mirza Explains

An interactive, scrollytelling web app that turns the research paper
**"Beyond Euclidean Attention: Information-Geometric Deep Learning for
Automated Bone Health Classification from Knee Radiographs"** into a
premium, explorable product experience — built with Next.js, TypeScript,
Tailwind CSS, Framer Motion, and Recharts.

## What's inside

- 12 scroll-driven sections (Introduction → Conclusion) with reveal animations
- A custom animated, clickable pipeline diagram of the IG-CNN architecture
- Interactive charts: training curves, model comparison, ablation study,
  confusion matrix, per-class radar, manifold scatter, dataset breakdown
- A live slider that recomputes the real Fisher-attention sigmoid as you drag
- Dark/light mode, fullscreen figure viewer, scroll progress rail + dot nav
- Fully responsive, keyboard-focus visible, respects `prefers-reduced-motion`

## Run it locally

You need [Node.js 18.18+](https://nodejs.org) installed.

```bash
cd mirza-explains
npm install
npm run dev
```

Open **http://localhost:3000** — that's it. Edit any file under
`app/`, `components/`, or `data/project.ts` and the page hot-reloads.

To produce an optimized production build and run it:

```bash
npm run build
npm start
```

## Project structure

```
app/
  layout.tsx        Root layout, fonts, theme bootstrap script
  page.tsx           Assembles every section in order
  globals.css        Design tokens, glassmorphism utilities
components/
  Hero.tsx           Landing hero with animated manifold grid
  Nav.tsx            Header + mobile fullscreen menu
  ProgressRail.tsx   Scroll progress bar + section dot navigation
  StageSection.tsx   Generic two-column section layout
  TechnicalDetails.tsx  Expandable "technical detail" / "source code" panels
  Figure.tsx         Fullscreen/zoom wrapper for any chart or diagram
  pipeline/PipelineDiagram.tsx   Animated architecture diagram
  charts/*           Recharts-based visualizations
data/
  project.ts         All paper content, structured and editable
```

To edit the content (copy, stats, code snippets), everything lives in
`data/project.ts` — you don't need to touch any component to change text.

## Publish it (pick one)

### Option A — Vercel (recommended, made by the Next.js team, free tier)

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com → **Add New → Project** → import the repo.
3. Leave all defaults (Vercel auto-detects Next.js) → **Deploy**.
4. You'll get a live URL like `mirza-explains.vercel.app` in ~60 seconds.
   Every future `git push` auto-deploys.

Or from the command line, without GitHub:

```bash
npm install -g vercel
vercel        # first deploy, follow the prompts
vercel --prod # promote to production URL
```

### Option B — Netlify

1. Push to GitHub.
2. Netlify → **Add new site → Import an existing project**.
3. Build command: `npm run build`, Publish directory: `.next`
   (Netlify's Next.js runtime plugin handles the rest automatically).

### Option C — Self-host anywhere (Docker / VPS)

```bash
npm run build
npm start   # serves on port 3000 — put nginx/Caddy in front for a domain + HTTPS
```

## Notes on the visuals

The training curves, confusion matrix, per-class metrics, ablation chart,
and dataset breakdown are rendered live from the numbers reported in the
paper (`data/project.ts`) rather than embedded as static images — so they're
zoomable, hoverable, and reflow responsively instead of being flat pictures.
If you'd rather show your actual exported figures (e.g. real Grad-CAM
overlays or your own training-log screenshots), drop image files into
`public/figures/` and swap the relevant chart component for an `<Image>`
inside a `<Figure>` wrapper — the fullscreen/zoom behavior is already wired
up in `components/Figure.tsx`.
