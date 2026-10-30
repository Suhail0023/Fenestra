# FenOps - dated change log

Each entry shows the date and time (Asia/Dubai) when that version was built and delivered.

## v35 - 2026-10-30 07:00
**Lean execution and six-week look-ahead**

- Look-ahead horizon changed from one month to six weeks everywhere it applied (Installation look-ahead, notifications and e-mail, tools check, resource delegation, Engineering, Production, Logistics, cross-module look-ahead, presentation); the number of weeks is a Setup value
- Make-ready and constraints (Installation > Lean execution): each activity in the look-ahead is Ready or Not ready; materials, cutting lists and delivery are checked automatically from the other modules, anything else is a constraint with category, owner and due date; owners are notified, overdue constraints and not-ready activities raise alarms; a Make-ready column was added to the look-ahead table
- Weekly work plan and PPC: team leaders commit only ready work (the Site engineer or PM can commit not-ready work with a recorded reason), close the week as done or not done with a reason, and PPC is reported by week, by team leader and by reason; Excel download; late additions are shown but not counted
- Daily huddle: crew board, yesterday's plan against actual, today's committed work, blockers with a quick raise-a-blocker form, safety topic of the day and a huddle record with a 7-day history; Lean execution card on the project dashboard
- Setup: look-ahead weeks, PPC target, grace days, constraint categories, miss reasons and safety topics
- Screens built for phones and tablets: large buttons, card layout, 16 px inputs

## v34 - 2026-10-29 20:30
**Follow-up improvements to Materials, Logistics and the menu**

- Left menu: module dashboard, Team performance and KPI scorecard always on top (Overview), then the module menus; rule recorded in the menu sheet
- New Cross-module look-ahead (Project): engineering cutting lists, materials, production, logistics and installation by BOQ item, a 6-week summary and the gaps between them
- Engineering dashboard: card with NCR / SOR and open material shortages against Engineering
- Logistics: vehicles have a longest item and payload, a delivery can carry its longest item and weight, and vehicle assignment respects both; when a party is not ready the system proposes a new date from its expected-ready date and the Project manager confirms; Excel and PDF downloads of deliveries and of the manpower forecast with its change log
- Materials: excess tolerance percentage (Procurement setup) accepts small excess into stock automatically; a delivery rejected at incoming QA/QC (including a failed ITP item) raises an NCR against the vendor and feeds a Vendor quality table
- Setup: Starting values to review (vehicles, productivity, ITP, production capacity, lead times) confirmed by their owners; Management sees accounts that still have the initial password and the backup status with Back up now
- Server: backup at start-up as well as daily, backup is checked (zip readable and database integrity), last 30 kept, status endpoint for Management; start-up notice for accounts with the initial password
- Tables on phones: every screen now switches to the stacked layout on narrow screens

## v33 - 2026-10-29 22:00
**Materials balance, excess, ITP and Logistics module**

- Materials: a QA/QC-passed receipt below the PO quantity asks whether more delivery is scheduled; if yes the balance is tracked with its date and a delay is raised when it is missed; if no, a shortage alarm goes to the PM and Engineering manager, the Engineering manager gets a task to delegate re-optimisation, the cause study and an additional MTO, and an NCR is logged against Engineering
- Materials: excess against the PO alerts the responsible Procurement officer (cc Procurement manager) to notify the vendor and accept it as a tolerance quantity into stock, or return it
- QA/QC ITP (inspection and test procedure) in Setup; the inspection checklist of incoming material and of packing/dispatch must answer every ITP item before QA/QC can pass
- Logistics module: deliveries created from each DN, advance notice to PM, Site engineer and QA/QC with readiness confirmation, dispatch checklist (installation materials accompany the cutting list in partial deliveries), automatic vehicle assignment by capacity, dispatch and receipt at site
- Logistics setup: vehicles and capacity, productivity table, dispatch checklist; manpower forecast from productivity and the baseline schedule, Project manager override with a mandatory reason and a change log; look-ahead, team performance and KPI scorecard
- Left menu: in every module the module dashboard, Team performance and KPI scorecard are always at the top (heading Overview), followed by the module's own menus

## v32 - 2026-10-29 20:30
**Project baseline (P6) and derived part schedules**

- Setup: Project baseline (P6) card. Upload the full baseline (.xer, or Excel / CSV) or enter activities by hand; keyword rules sort activities into Engineering, Procurement, Production and Installation, with a manual part and BOQ link per activity
- Derived part schedules by BOQ item, downloadable per part as Excel; Production manager sees the derived card
- Production need-by date of a cutting list now comes from the Production activities of the baseline, then the Installation start less transit days; Materials need date uses the Production start
- Engineering: the engineering baseline (approval-required dates per BOQ item) follows the Engineering activities of the project baseline automatically; a baseline set by hand is kept until the Project manager or Planning engineer applies the P6 one (old one kept in history). New card in Engineering > Baseline

