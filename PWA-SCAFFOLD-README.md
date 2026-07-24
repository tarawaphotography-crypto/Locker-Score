# PWA scaffold for Locker-Score

This initial commit adds a basic Progressive Web App scaffold on branch feat/pwa-scaffold:

- public/manifest.json
- public/sw.js (basic caching strategy)
- public/index.html updated with manifest and service worker registration
- src/scoring/engine.js skeleton for the scoring engine
- src/components/ScoreEntry.jsx placeholder React component

What's next:
- Implement complete game scoring engine logic (Locker rule, Stars, card picker)
- Build full Score Entry UI
- Add icons and splash screens (black & gold theme)
- Add offline sync queue and continue-saved-game

Notes:
- I registered the branch "feat/pwa-scaffold" already; changes were pushed to that branch.
