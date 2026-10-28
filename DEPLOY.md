# Deploy Fenestra Site on Fly.io

**Windows shortcut:** open PowerShell in this folder and run `.\deploy.ps1`. It asks for an app name and your passwords, then does every step below. The manual steps follow if you prefer them.

Everything the app needs is in this folder: the server (logins, SQLite project database, email, WhatsApp, reminders, XER export, backups), the web app, `Dockerfile` and `fly.toml`. You run the steps below yourself, so your Fly and provider credentials stay with you.

## 1. One-time setup
1. Install flyctl: https://fly.io/docs/flyctl/install/
2. `fly auth login` (opens your browser; add a payment card on your Fly account).
3. In this folder: `fly launch --no-deploy --copy-config` and accept the name suggested (edit `app` in fly.toml if taken). Answer **No** to a database.
4. Create the storage volume (it holds the SQLite database (fenestra.db), photos, logins, backups):
   `fly volumes create fenestra_data --size 3 --region fra`
   (use the same region as `primary_region` in fly.toml).

## 2. Secrets (email, WhatsApp, first login)
1. `cp .env.example .env` and fill in:
   - `INIT_ADMIN_PASSWORD`: a long password for the first Management login.
   - Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
   - WhatsApp: either Meta Cloud API (`WA_TOKEN`, `WA_PHONE_ID`) or Twilio (`TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_WA_FROM`).
   - Optional `ANTHROPIC_API_KEY` for the AI guide.
2. `./deploy_secrets.sh` (runs `fly secrets import`). Then delete `.env` or keep it private.

## 3. Deploy
`fly deploy`
Open `https://<app-name>.fly.dev`. Sign in as user **management** with your `INIT_ADMIN_PASSWORD`; the app forces a password change.

## 4. After the first login
1. Setup > Company details, logo, Contacts (include emails and WhatsApp numbers in international format, e.g. 9715xxxxxxxx; also Engineering, Commercial and Store keeper).
2. Setup > Server services: check Email / WhatsApp show **on**, choose the notification channel, press **Send test message**.
3. Setup > Users: create accounts (or let people sign up and approve them).
4. Open the app on your phone and use Add to Home Screen.

## WhatsApp notes
- Meta Cloud API: create a WhatsApp Business app, add a phone number, copy the permanent token and Phone number ID. Free-text messages only reach people who messaged your number in the last 24 hours. To reach everyone, create a message template with one body variable, get it approved, and set `WA_TEMPLATE`. The app puts the whole message into that variable.
- Twilio: use the WhatsApp sender or sandbox; recipients must have joined the sandbox.
- Messages go to the phone number stored on each contact or user.

## Operating it
- Logs: `fly logs`. Health check: `/healthz`.
- Keep **one** machine (the SQLite database is a file on one volume): `fly scale count 1`.
- Backups: the server writes a daily zip to `/data/backups` (14 kept). Management can also download a backup in Setup > Server services. Take volume snapshots too: `fly volumes snapshots list`.
- Update the app: replace files, `fly deploy`. Data stays on the volume.
- Reset a forgotten Management password: `fly ssh console`, delete `/data/users.json`, restart (`fly machine restart`); a new Management account is created from `INIT_ADMIN_PASSWORD`. This removes all other accounts, so use it only as a last resort.
- Time zone is Asia/Dubai (`TZ`), which sets the Saturday reminder and the daily backup time.

## Security in place
Salted PBKDF2 passwords, forced first-login change, lockout after repeated failures (per user and per client address, using the real client IP behind Fly's proxy), Management approval of sign-ups, HTTPS only (HSTS), role checks on the server, audit log at `/data/audit.log`.
Known limit: project data is sent to every signed-in user and role views are enforced in the app, so keep logins limited to people allowed to see commercial figures.

## Docker (any host)
    cd AZAL_local
    cp .env.example .env        # set INIT_ADMIN_PASSWORD and optional SMTP_* values
    docker compose up -d --build
    # open http://<host>:8080  (user: management, password = INIT_ADMIN_PASSWORD)
Or without compose:
    docker build -t fenestra-site .
    docker run -d -p 8080:8080 --env-file .env -v fenestra-data:/data --restart unless-stopped fenestra-site
All project data, users, photos and the audit log live in the /data volume, so keep that volume and back it up. Put the container behind an HTTPS reverse proxy (Caddy, nginx, Traefik or your cloud load balancer) before real use; TRUST_PROXY=1 is already set for that.

## Database (SQLite)
- All project data lives in `/data/fenestra.db` (WAL mode, synchronous=FULL). Back up the volume as before; the daily zip and the Setup download hold a consistent `fenestra.db` snapshot and a plain-text `fenestra.sql` dump.
- Upgrading from the Excel version: leave the old `AZAL_*_Project_DB.xlsx` files in the data volume and start the new version once. They are imported automatically (the image includes `openpyxl` for this one-time step). Check the app, then delete the .xlsx files.
- Quick look: `fly ssh console` then `python -c "import sqlite3;c=sqlite3.connect('/data/fenestra.db');print(c.execute('select code,name from projects').fetchall())"`.

- Document register/formats: the image now includes `docs.py`, `pypdf` and `reportlab`. Numbers, register and uploaded formats live in `fenestra.db` (included in backups).

- v13: the image also includes `watch.py` (delegation alarms, runs inside the server). Set SMTP_HOST (or WhatsApp variables) for the alarm emails. Site-location scans need the app to be served over https.

- v14: monthly KPI results, review, approval and certificates are stored with the project state (`kpi`, `kpir`, `kpic`) in `fenestra.db`; no new service or variables. Certificates use the CERT numbering type in the document register.

- v17: the image includes `lib.py` (project library, stored in the `library` table of fenestra.db and included in backups). The audit trail reads `audit.log` in the data volume.

- v19: the image also contains the `site/` folder (public landing page at `/welcome`, with images and demo videos, about 3.6 MB). The administrator account `Couteau` is added at first start (stored hashed; marker `.admin_seeded` in the data volume).
