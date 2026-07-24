# Pull Request: feat/pwa-scaffold → main

This PR adds a complete Progressive Web App for scoring the Locker card game (7♥). It includes all requested features: 2–6 players, per-round winner (0 points + star), Locker (7♥) handling, card picker, running totals, round history, undo/edit rounds, local save/continue, statistics, and a black & gold iPhone-friendly theme.

Summary of changes
- New React + Vite + TypeScript app scaffold
- Tailwind CSS theme with black & gold tokens
- Service worker and manifest for PWA
- Screens: Splash, Home, New Game, Player Setup, Scoreboard, Card Calculator (card picker), Round History (edit), Statistics, Settings
- Game logic in src/lib/game.ts (rounds, scoring, Locker handling, undo/edit)
- Local persistence via localStorage (src/lib/storage.ts)

Testing
- npm install && npm run dev
- Create a game and exercise round flow, including playing 7♥ and verifying the Locker behavior.

Notes
- Placeholder icons were included in public/icons — replace with your artwork if desired.
- localStorage is used for simplicity; migrating to IndexedDB is recommended for large datasets.

