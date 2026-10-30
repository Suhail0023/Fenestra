# FenOps v20 - protected hosted delivery, legal pack, dated change logs

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

## v22 - Engineering module
- Header tab Engineering (view "eng"): Overview, Submittals and BOQ mapping, Checklist, Programme, Baseline, Delegation, Submittal log. Data is in S.eng (config key "eng").
- New roles (create users in the Users tab): Engineering manager, Team leader, Design engineer, Document controller. Link each staff entry in Setup to a login user name so delegations and notifications reach the person.
- Set the contacts "Engineering manager" and "Document controller" (with emails) in Setup > Contacts. Notifications are shown in each recipient's Inbox and emailed when SMTP is configured.
- The start notice, baseline checks and lapsed-date reminders run when any signed-in user opens the app (no server scheduler); each is sent once.
- Edit rights (staff structure only by the Engineering manager, approvals by Project manager) are enforced in the app, like the other modules.

## v23 - Engineering workflow, roles and KPIs
- Engineering baseline derived from the frozen P6 baseline; the Engineering manager starts after it is received.
- Delegation chain: Engineering manager to team leader to designers (list or QR badge); only team leaders log submittals after a quality tick; acknowledgement of every engineering notification.
- Site dimensions (site engineer, or IFC instruction), cutting lists with materials list logged against BOQ items, materials take-off per approved material, hash-chained engineering records.
- Installation team and Engineering department are separate groups of roles.
- KPI scorecard for the Engineering department (Engineering manager, engineering team leaders, designers, junior designers) with monthly ranking, Management review, certificates and editable targets and weights in Setup. Productivity (sqm per man-hour) is scored against the best in the group unless you set a target in Setup; there are no fixed sqm targets.
- Engineering start: PM handover checklist (IFC, specifications, BOQ, schedule, manhour budget), study and contradictions, RFI log (contract reply period or 14 days), automatic schedule after RFI closure, PM decisions (approve, return, resources, revised schedule).
- Shop drawing gated by MT, SC and CD; site dimensions requested after SD approval; BMTO (bulk, after material approval) and MTO (after shop-drawing approval, taken off the BMTO) go to the Procurement manager after the Engineering manager's quality check; cutting lists split for curtain wall and sliding doors; GTO (glass take-off, replaces the GPO); as-built and QA/QC handover documents on snagging; traceability matrix.
- Set the Procurement manager contact and the RFI reply period in Setup.
- Quality: team leader checks, then the Engineering manager checks, before anything is released; rejected or returned work goes back to the team leader who logged it for re-delegation (with dates, list or QR badge). Every delegation needs a start and an end date. Output logs record man-hours.
- KPI visibility: people see only groups below their own role; the Main contractor sees none.
- AI contradiction check of the handover package is optional and off by default: the Engineering manager or Management switches it on in Setup (Engineering: AI check, ranking and alerts); it then runs when the Project manager shares the handover. Set ANTHROPIC_API_KEY (and optionally ANTHROPIC_MODEL) on the server; without it the BOQ-and-schedule rules run instead. Select the IFC and specification PDFs in Engineering > Study and RFI (from the Library).
- v26: Engineering home screen (waiting for you), who-holds-what, pipeline per BOQ item, batch quality check, re-delegate all returned work, document history, hours timer and odd-hours flags, ranking minimum hours and family weights (Setup), burn-down chart, weekly report, Procurement tab and the Procurement manager login, phone layout and high-contrast switch.
