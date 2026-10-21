FENESTRA SITE - local server bundle

START
  Double-click start.bat (needs Python; it installs openpyxl). Open http://localhost:8000
  Phones on the same Wi-Fi: run "py server.py --lan" and open http://<laptop-ip>:8000
  (camera and notifications on phones need HTTPS or the installed PWA).

LOGINS (first run creates users.json)
  User names: management, pm, planner, siteeng, qe, hse, contractor, production
  Password for all: azal2026. You must change it at first login.
  Management adds, edits and resets users in the Users tab. Each user gets the tabs of their role.
  Passwords are stored as salted hashes in users.json. Keep that file private and back it up.

PROJECTS
  Each project is its own workbook: AZAL_<CODE>_Project_DB.xlsx. Use the + button in the header to add one.
  Close a workbook in Excel before using the app (Excel locks it).

EMAIL
  Optional. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM before starting the server,
  then add emails in Requests > Contacts. Without SMTP the app opens your email app, or WhatsApp, with the text ready.

OFFLINE
  If the laptop is unreachable the app keeps working and saves on the phone, then syncs when back online.
  Last save wins, so avoid editing the same item on two devices while one is offline.

FILES THE APP WRITES
  AZAL_<CODE>_Project_DB.xlsx (one sheet per table, Config sheet for settings), projects.json, users.json, photos/ folder.
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
