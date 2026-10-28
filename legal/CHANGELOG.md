# Fenestra Site - dated change log

Each entry shows the date and time (Asia/Dubai) when that version was built and delivered.

## v24 - 2026-10-28 13:53
**Auto-schedule the whole BOQ scope by scope**

- Schedule page (and Setup onboarding step 3): enter one start and one finish date for the whole BOQ and press Preview schedule
- Each scope (top BOQ line) is scheduled zone by zone (building and level, in the Lean zone order) at a common pace so the last item finishes by the finish date
- Follow-on scopes (glass, shutters, sheets) are paired automatically with their frame, bracket, outer, channel or runner scope and start a set number of days after it in the same zone
- Options: first-fix scopes in parallel or one after another, follow-on lag, never slower than standard productivity, keep items already started or delegated
- Preview shows each scope's start, finish and window and the crew effort against standard productivity before anything changes
- Apply keeps the standard durations so the schedule can be redone or reset; Undo puts back the previous dates; the change is logged

## v23 - 2026-10-28 13:17
**Excel program to P6 converter**

- Planning > Excel to P6: upload a programme from Excel (.xlsx, .xls, .csv) or an MS Project export and download a Primavera P6 file (.xer)
- Columns are detected automatically and can be changed: activity ID, name, WBS (up to 3 levels, a path, or MS Project outline levels), start, finish, duration, % complete, predecessors, activity type, actual dates
- Rows with a name but no dates are read as WBS headings; missing dates are worked out from the predecessors (FS, SS, FF, SF with lags in days, weeks or hours)
- Choice of calendar (company Mon-Sat with holidays, Mon-Sat, Sun-Thu, Sat-Thu, Mon-Fri, 7 days), hours per day, data date and project ID; milestones, progress and actual dates are carried into P6
- Preview with warnings (unknown predecessors, bad dates, missing durations) before converting; Excel template download
- Available to the planning engineer, project manager and Management (server checks the role)

## v22 - 2026-10-28 09:24
**Delete project, loaded program and BOQ**

- Setup > Delete data card (and buttons on the BOQ, Schedule, P6 exchange and Portfolio pages) to delete the BOQ, the loaded program or a whole project
- Delete BOQ (Project manager, Management): removes all BOQ items and prices with the schedule, baseline and detailed program built on them; linked site records can be deleted too or kept as history
- Delete loaded program (Project manager, Management, Planning engineer): clears activity start dates, the scope-level P6 program and the detailed program; the frozen baseline can also be deleted by the Planning engineer or Management
- Delete project (Project manager, Management): removes every record of the project from the database; blocked for the last project and for projects with sub-projects; the server saves a full database backup first
- Every delete asks to type DELETE or the project code, offers a JSON backup download, and is written to the activity log and the server audit
- A deleted project is not re-created by the demo seed, a legacy Excel file or a late save from another device; other users on it are moved to another project

## v21 - 2026-10-25 19:16
**New-project onboarding**

- Setup page opens with a 5-step onboarding panel: contract, BOQ and prices, baseline schedule, setup data and forms, review and save
- Contract upload reads the text and fills the contract number and start and end dates when found; original file stored in the Library (Contracts)
- BOQ upload accepts a price column; prices are removed by the server for every role below Project manager and cannot be altered by those roles
- Project manager or Management may import the P6 baseline and freeze it while no baseline exists
- Save button stores partial setup; missing items are listed and a reminder shows on the PM dashboard until complete

## v20 - 2026-10-25 13:02
**Protection release**

- Application code is sent only after login (login shell page); no code is served to visitors
- Role-gated KPI and certificate module is not sent to the Main contractor
- Browser code minified; Python compiled to bytecode in the release image; no readable source in the image
- User manual served only to signed-in users
- Per-company hosted deployment scripts for Fly.io
- Copyright notice, proprietary licence, third-party notices, NDA template
- Dated release history and file hash manifest, downloadable in the app

## v19 - 2026-10-25 11:25
**Administrator login and landing page**

- Permanent administrator account Couteau (password stored only as a salted hash)
- Public landing page at /welcome with features, benefits, screenshots, three demonstration videos, log in and sign up
- KPI index values rounded for display

## v18 - 2026-10-25 11:01
**User manual rewritten**

- 34-page manual covering all features to v17, built into the app

## v17 - 2026-10-25 10:41
**Eight new common tabs**

- Inbox, Tasks and actions, Calendar (.ics export), Contacts, Library, Audit trail, Users and access, Help and training
- Library and audit lists refresh on opening

## v16 - 2026-10-25 09:53
**Footer tabs for common items**

- Common tabs moved to a footer bar: Dashboard, Portfolio, Reports, Documents, Chat, Alerts, Activity log, Setup

## v15 - 2026-10-25 09:49
**Installation module and module tabs**

- Existing application becomes the Installation module
- Header tabs: Installation (active), Logistics, Production, Materials, Engineering (greyed out)

## v14 - 2026-10-25 09:32
**Monthly KPIs, ranking and certificates of recognition**

- KPI scorecards for project manager, site engineers, QA/QC engineers and team leaders with targets and weights
- Monthly ranking, six-month trend, Management review, official approval with locked snapshot
- Numbered certificates of recognition (approve or withhold with reason), printable and filed in the register

## v13 - 2026-10-25 08:13
**Off-times, forecast, SOR, delegation alarms and scan locations**

- Rest, lunch and prayer off-times reduce productive hours; used by crews, durations, Gantt and time sheets
- Manhour and resource forecast on the dashboard; operational budget is the lower of estimate and forecast; alert to Management and the estimation manager
- Site observation report raised automatically for a rejected MIR; production and project managers notified; logged in the register
- Server-side delegation alarms (24 hours), daily project manager reminders and daily unassigned-task notices (watch.py)
- QR scans record the device location; project manager alerted when away from site
- Delay letters, EOT letters and instructions limited to Management and the project manager
- Fixes: duplicate function name clash (forecast card), delegation settings key, push/poll data race

## v12 (documents) - 2026-10-25 07:19
**Document register, numbering and formats**

- Serial numbering and log of WIR, MIR, IPA, delay letters, EOT, variations, delivery notes, warnings and other letters, each with a stored copy
- Downloadable register as Excel, PDF, CSV or ZIP of all copies; individual items downloadable
- Custom numbering patterns, reset rules and start numbers in Setup
- Upload Word, Excel or PDF formats per document type; letters and forms are generated from them
- Role restrictions tested end to end

## v11 (SQLite) - 2026-10-25 07:02
**Permanent storage moved from Excel to SQLite**

- All project data stored in a single SQLite database (fenestra.db), WAL mode
- Backups hold a consistent database snapshot and a plain SQL dump (fenestra.sql)
- Old Excel workbooks are imported once at the first start

## User manual 1 - 2026-10-23 12:27
**First user manual (20 pages)**

- Chapters 1 to 10 following the project workflow and appendices A to E

## v0 (original) - 2026-10-20 12:50
**Original application received as AZAL_local.zip**

- Single-file web app (index.html) with a small Python server, installable on phones
- Project data kept in one Excel workbook per project
- Planning, delegation, QR time sheets, WIR and MIR, IPA, delay claims, Lean planner, P6 exchange, English plus seven languages

