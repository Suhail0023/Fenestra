# Fenestra

Fenestra Site: fenestration installation planning and monitoring web app (vanilla JS front end in `index.html`, small Python server, one SQLite database for all projects).

- `index.html`, `shell.html`, `server.py`, `docs.py`, `watch.py`, `lib.py`, `xer_detail.py`, `sw.js`, `site/`: the deployable app
- `Dockerfile`, `fly.toml`, `DEPLOY.md`, `deploy.ps1`: deployment to Fly.io (see DEPLOY.md)
- `.github/workflows/fly-deploy.yml`: every push to `main` redeploys the Fly app automatically (needs the `FLY_API_TOKEN` repository secret, see the comments in that file)
- `README_V20.md`, `legal/CHANGELOG.md`: what changed in each version (current: v24)
- `src/`: the older module sources (up to the Excel-storage version). `index.html` is now edited directly; do not rebuild it from `src/`.

Run locally: `python3 server.py`, then open http://localhost:8000.

Upgrading from the Excel-storage version: on its first start the server imports every `AZAL_<CODE>_Project_DB.xlsx` in the data folder into `fenestra.db` (the Excel files are left untouched). Logins in `users.json` keep working. Take a volume snapshot first: `fly volumes snapshots create <volume-id>`.

Never commit `.env`, `users.json`, `fenestra.db`, backups or project Excel files.
