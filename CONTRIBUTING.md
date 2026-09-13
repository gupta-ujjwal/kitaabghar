# Contributing to Kitaabghar

Thanks for your interest in improving Kitaabghar! This is a small, local-first
reading tracker, and contributions of any size — bug fixes, new features,
docs, design tweaks — are welcome.

## Getting started

1. Fork the repo and clone your fork.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Make your changes. The app stores all data in `localStorage`, so you can
   freely add/edit/delete books while testing without needing a backend.

## Before opening a PR

Run the checks the CI will run:

```bash
npm run lint
npm run build
```

`npm run build` runs the TypeScript compiler (`tsc -b`) followed by the Vite
build, so it will catch type errors as well as build failures.

## Making changes

- Keep PRs focused — one feature or fix per PR is easier to review than a
  bundle of unrelated changes.
- Match the existing code style (TypeScript, functional React components,
  hooks for state, Tailwind for styling). There's no separate formatter
  config beyond `oxlint`, so keep formatting consistent with surrounding
  code.
- If you add a new component, put shared/reusable UI primitives under
  `src/components/ui/`, and feature-specific components under
  `src/components/`.
- If you change how data is shaped or stored (`src/types/`, `src/hooks/`),
  double check the import/export flows (`src/utils/bookImport.ts`,
  `src/data/importSchema.ts`) still work, since existing users' `localStorage`
  data needs to keep working after an update.
- Update `README.md` if you add a user-facing feature worth mentioning.

## Reporting bugs / suggesting features

Open a GitHub issue with:

- What you expected to happen vs. what actually happened (for bugs).
- Steps to reproduce, if applicable.
- Screenshots, if it's a visual/UI issue.

## Code of Conduct

By participating in this project, you agree to abide by the
[Code of Conduct](./CODE_OF_CONDUCT.md).
