# Kitaabghar

**Kitaabghar** ("book house" in Hindi/Urdu) is a personal reading tracker for
people who want a Goodreads-style shelf without the social network, ads, or
account sign-up. Track what you're reading, rate and review finished books,
keep a shelf of what's next, and get a Spotify-Wrapped-style recap of your
reading year — all running entirely in your browser, with your data staying
on your device.

## Features

- **Home dashboard** — see what you're currently reading, your daily reading
  streak, and progress toward your yearly reading goal at a glance.
- **Library views** — browse your books as a card grid or as a visual
  bookshelf, with search and filters by status and genre.
- **Reading status workflow** — move books through Want to Read → Reading →
  Paused/Read with one click, and log dates automatically.
- **Ratings & notes** — rate finished books out of five stars and keep notes
  per book.
- **Reading goals & streaks** — set an annual book goal and track a running
  daily activity streak.
- **Achievements** — unlock badges for milestones like your first finished
  book, genre variety, and reading streaks.
- **Wrapped** — an end-of-year style recap: total books, pages read, top
  rated book, longest book, fastest finish, and a genre breakdown.
- **Import / export** — bulk import books from a JSON file (schema in
  `src/data/importSchema.ts`) and export your library as JSON.
- **Local-first** — no backend, no accounts. Everything is stored in your
  browser's `localStorage`.

## Screenshots

| Home | Library (Shelf view) |
| --- | --- |
| ![Home dashboard](.github/screenshots/home.png) | ![Bookshelf view](.github/screenshots/library-shelf.png) |

| Library (Card view) | Wrapped |
| --- | --- |
| ![Library card grid](.github/screenshots/library-cards.png) | ![Year in review](.github/screenshots/wrapped.png) |

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev/build tooling
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [GSAP](https://gsap.com/) and [Motion](https://motion.dev/) for animation
- [oxlint](https://oxc.rs/docs/guide/usage/linter.html) for linting
- UI built with components from [React Bits](https://reactbits.dev) and
  [Skiper UI](https://skiper-ui.com)

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173/kitaabghar/`.

### Build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the app and publishes it to GitHub Pages. Enable Pages for this
repo under **Settings → Pages → Source: GitHub Actions**.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for how
to get set up, coding conventions, and PR expectations. Please also read our
[Code of Conduct](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE)
