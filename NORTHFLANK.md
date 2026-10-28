# Deploy Fenestra Site on Northflank (from this GitHub repo)

Northflank builds the app from this repository with the `Dockerfile` and redeploys it automatically every time `main` changes. You get an https address that works in the office and on site phones anywhere. Nothing is installed on a company computer and IT is not involved.

Everything below is done in the Northflank web dashboard (app.northflank.com). About 15 minutes.

## 1. Account and GitHub
1. Sign up at https://app.northflank.com (the free Sandbox tier is enough to start; check the current limits on https://northflank.com/pricing).
2. Account settings > **Git** > connect **GitHub** and allow access to the repository **Suhail0023/Fenestra**.
3. Create a **project**, for example `fenestra`. Pick the region closest to you (Europe is the usual choice from the UAE).

## 2. Create the service
In the project: **Create new > Service > Combined service** (build and deploy in one).
- **Repository:** Suhail0023/Fenestra, branch **main**.
- **Build type:** Dockerfile. Dockerfile location **/Dockerfile**, build context **/**.
- **Networking / ports:** port **8080**, protocol **HTTP**, **Public** on. Northflank gives the https address (ending in `code.run`).
- **Resources:** the smallest plan offered is enough for a few dozen users. **Instances: 1** (the database is one file on one disk; never run 2).
- **Health check (optional):** HTTP, port 8080, path `/healthz`.
- **Environment / runtime variables** (mark passwords as secret):

| Variable | Value |
|---|---|
| `INIT_ADMIN_PASSWORD` | a long password for the first login `management` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | optional, for email (Office 365: smtp.office365.com, 587) |
| `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_WA_FROM` or `WA_TOKEN`, `WA_PHONE_ID` | optional, for WhatsApp |
| `ANTHROPIC_API_KEY` | optional, AI guide |

`DATA_DIR=/data`, `PORT=8080`, `TRUST_PROXY=1`, `SEED_DEMO_USERS=0` and `TZ=Asia/Dubai` are already set in the Dockerfile.

Create the service. The first build takes a few minutes.

## 3. Add the disk (do not skip)
Without a disk, every redeploy wipes all projects and logins.
Service > **Volumes** > **Add volume**: size **3 GB** (more if you store many photos), mount path **/data**. Save; the service restarts with the disk attached.

## 4. First login
Open the https address > log in as **management** with `INIT_ADMIN_PASSWORD` > change the password > Setup > Company details, Contacts, Users. On phones, open the address and use **Add to Home Screen**.

## 5. Moving your existing data from Fly.io (only if you used Fly before)
1. On the old app: log in as Management > Setup > Server services > **Download backup** (or `fly ssh sftp get /data/<file>` for the Excel files and `users.json`).
2. On Northflank, put the files into `/data`: service > **Shell** (or Volumes > file access), then upload `users.json`, `company.json` and every `AZAL_<CODE>_Project_DB.xlsx` (old version) or `fenestra.db` (from a v24 backup zip).
3. Restart the service. Old Excel projects are imported into the database on the first start; the Excel files are left untouched.
4. When everything is there, you can stop the Fly app (`fly scale count 0`) so you do not pay twice.

## 6. Updating
Merge or push to `main` on GitHub: Northflank rebuilds and redeploys by itself. The disk and its data are kept.

## Backups
The server writes a daily backup zip to `/data/backups` (14 kept). Management can download one at any time in Setup > Server services; do that regularly and keep a copy outside Northflank (for example in SharePoint).

## If something goes wrong
| Problem | What to do |
|---|---|
| Build fails | Service > Builds > open the build log. Check the Dockerfile path is `/Dockerfile` and the branch is `main`. |
| Site opens but data is gone after a redeploy | The volume is missing or not mounted at `/data` (step 3). |
| "Permission denied" on /data in the log | The image hands the disk to the app user at start; if your plan runs containers without root, set the volume's owner to UID 10001 or ask Northflank support to allow it. |
| Locked out of `management` | Shell into the service, delete `/data/users.json`, restart: a new `management` login is created from `INIT_ADMIN_PASSWORD` (this removes the other accounts, so it is a last resort). |
