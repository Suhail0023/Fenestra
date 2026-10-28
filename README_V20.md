# Fenestra Site v20 - protected hosted delivery, legal pack, dated change logs

## What changed
- Hosted-only delivery: visitors get only shell.html (login). The app is sent by GET /api/app after sign-in, assembled per role (KPI module omitted for Main contractor).
- Build: `python3 tools/build_protected.py` (esbuild minify -> dist/). Not obfuscation; it makes casual copying harder, it does not make it impossible.
- Server code ships as .pyc only via `Dockerfile.release` (fly.release.toml). Run `deploy/new_company.ps1|sh` to create a company, `deploy/update_all.ps1` to update all.
- Env vars: COPYRIGHT_HOLDER (default "Charles Couteau"), INIT_ADMIN_PASSWORD.
- Offline use of the app is no longer supported (the shell is cached, the app is not).
- Dated logs: `python3 tools/make_history.py` fills legal/release_history.json time, writes legal/CHANGELOG.md/.csv and legal/MANIFEST_<ver>.json (SHA-256 of every source file). In the app: Help > Release history; Logs and Audit tabs have change-log CSV downloads.
- Legal: LICENSE.txt, COPYRIGHT.txt, THIRD_PARTY_NOTICES.txt, legal/NDA_template.txt, legal/PROTECTION_CHECKLIST.txt. These are templates; have a lawyer review them and fill in governing law.
- Keep the source in a private repository and never send this zip to customers. Timestamp the manifest externally (e.g. a dated email to yourself or a notary).

## v21 - new-project onboarding
- Setup > "New project onboarding" (Project manager, Management): 1 Contract (upload, number, start/end dates), 2 BOQ and prices (Excel upload with price column, or manual), 3 Baseline (P6 .xer / Excel or manual, freeze), 4 Setup data and forms, 5 Review and Save. Missing data is allowed and listed.
- BOQ prices (fields cr, bc, vr) are stripped by the server (/api/state) for all roles except Management and Project manager; their saves cannot change or erase prices.
- New projects start with the onboarding reminder on the PM dashboard (S.onb.open).

## v22 - delete project, loaded program, BOQ
- Setup > "Delete data" card; also a "Delete BOQ" button on the BOQ page, "Delete loaded program" on Schedule and P6 exchange, and "Delete a project" on the Portfolio tree.
- Delete BOQ (Project manager, Management): all BOQ items and prices plus schedule, baseline, detailed program, delegation checklists and pending approvals. Tick box to also delete linked site records (logs, WIR, snags, permits, requests, delays, variations, costs) or keep them as history.
- Delete loaded program (Project manager, Management, Planning engineer): clears start dates (durations and BOQ stay), the scope-level P6 program (S.sp) and the detailed program (S.dp). Optional: delete the frozen baseline (Planning engineer or Management, or anyone while it could be re-frozen).
- Delete project (Project manager, Management): POST /api/project/delete {code, confirm: code}. Refused for the last project and for a project with sub-projects. Server writes backups/before_delete_<CODE>_<time>.zip first, removes every row with that project code from every table (including library, documents and notices), and records the code in table deleted_projects so it is not re-seeded (LR001 demo / AZAL_<CODE>_Project_DB.xlsx) or re-created by a late save (POST /api/state answers 410). Creating a project with the same code again clears the mark.
- Each delete asks to type DELETE (or the project code), offers a JSON backup download, and is logged.
- Fix: the app no longer drops into offline/demo mode when the project remembered in the browser no longer exists.

## v23 - Excel program to P6 (.xer)
- New page Planning > "Excel to P6" (key x2p) for Planning engineer, Project manager and Management.
- Browser reads the Excel file (SheetJS), maps columns, builds the activity list and shows a preview with warnings; the server builds the XER: POST /api/xer/excel -> xer_detail.build_generic() (summary in the X-Summary header).
- XER contents: PROJECT, CALENDAR (generated for the chosen working week; the company option reproduces the template calendar with its holidays exactly), PROJWBS tree, TASK (tasks, start and finish milestones, progress, actual dates, Start On or After constraints per the "Keep the Excel dates" option), TASKPRED with lags.
- Dates accepted: Excel dates, ISO, 16-Nov-26 (P6 export, trailing "A" read as actual), Nov 16 2026, dd/mm/yyyy or mm/dd/yyyy (selectable). Durations like 10, "10d", "3 wks", "16 hrs".

## v24 - auto-schedule the whole BOQ scope by scope
- Card "Auto-schedule the whole BOQ (scope by scope)" at the top of Schedule (and in Setup > onboarding step 3) for Project manager, Management, Planning engineer.
- Scope = top BOQ line. Items run one after another per scope in lnZones() order. Follow-on scopes (name matches glass/shutter/sheet/panel) pair with the first-fix scope (frame/bracket/outer/channel/rail/runner) sharing the first words of the name; follow-on item start >= first-fix item start + lag (default 15, capped at item length - 1) and finish >= its finish.
- A single pace factor k multiplies every standard duration (binary search so the last finish <= finish date). "Crew effort" = 1/k. Option to cap k at 1.
- State S.asch (new config key "asch" in server.py): settings, std (standard durations by item id, kept on first apply), undo (previous start/dur), who/when.
