FENESTRA SITE - local server bundle

START
  Double-click start.bat (needs Python 3; no extra packages). Open http://localhost:8000
  Phones on the same Wi-Fi: run "py server.py --lan" and open http://<laptop-ip>:8000
  (camera and notifications on phones need HTTPS or the installed PWA).

LOGINS (first run creates users.json)
  User names: management, pm, planner, siteeng, qe, hse, contractor, production
  Password for all: azal2026. You must change it at first login.
  Management adds, edits and resets users in the Users tab. Each user gets the tabs of their role.
  Passwords are stored as salted hashes in users.json. Keep that file private and back it up.

DATABASE (SQLite)
  All projects are stored in ONE file, fenestra.db (next to server.py, or in DATA_DIR). Use the + button in the header to add a project.
  Writes are transactional and flushed to disk (WAL + synchronous=FULL), so a crash or power cut cannot leave it half-written.
  Open it read-only with DB Browser for SQLite or any SQL tool; do not edit it while the server runs.
  Old Excel databases (AZAL_<CODE>_Project_DB.xlsx) are imported automatically the first time the server starts (needs: pip install openpyxl, once).
  The .xlsx files are left untouched; move them away after you have checked the app. Excel is still used inside the app for downloads and imports (BOQ, rates, reports).

EMAIL
  Optional. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM before starting the server,
  then add emails in Requests > Contacts. Without SMTP the app opens your email app, or WhatsApp, with the text ready.

OFFLINE
  If the laptop is unreachable the app keeps working and saves on the phone, then syncs when back online.
  Last save wins, so avoid editing the same item on two devices while one is offline.

FILES THE APP WRITES
  fenestra.db (all projects, project tree and settings), users.json, company.json, photos/ folder.
  Make a daily copy of this whole folder as your backup.

NEW: Sign-up and Setup
- The login screen has a Sign up button. New accounts wait for Management approval (Setup tab > Sign-up requests), where Management confirms the role.
- Setup tab: company details, logo upload, contacts, users, and a role x view permissions table (Management edits; stored in company.json and the logo in logo.png/jpg next to server.py).

NEW: languages Bengali, Tamil, Chinese; vertical menu on the left (a menu button on phones); Portfolio is now a tree (projects > sub-projects, buildings, scopes, phases, zones) with rolled-up totals. Tree links are stored in ptree.json.

NEW: Progress photos tab (compressed on the device, tagged by building and elevation, slideshow); Team performance tab (points, monthly ranking, team-of-the-month recommendation); screen layout button (Auto / PC / iPad / Phone) at the top right.
Saturday reminders: the app notifies site engineers when it is open. If SMTP_HOST etc. are set, server.py also emails every site engineer with an address each Saturday after 07:00 (server clock).

NEW: Lean planner tab (Last Planner System): lessons and quick checks, takt zones, trade train, pull-planned proposal, make-ready, weekly plan and PPC. The Schedule tab is locked until the lean schedule is applied; later date changes ask for a reason.

NEW: Lean planner can be switched on or off by the project manager, planning engineer or Management. Delay analysis tab: weekly delay analysis with substantiation, monthly FIDIC (1999 or 2017) delay report and claim letter. P6 exchange accepts .xer files and matches activities by name and WBS.

NEW (v1.0): Help button with a guide assistant (set ANTHROPIC_API_KEY to make it AI-powered), grouped menu, page headers, welcome tour, Ctrl+K search. Server: login lockout, audit.log, security headers, /healthz, DATA_DIR setting. See DEPLOY.md, Dockerfile, .env.example and backup.sh for commercial deployment.

NEW: P6 exchange tab, Scope-level program: upload a summary P6 program (main scopes with dates), generate the BOQ-item-detail program, apply it, and see progress at scope and item level. Download Excel, or a detailed .xer built by the server (xer_detail.py).

