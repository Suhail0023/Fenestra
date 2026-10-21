# Fenestra

Fenestra Site: fenestration installation planning and monitoring web app (single-file vanilla JS front end, small Python server, Excel-per-project storage).

- `index.html`, `server.py`, `xer_detail.py`, `sw.js`: the deployable app
- `Dockerfile`, `docker-compose.yml`, `DEPLOY.md`: deployment (see DEPLOY.md)
- `src/`: front-end modules and `build.py`, which assembles `index.html`. `python3 build.py` in `src/` rebuilds it; `python3 mkt.py tN.js` runs the node tests.

Run locally: `python3 server.py`, then open http://localhost:8000. Never commit `.env`, `users.json` or project Excel files.