## v31 - 2026-10-29 19:30
**Production module activated**

- New roles: Production manager (replaces the old Production role), Production engineer, Production foreman, Production team leader, Maintenance in-charge; demo logins added for new installations
- Setup: Production capacity card with process times by stage, teams, manpower, shifts, hours, working days and the machine table, loaded from the Factory productivity sheet
- Cutting list intake: automatic priority from materials delivered (DN records), material ETA, site readiness confirmed by the Site engineer within 24 hours (logged, can be re-notified) and programme need date; rejection with comments goes back to Engineering and is added to the Engineering checklist with a link to the comment
- Capacity check before scheduling; excess moves to following days and weeks; spare capacity recommends cutting lists to produce to stock (manager confirms) and then alerts Management, Project manager and Production manager to reduce hours or overtime
- Automatic production schedule with start, end, workers and manhours per cutting list; manual override (order, start date, hold); download as Excel or PDF; delay against the baseline alarms the Production manager and Project manager with a recommended shift or overtime
- Dashboard: status, capacity utilisation bar chart by week coloured by status (ready, in queue, to stock, awaiting materials, awaiting site clearance), forecast of manpower; Look-ahead
- Delegation: Production manager to Production engineer with full resources, engineer to foremen by line, foreman to team leaders by list or QR code; team leaders check crew in by QR and log square metres, start and stop and manhours
- Packing list generated on completion or for a partial quantity; QA/QC checks quality and quantity; DN only after QA/QC passes and the full installation materials for that percentage are packed
- Breakdowns and obstacles: team leader alert, maintenance confirmation, manager approval, automatic recalculation and an internal delay notice to the Project manager with a recovery proposal
- NCR / SOR issued by QA/QC deducts KPI points from the department responsible; team performance, KPI scorecard and productivity learnings for Production

## v30 - 2026-10-29 17:30
**Materials module activated**

- Bulk packages: released Bulk MTO creates a package for the Procurement manager to delegate to an officer; vendors found, comparison sheet of at least 3 vendors, Procurement manager and Management approval, then supply agreement number; start and end dates only
- Store check first: MTO and GTO per CL and BOQ item go to the store to deduct unbooked aging stock; only then PR and PO delegation, with PR and PO numbers and dates logged
- Lead times in Setup for supply agreement, PR and PO, with per-BOQ overrides; PO logging asks to confirm the ETA was verified with the vendor
- Delay alarms and delay records for supply agreement, PR and PO to the Procurement manager; ETA later than the P6 baseline need date alarms Procurement manager and PM, corrective action or revised schedule by PM or Planner
- Materials dashboard: overall procurement bar plus PR, PO and delivery bars
- Incoming QA/QC: checklist (quality and quantity vs PO, datasheets, certificates, draft warranty, municipality and civil defense approval); fail returns to vendor; DN only after pass, with accepted quantity linked to PO, CL and BOQ; same for vendor site deliveries
- Glass reminders: backpan CL one month before ETA, site delivery request 15 days before, PP and CC for CW 15 days after; follows receipt date if ETA slips
- Team performance, KPI scorecard, movable menu and menu matrix as other modules

## v29 - 2026-10-29 15:30
**Engineering stages moved to the left menu**

- Engineering: the tabs inside the dashboard (Start, Plan, Deliver, Close) are now left-menu items grouped Start, Plan, Deliver and Close; the dashboard shows status only and its tab bar is removed
- Schedule and forecast and the duplicate Baseline removed; Programme and schedule and Baseline sit under Plan with Delegation, Gantt and Look-ahead
- Role permissions per item are unchanged
- Engineering dashboard: the Start of engineering and Workflow cards removed

## v28 - 2026-10-29 14:30
**Tools delivery log and Site menu order**

- Tools: delivery to site is logged first (date, tool, quantity, delivery note, supplier, condition); stock table shows required, delivered, still to deliver, with installers, lost and in store; disbursement warns when the store holds less than the quantity
- Site menu order: Materials, WIR, Snagging, then Site tasks, Progress photos, Tools, Safety

## v27 - 2026-10-29 11:00
**Reorder every screen, overload alarm, project presentation, Engineering menu clean-up**