NEW: Manhours (estimate set by the project manager in Setup; dashboard compares estimate, plan and actual; alarms at 50% and every 10%). Instructions tab (records Main contractor instructions, notifies Main contractor, copies Engineering and Commercial with a 7 working day deadline (Sundays excluded), adds the item to BOQ group "Variations", EOT letter if the schedule passes the baseline completion). Rates and IPA tab (Management and project manager only): rates import, monthly IPA forecast, monthly IPA from approved WIRs on the cut-off and issue days set in Setup. Add the Engineering and Commercial department emails under Setup > Contacts.

NEW: Materials tab (deliveries, locations, checklist, cutting list vs delivered, QA/QC, automatic MIR to the Main contractor and logged MIR decisions). Site tools tab (tools required, planned disbursement by employee ID, automatic store requisition forms, downloadable assignment log). IPA now uses three claim percentages set in Setup: materials on site (approved MIR), installed work (approved WIR) and snag/de-snag IR approved. Add the Store keeper email under Setup > Contacts.

DEPLOYMENT: see DEPLOY.md (Fly.io). New server features: WhatsApp (Meta Cloud API or Twilio) alongside email, notification channel setting, test sender, daily backups and backup download, production start without demo accounts (SEED_DEMO_USERS=0, INIT_ADMIN_PASSWORD), real client IP behind the proxy, large data safe in the Excel database, variations and all new fields saved in the project workbook.


CHANGED: Storage moved from one Excel workbook per project to a single SQLite database (fenestra.db). Backups (daily and Setup download) now contain a consistent fenestra.db snapshot plus fenestra.sql, a plain SQL text dump (restore with: sqlite3 new.db < fenestra.sql). ptree.json and projects.json are only read once, during the import.


DOCUMENT REGISTER, NUMBERING AND FORMATS (new)
  - Commercial > Documents: serial-numbered log of WIR, MIR, IPA, delay letters, EOT, VOP/VO, DN, warnings, etc., each with a stored copy.
    Download any item (Word/Excel/PDF original, or PDF), or the whole log as Excel, PDF, CSV or a ZIP with all copies.
  - Setup > Document numbering: pattern per type ({NNN} {YYYY} {YY} {MM} {DD} {PRJ} {TYPE}), reset (none/yearly/monthly) and custom start number.
    Numbers are never reused; voiding an item keeps its number.
  - Setup > Document formats: upload your own Word (.docx), Excel (.xlsx) or PDF template per type. Use {{field}} tokens, and {{list.column}} in a
    table row to repeat rows. Use the Test button, or download the starter file to see all tokens. PDF forms are filled by field name.
  - Needs: pip install openpyxl pypdf reportlab (included in the Docker image). LibreOffice, if installed, gives exact Word-to-PDF output.

OFF-TIMES, FORECAST, ALARMS, SOR AND GEO SCANS (new)
  - Setup > Off-times: rest, lunch and prayer breaks come out of the working day. Productive hours per day drive crews, manhours per day, durations and the Gantt;
    time sheets deduct the same off-times. "Hours behind the productivity rates" (default 10) is the reference day of the rate sheet.
  - Dashboard > Manhour and resource forecast: forecast at completion, weekly workers needed, operational budget = lower of Management's estimate and the forecast.
    Only Management sets the estimate. If the forecast exceeds it, Management and the Estimation manager contacts (Setup > Contacts) are alerted.
  - Setup > Delegation alarms: tasks not delegated within 24 h alarm Management and the planner; the project manager is reminded daily; Management and the planner get a daily
    list of unassigned tasks. Runs on the server every 10 minutes (watch.py), so it needs no one logged in. Email/WhatsApp as configured (SMTP_HOST or WhatsApp variables).
  - Rejected MIR: an SOR (site observation report) is raised, numbered and logged (Rejected materials tab and document register); production manager and project manager are notified.
  - Setup > Site location for QR scans: scans log the device location; the project manager is alerted when it is farther than the allowed distance or unreadable.
    Location needs https (or localhost) and the scanner's permission.
  - Delay letters, EOT letters and instructions are visible and issued by Management and the project manager only.

