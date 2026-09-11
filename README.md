# Virtual Library

A personal reading tracker — track books you want to read, are reading, or
have finished, with ratings, progress, and notes. All data is stored locally
in your browser (no accounts, no server).

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
app and publishes it to GitHub Pages. Enable Pages for this repo under
**Settings → Pages → Source: GitHub Actions**.