- Every left-pane screen: cards can be dragged (or moved with arrows); order saved per user
- Delegating: team selector with overload alarm and recommended team with capacity (Project manager at delegation, Site engineer at acceptance and on the Site screen)
- Site team leader no longer has Materials; Site logistics can record deliveries of materials and tools
- Management: auto-generated Project presentation (preview, play with timer, full screen, print or save as PDF)
- Setup options in alphabetical order
- Engineering menu: Engineering dashboard first; handover, tasks, planning, deliverables and records items removed from the left pane (tabs of the dashboard); Contrast button removed; same for Engineering team leader and Designer
- Engineering-scoped Team performance, KPI scorecard (Engineering manager monitors and approves awards), Schedule and forecast, Gantt, Baseline and Look-ahead
- Productivity learnings for all departments, also for Planning engineer, Engineering manager and Procurement manager

## v26 - 2026-10-29 07:00
**Menu clean-up: cards moved to Setup, IPA and Variation register, drag order**

- Project dashboard, Team performance and KPI scorecard: cards can be dragged (or moved with arrows); order is remembered per user in the browser
- Productivity learnings shows learnings only; Productivity rates, BOQ rates import, commercial settings, contract rates and estimate, other costs and storage locations are in Setup
- IPA menu: forecast, monthly IPA, IPAs prepared and monthly progress invoice; menu items renamed IPA and Look-ahead
- Variation register menu holds only the register; commercial dashboard is on the Project dashboard; the register is no longer under Monthly notice of delay
- Progress photos: Management sees photos by building and elevation only; Site team leader can upload
- Delegate resources and tasks is one button
- Project manager has no Site tasks; Planning engineer can add and split BOQ items and has no IPA

## v25 - 2026-10-29 05:30
**FenOps: menu matrix and new roles**

- The app is renamed FenOps (was Fenestra Site) in every screen, document, licence and deployment file; stored-data keys and the database file name are unchanged so existing data keeps working
- Menu matrix from FensOps_Menu.xlsx: header modules (Installation, Logistics, Production, Materials, Engineering) decide the left pane; what each role sees follows the matrix; Logistics and Production stay greyed until they have items
- Roles: added Site team leader, Procurement officer and Site logistics; Quality engineer renamed QA/QC, HSE officer renamed HSE, Production department renamed Production; Junior designer (now Designer) and Document controller (duties go to the Engineering manager) removed; existing logins and contacts are converted automatically
- Footer menu: Tasks, Inbox, Calendar, Chat, Alerts, Documents, Library, Reports, Logs, Contacts, Portfolio, Activity log and Help, with sub-menus (tasks for myself and for subordinates with ageing; letter logs and forms log; reports register and organisation; the logs of deliveries, QA/QC, MIR, WIR, SOR, NCR, snags, tools, incidents, danger notices, time sheets, warning letters and the monthly team performance report)
- Setup moves to the gear in the header (Management, Project manager, Planner; the Engineering manager sees the engineering settings only) with a jump list of its sections; Backup, archive and delete data moves to Portfolio; Users and Audit are reached from Setup
- Instructions and Requests are open to site engineers as in the sheet; the Project dashboard is for Management; the Engineering dashboard for the Engineering manager
- Project manager lands on the Project dashboard
- Site team leader: new Delegate to my crew screen (list or QR badge, start and end dates required, own team only, recorded in the task history); Engineering team leader delegates to designers by list or QR
- Menu matrix is now generated from FenOps_Menu.xlsx (legal/FenOps_Menu.xlsx), the master record

## v23 - 2026-10-27 21:09
**Engineering workflow corrections**