MONTHLY KPIs, RANKING AND CERTIFICATES OF RECOGNITION (new, v14)
  - KPIs tab (Management, project manager, planner, site engineer, QA/QC; the contractor does not see it). One scorecard per month for four groups:
    Project manager (schedule index, cost index, delegation on time, claims, IPA, instructions), Site engineers (updates, output, safety, acceptance),
    QA/QC engineers (WIR turnaround, documents, snags, SORs) and Team leaders (productivity, scan-in, location, right-first-time, safety).
    Each KPI has a target and weight (Setup > KPI targets and weights, Management only). Score 0-100 with red/amber/green; a KPI with no data that month is left out
    and the weights are rescaled. Ranking inside each group, with a six-month trend.
  - Monthly review: Management saves a review (summary plus a comment per person), then approves the month. Approval locks a snapshot, so later data or target changes
    do not alter published results. Until approved, only Management and the project manager see the month (as Draft). Reopen is possible until a certificate is approved.
  - Certificates of recognition: the top ranked in each group with a score at or above the threshold (Setup) is proposed. Management approves (numbered CERT-nnn,
    logged in Commercial > Documents with a copy) or withholds with a reason. Print or save as PDF, or download. Everyone is notified; Management is notified when a month is ready for review.
  - Notes: the project manager scorecard is project level; QA/QC ranking uses the names recorded on inspections; site engineers are credited by task assignment.

MODULES (v15): everything above is now the Installation module. The header has module tabs: Installation (active), Logistics, Production, Materials, Engineering (greyed out, inactive until built).

FOOTER TABS (v16): common tabs that are not specific to a module sit in a footer bar: Dashboard, Portfolio, Reports, Documents, Chat, Alerts, Activity log, Setup.
Module-specific tabs stay in the left menu. Footer tabs follow the same role permissions as before.

COMMON TABS (v17): the footer now has 16 tabs (those a role may not open are hidden).
  Inbox: notifications with unread marks, filters, mark all read, clear read (the bell opens it).
  Tasks: everything waiting for the signed-in role (delegations, unassigned tasks, WIR/MIR decisions, SORs, snags, requests, instructions, IPA drafts, permits, KPI review and certificate decisions), overdue first.
  Calendar: month view of task starts/finishes, deliveries, MIR/WIR, deadlines, IPA dates, KPI review, permits and toolbox talks; filters; download .ics.
  Contacts: project contacts and team with call/email/WhatsApp links, search, CSV.
  Library: drawings, specifications, method statements etc. stored in fenestra.db (8 MB per file); share selected files with the Main contractor (they see only shared files).
  Audit trail (Management): server audit log (logins, user changes, backups, numbering, uploads) plus sensitive project changes; CSV.
  Users and access (Management): users and logins plus a role-by-tab access matrix.
  Help and training: searchable guides, quick-start checklist per role, FAQ, print.

USER MANUAL (v18): Fenestra_User_Manual.pdf rewritten (34 pages): module tabs, footer tabs, document register and formats, off-times and forecast, delegation alarms, SOR, scan locations, KPIs and certificates, the eight common tabs, updated alarms, roles and administration (SQLite). The same file is built into the app (Help > user manual).

ADMIN ACCOUNT AND LANDING PAGE (v19)
  - Administrator login: user name Couteau (Management role). It is created once at the first start (marker file .admin_seeded in the data folder), its password is stored only
    as a salted hash and it does not ask for a password change. Change it any time with Password (top right). Deleting the user is permanent; it is not re-created.
  - Landing page: open /welcome (for example https://your-host/welcome). Public page with features, benefits, screenshots, three demonstration videos, FAQ, Log in and Sign up.
    Log in goes straight into the app; Sign up sends a request that Management approves under Setup. Files are in the site folder (images, mp4 videos); the page is index.html there.