- Engineering baseline is derived automatically from the frozen project (P6) baseline; only if missing the Project manager or Planning engineer provides it; the Engineering manager is notified to start only after the baseline is received
- Engineering manager delegates submittals to team leaders with start and end dates; team leaders delegate to designers/engineers from their team by list or by scanning their QR badge
- Designers/engineers log their output (sqm issued); output is ranked on the dashboard and in Engineering
- Only team leaders can log submittals, after confirming they checked them for quality; designers, engineers and the Engineering manager cannot
- Rejected submittals notify the team leader and the responsible designers/engineers for rework and resubmission; lapsed dates also notify the delegated designers/engineers
- Every engineering notification and reminder stays until the recipient acknowledges that it was received and action will be taken; the inbox cannot clear unacknowledged items
- Engineering lead time is 5 months before installation (was 90 days)
- On programme approval the Project manager is notified to delegate the site-dimension survey of the BOQ items to a site engineer with a deadline
- Site engineer accepts, or rejects with justification and photo evidence (logged as an access obstruction; Project manager, Engineering manager and Main contractor notified)
- Project manager can instead instruct the Engineering manager to follow the IFC dimensions; the Main contractor is notified automatically
- Receipt of site dimensions or an IFC instruction creates a cutting list / fabrication order task; the Engineering manager assigns a team leader with dates; the team leader accepts or rejects with justification and records issue
- Team-leader-logged output counts only after Engineering manager approval
- Permanent, hash-chained engineering records on the server (instructions, site dimensions, notifications, decisions) with CSV/JSON download and chain verification
- Issued cutting lists are logged against their BOQ item (register by BOQ item with document, link, sqm, preparer and materials)
- Cutting list sqm is credited to the designer/engineer who prepared it and counts in the output log and ranking after Engineering manager approval
- The materials list is part of the cutting list (required lines: description, unit, quantity)
- Materials take-off is per approved material submittal (for example the aluminium system submittal creates the aluminium take-off); the Engineering manager delegates each to an engineering team leader with start and end dates
- Roles separated: Installation team (Project managers, Site engineers, Supervisors / Site team leaders, Foremen, Charge hands, Installers, Helpers) and Engineering department (Engineering manager, Engineering team leaders, Designers, Junior designers)
- Engineering roles renamed: Engineering team leader, Designer, new Junior designer; existing logins are converted automatically
- Employee register categories updated for the installation team; old categories are converted; Setup shows both groups
- KPI scorecard extended to the Engineering department: Engineering manager (submittals on time, baseline compliance, first-time approval, approval cycle time, lapsed items, delegation speed, cutting lists on time), engineering team leaders (delegated work on time, quality, rework turnaround, acceptance response, team output, acknowledgement) and designers and junior designers ranked separately (quality-adjusted output, productivity, delivered inside the window, output accepted, acknowledgement)
- Engineering start: the Project manager completes a handover checklist (IFC drawings, specifications, BOQ, baseline schedule, engineering budget in manhours) and shares it with the Engineering manager, planner and document controller
- Study of the handover documents delegated by the Engineering manager (start and end dates, accept or reject), list of possible contradictions, RFI log with reply deadline from the contract (14 days when not stated); lapses alert the Engineering manager, Project manager and planner
- Engineering schedule generated automatically when all RFIs are closed: MT, SC and CD in parallel, then SD; MTO, cutting lists and GTO follow; checked against the baseline; Engineering manager reviews, justifies any excess and submits to the Project manager, copying the planner
- Project manager can approve, return with comments, request more resources from Management or ask for a revised (compressed) schedule
- Shop drawing can be delegated only after MT, SC and CD are approved; concept drawing log needs a stock check for aging materials; site-dimension tasks now start when a shop drawing is approved, notifying the Project manager and site engineers
- Materials take-off needs a factory, site and consumables checklist and is sent to the Procurement manager (contact in Setup); cutting-list materials and released GTOs also go to procurement
- Cutting lists split by product family (curtain wall: curtain wall, pressure plate and cover cap, backpan; sliding door: outer frame, sash, flyscreen if any); GTO task in parallel; team leaders sub-delegate to designers
- Snagging starts automatically create as-built drawing tasks per BOQ item and the seven QA/QC handover documents for the Project manager to delegate
- Traceability matrix from BOQ to MT, SC, CD, SD, MTO, site dimensions, CL, GTO and as-built with CSV download; hours worked can be logged with output and compared with the engineering budget; team leader output table
- Engineering KPI: RFIs answered by the reply deadline; the delivery KPI now covers cutting lists, GTO and as-built tasks
- Engineering KPIs use the same monthly results, ranking, Management review, approval lock, certificates of recognition and Setup targets and weights as the site KPIs; a rejected delegation now records how fast it is delegated again
- KPI visibility: people see the KPIs of the groups below their own role, never their own or a superior's, and the Main contractor sees none (Management sees all groups; the Project manager sees all except his own and above; Engineering manager sees team leaders, designers and junior designers; engineering team leaders see designers; site engineers see team leaders)
- Look-ahead KPI group moved from Team and admin to Planning
- Every delegation, in both modules, needs a start date and an end date (installation tasks, engineering submittals, cutting lists, GTO, take-offs, site-dimension survey and handover documents)
- Engineering quality check: all engineering output is checked by the Engineering team leader (before logging) and the Engineering manager (before release to the consultant, the Procurement manager or the output ranking); no separate quality engineer in engineering
- Rejected or returned documents go back to the team leader who logged them, who re-delegates the rework (list or QR badge, with dates), possibly to another designer
- Procurement manager receives the BMTO (bulk material take-off after material approval, for negotiation and the supply agreement), the MTO (released after shop-drawing approval, taken off the released BMTO, for delivery by the vendors) and the GTO (glass take-off, replaces the GPO)
- Contradictions between the package documents (IFC drawings, specifications, BOQ, schedule) are generated automatically by AI for Engineering manager and Project manager review (needs ANTHROPIC_API_KEY; BOQ-and-schedule rules run when the AI is unavailable); the study cannot be completed while items are open
- Output log records man-hours, so productivity (sqm per man-hour) is derived, tracked and ranked; sqm per man-hour is part of the engineering KPIs, and the fixed sqm targets are removed (scored against the best in the group unless a target is set in Setup)
- Take-off and cutting-list materials: cutting-list materials lists are no longer sent to procurement; only the BMTO, MTO and GTO are
- Engineering home screen shows what is waiting for you (per role: accept, delegate, rework, quality checks, approvals, replies) with one tap into the right tab
- Notifications can be acknowledged in groups per submittal and all non-alarm items at once; alarms are acknowledged one by one; toasts are capped at three
- Delegation dates are prefilled from the task duration set in Setup, including re-delegation after rework
- Pipeline per BOQ item (MT, SC, CD, SD, BMTO, MTO, dimensions, CL, GTO, as-built) in Overview and Traceability
- Who is holding what: each open item shows the person, the step and the days waiting; red after the days set in Setup; weekly one-page report (print or PDF)
- Engineering manager quality check queue with pass-all-ticked; returns still need a reason
- Returned work can be re-delegated to one designer in one step, by list or by one QR scan, with dates
- Document history and rework timeline per submittal; contradictions are shown as cards, two documents side by side
- Output logging: same-as-last man-hours, a timer, and warnings for odd output (very high sqm per man-hour, too many hours per person per day) shown to the checkers
- Ranking needs a minimum of man-hours in the month and can weight product families by difficulty (Setup); the same weights apply to the productivity KPI
- Man-hour burn-down against the budget and the plan
- Procurement manager can now log in: a Procurement tab lists the released BMTO, MTO and GTO with lines and delivery date, CSV download, and a sent-to-vendor tick that notifies engineering
- AI contradiction check is optional (off by default, switched on by the Engineering manager or Management in Setup); when off nothing is sent to the AI and the rules check can be run by hand; when on, the screen shows which files and pages the AI read and warns when none were read
- Phone layout: bigger controls, scrolling tab bar and tables as cards; high-contrast display switch; long cards fold
- Interface: notification request is now a small banner (not a full-screen pop-up) shown once per device, with Not now (7 days) and Don't ask again; hidden when notifications are blocked or unsupported
- Interface: Engineering tabs grouped into Overview, Start, Plan, Deliver and Close with a second row for the tabs of the chosen stage; roles with up to three tabs see a single row
- Interface: tables wrap long text at spaces and scroll inside their card instead of being cut off; page keeps space above the bottom bar
- Interface: notifications to acknowledge are collapsed into a one-line drawer that opens from the red tile
- Delete a project (Management; type the code; archived to the deleted folder first; blocked for projects with sub-projects and for the last project; late saves cannot recreate it)
- Setup > Delete uploaded data: delete the BOQ (only when no site records refer to it), the scope-level programme, the contract document and imported cutting lists; recorded in the activity log
- Delete the BOQ together with its site records (type DELETE ALL); backup copy saved on the server before every data deletion
- Archive a project: download a zip (state, library files, register documents, engineering records); a copy is also kept in the archives folder

## v22 - 2026-10-25 20:35
**Engineering module**

- Engineering header tab is live; new Engineering page with Overview, Submittals and BOQ mapping, Checklist, Programme, Baseline, Delegation and Submittal log
- New roles: Engineering manager, Team leader, Design engineer, Document controller; contacts for Engineering manager and Document controller in Setup
- Start notice to the Engineering manager on the contract start date; shared in-app notifications plus email to contacts
- Submittals mapped to one or many BOQ items (auto-group, packages, Excel import); checklist for calculations, materials, installation materials and shop drawings
- Programme with consultant review days, anticipated resubmittal and approval dates; automatic check against the engineering baseline set by the Project manager; justification and support request to Project manager and Management
- Project manager approval, delegation to team leaders and design engineers, accept or reject with justification
- Submittal log with document number, server link and BOQ codes; notifications to document controller, Engineering manager and Project manager
- Document controller records consultant responses; alarm after more than two rejections; reminders when planned dates lapse; engineering progress on the dashboard
- Engineering staff structure and review settings in Setup, editable only by the Engineering manager

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

