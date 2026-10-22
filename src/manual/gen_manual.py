import os,io,sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import BaseDocTemplate,PageTemplate,Frame,Paragraph,Spacer,Image,Table,TableStyle,PageBreak,KeepTogether,ListFlowable,ListItem
from reportlab.platypus.tableofcontents import TableOfContents
from PIL import Image as PI
SH="/tmp/shots";OUT=sys.argv[1] if len(sys.argv)>1 else "Fenestra_User_Manual.pdf"
TEAL=colors.HexColor("#0f766e");INK=colors.HexColor("#1f2933");MUT=colors.HexColor("#5f6c7b");BG=colors.HexColor("#eef3f5")
st={"b":ParagraphStyle("b",fontName="Helvetica",fontSize=10,leading=14.5,textColor=INK,spaceAfter=5),
"h1":ParagraphStyle("h1",fontName="Helvetica-Bold",fontSize=19,leading=23,textColor=TEAL,spaceBefore=4,spaceAfter=8),
"h2":ParagraphStyle("h2",fontName="Helvetica-Bold",fontSize=12.5,leading=16,textColor=INK,spaceBefore=9,spaceAfter=4),
"m":ParagraphStyle("m",fontName="Helvetica-Oblique",fontSize=8.5,leading=11.5,textColor=MUT,spaceAfter=6),
"cell":ParagraphStyle("c",fontName="Helvetica",fontSize=8.6,leading=11.2,textColor=INK),
"cellb":ParagraphStyle("cb",fontName="Helvetica-Bold",fontSize=8.6,leading=11.2,textColor=colors.white),
"t1":ParagraphStyle("t1",fontName="Helvetica-Bold",fontSize=34,leading=40,textColor=TEAL),
"t2":ParagraphStyle("t2",fontName="Helvetica",fontSize=14,leading=20,textColor=INK)}
def P(t,s="b"):return Paragraph(t,st[s])
def steps(items):return ListFlowable([ListItem(P(x),leftIndent=14) for x in items],bulletType="1",bulletFontSize=9.5,leftIndent=16,bulletColor=TEAL)
def bullets(items):return ListFlowable([ListItem(P(x),leftIndent=12) for x in items],bulletType="bullet",start="•",leftIndent=14,bulletColor=TEAL)
def shot(name,cap):
    f=os.path.join(SH,name+".png")
    if not os.path.exists(f):return []
    im=PI.open(f).convert("RGB");w=900;im=im.resize((w,int(im.height*w/im.width)));b=io.BytesIO();im.save(b,"JPEG",quality=55,optimize=True);b.seek(0)
    ww=170*mm;img=Image(b,width=ww,height=ww*im.height/im.width);img.hAlign="CENTER"
    t=Table([[img]],colWidths=[172*mm]);t.setStyle(TableStyle([("BOX",(0,0),(-1,-1),.6,colors.HexColor("#c9d3da")),("LEFTPADDING",(0,0),(-1,-1),1),("RIGHTPADDING",(0,0),(-1,-1),1),("TOPPADDING",(0,0),(-1,-1),1),("BOTTOMPADDING",(0,0),(-1,-1),1)]))
    return [KeepTogether([t,P(cap,"m")])]
def table(rows,widths,head=True):
    d=[[Paragraph(str(c),st["cellb" if (head and i==0) else "cell"]) for c in r] for i,r in enumerate(rows)]
    t=Table(d,colWidths=widths,repeatRows=1 if head else 0)
    s=[("GRID",(0,0),(-1,-1),.4,colors.HexColor("#c9d3da")),("VALIGN",(0,0),(-1,-1),"TOP"),("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3)]
    if head:s.append(("BACKGROUND",(0,0),(-1,0),TEAL))
    for i in range(1,len(rows)):
        if i%2==0:s.append(("BACKGROUND",(0,i),(-1,i),BG))
    t.setStyle(TableStyle(s));return t
class Doc(BaseDocTemplate):
    def __init__(s,fn,**k):
        super().__init__(fn,pagesize=A4,leftMargin=19*mm,rightMargin=19*mm,topMargin=20*mm,bottomMargin=18*mm,title="Fenestra Site - User Manual",author="Fenestra Site",**k)
        s.addPageTemplates([PageTemplate("p",[Frame(s.leftMargin,s.bottomMargin,s.width,s.height,id="f")],onPage=s.deco)])
    def deco(s,c,d):
        c.saveState();c.setFont("Helvetica",8);c.setFillColor(MUT)
        if d.page>1:c.drawString(19*mm,10*mm,"Fenestra Site - User Manual");c.drawRightString(A4[0]-19*mm,10*mm,"Page %d"%d.page)
        c.restoreState()
    def afterFlowable(s,f):
        if isinstance(f,Paragraph) and f.style.name in("h1",):
            s.notify("TOCEntry",(0,f.getPlainText(),s.page));s.canv.bookmarkPage(str(id(f)));s.canv.addOutlineEntry(f.getPlainText(),str(id(f)),0,0)
E=[]
E+=[Spacer(1,60*mm),P("Fenestra Site","t1"),P("User Manual","t1"),Spacer(1,8*mm),P("Fenestration installation planning, delegation, quality, commercial and payment control, from BOQ to monthly IPA.","t2"),Spacer(1,40*mm),
 P("This manual follows the working order of a real project. Chapters 1 to 10 are the day-to-day workflow. The appendices cover the other tabs, alarms, roles and administration.","b"),PageBreak()]
toc=TableOfContents();toc.levelStyles=[ParagraphStyle("t",fontName="Helvetica",fontSize=10.5,leading=16,leftIndent=4)]
E+=[P("Contents","h2"),toc,PageBreak()]

E+=[P("How the application works","h1"),
P("Fenestra Site holds one project at a time (the project selector is at the top left). Everything you do is saved, logged with your name and the time, and shared with the other people on the project. The menu on the left is grouped by job: Overview, Planning, Resources, Site execution, Commercial, and Team and admin. You only see the tabs your role is allowed to use."),
P("The whole project in ten steps","h2"),
table([["#","Step","Main tab(s)","Who"],
["1","Upload the BOQ and the high-level installation P6 programme","Upload BOQ, P6 exchange","Project manager, planning engineer"],
["2","Create sub-BOQ items (building, level, elevation)","Upload BOQ, P6 exchange","Project manager"],
["3","Modify the schedule including the sub-BOQ items","Schedule, Lean planner, Installation Gantt","Project manager, planning engineer"],
["4","Delegate tasks: alerts from the schedule, pre-start checklist, send to site","Alerts, Delegate resources, Task delegation","Project manager"],
["5","Site engineer reviews and accepts or rejects tasks","Site (Invitations)","Site engineer"],
["6","Delegate to team leaders, clock in and out, daily results","Site, QR badges","Site engineer, team leaders"],
["7","Materials received, QA/QC check, MIR raised","Materials","Site engineer, quality engineer"],
["8","Task completion, QA/QC check, WIR raised, grouped and sent","Site, WIR log","Site engineer, quality engineer"],
["9","Record obstructions, instructions, snags and requests","Site, Instructions, Snagging, Requests","Everyone on site"],
["10","Weekly reports, monthly IPA and delay claims","Reports, Rates and IPA, Delay analysis","Project manager, Management"]],[8*mm,70*mm,50*mm,44*mm]),
Spacer(1,4*mm),P("Signing in","h2"),
steps(["Open the web address of your installation and enter your user name and password.","The first time, you must choose a new password of at least 8 characters.","New staff can press Sign up on the login screen. Their request waits in Setup for Management to approve and to confirm the role.","Use Password (top right) to change your password and Log out when you leave a shared device."]),
P("Getting help","h2"),P("Press <b>? Help</b> at the top right on any page for the guide for that page, a list of all topics, and common questions. Press Ctrl+K to search. If the AI guide is switched on by your administrator you can also ask questions in your own words. The language selector at the top offers English, Arabic, Hindi, Urdu, Filipino, Bengali, Tamil and Chinese; the layout switch at the top right changes between PC, iPad and phone views."),
PageBreak()]

E+=[P("1. Upload the BOQ and the high-level P6 programme","h1"),
P("<b>Who:</b> project manager, planning engineer (Management can do it too). <b>Where:</b> Upload BOQ, then P6 exchange."),
P("Upload the BOQ","h2"),
steps(["Open <b>Upload BOQ</b> and choose the Excel file of the bill of quantities.","Map the columns: item code, description and quantity, and choose the unit (m2, lm or nr).","Check the preview. A wrong column mapping is the most common mistake.","Confirm to load the BOQ. It appears in the <b>BOQ</b> tab as a tree with the live % complete and the WIR-approved % for each item."])]
E+=shot("bqup","Upload BOQ: choose the file, map the columns and confirm.")
E+=[P("Upload the high-level installation programme from P6","h2"),
P("If your planner has a summary Primavera P6 programme that lists only the main scopes (supply or production, and installation, each with a start and finish), you do not need to type dates."),
steps(["Open <b>P6 exchange</b>. Under <i>Scope-level program</i> choose the .xer or Excel file.","Pick the building (the WBS node) in the file and whether to use the current (early) dates or the planned (target) dates.","The app matches the activity names to the BOQ scopes and tells you how many matched. Names that do not match are listed.","Press <b>Generate detailed program</b>. Every BOQ item gets its own dates inside the window of its scope. The table shows the crew effort against the standard productivity: over 100% means the window is shorter than the standard allows, so more crews are needed.","Press <b>Apply detailed program to the schedule</b> to re-date the installation activities. A note is written in the activity log."]),
P("Progress is then reported at both levels: against the main-scope program and against each BOQ item, with planned %, actual %, variance and a forecast finish. You can download the result as Excel, and a detailed .xer for P6 (built by the server)."),
P("You can also use the ordinary P6 import (same tab) to take dates from a P6 file and apply them to matching activities after a preview.","m")]
E+=shot("p6","P6 exchange: upload the scope-level programme and generate the detailed program.")
E+=[PageBreak(),P("2. Create sub-BOQ items","h1"),
P("<b>Who:</b> project manager. <b>Where:</b> Upload BOQ (pop-up) or the BOQ tab."),
P("A BOQ line such as <i>Curtain wall frame</i> must be split into buildings, levels or elevations so that work can be planned, delegated and inspected where it actually happens."),
steps(["After importing the BOQ, the <i>Add sub-BOQ items</i> pop-up opens. Tick the BOQ lines to split.","Enter the <b>elevations</b> (for example EA, EB), the <b>levels</b> (for example 2nd, 3rd, 4th) and the <b>sub-products</b>, separated by commas. Leave a box empty to skip that dimension. Press Skip if a line should not be split.","The quantity of the line is shared equally between the resulting sub-items (elevation x level x sub-product). You can edit the quantities afterwards.","Each sub-item becomes its own activity in the schedule, with the standard duration worked out from the productivity rate, and the schedule is recalculated."]),
P("In the <b>BOQ</b> tab you can also use <i>Add BOQ item and split it</i> (code, description, area, elevations, levels, sub-products) to create a line with its sub-items in one step, and the <b>+ sub</b> button beside any line to add a sub-item by hand.","b"),P("Tip: keep the same level and elevation names everywhere. The Lean planner, progress photos, snagging and reports group work by those names.","m")]
E+=shot("boq","BOQ tab: live % complete and WIR-approved % for every sub-item.")
E+=[PageBreak(),P("3. Modify the schedule including sub-BOQ items","h1"),
P("<b>Who:</b> project manager, planning engineer. <b>Where:</b> Schedule, Lean planner, Installation Gantt, Baseline."),
steps(["Open <b>Schedule</b> to see every sub-BOQ item with start, duration, finish and the quantity.","Change a start date or duration, or move an activity earlier or later. If the Lean planner is switched on, the changes are made through the Lean planner so that each change gets a reason (see appendix A).","Check the result on the <b>Installation Gantt</b>.","When the programme is agreed, the planning engineer presses <b>Freeze baseline</b> in the Baseline tab. Later variances and extension of time claims are measured against it."])]
E+=shot("plan","Schedule: start, duration and finish for every sub-BOQ item.")
E+=[P("Rule of thumb: duration follows the standard productivity (quantity per team per day) in the Productivity rates tab. Management changes those rates, and changes may need approval.","m"),PageBreak(),
P("4. Delegate tasks, alerted from the schedule, with the checklist","h1"),
P("<b>Who:</b> project manager. <b>Where:</b> Alerts, Delegate resources, Task delegation."),
steps(["<b>Alerts.</b> The app raises flags at 3, 2 and 1 month before an activity starts (drawings and engineering approval, materials, site clearance, and so on). Open a fortnight group and tick each item when it is done.","<b>Delegate resources.</b> For activities starting within 30 days, work through the pre-start checklist (editable by the project manager) and the resources and materials. Missing items automatically trigger an email to the Main contractor or the Production department.","<b>Task delegation.</b> One week before the start, choose the task and the team. The app shows the manpower and duration from the standard rate. Press send. The site engineer receives an invitation."]),
P("The checklist is what stops an activity being released before it is ready. If a prerequisite is missing the app tells you, and the missing item is recorded in the activity log with date and time.")]
E+=shot("rdel","Delegate resources: the pre-start checklist and resources.")
E+=shot("rsend","Task delegation: send ready activities to the site engineer.")
E+=[PageBreak(),P("5. Site engineer reviews and accepts or rejects tasks","h1"),
P("<b>Who:</b> site engineer. <b>Where:</b> Site, Invitations."),
steps(["Open <b>Site</b>. Each delegated task appears under <i>Invitations</i> with quantity, manpower, duration and the prerequisites.","Check on site that every prerequisite is really available.","Press <b>Accept</b>, or <b>Revert</b> with the list of missing items and a note. A revert goes back to the project manager and is logged.","Accepted tasks move into your to-do list and <i>Today's tasks</i> when their start date comes."])]
E+=shot("site","Site tab: invitations, to-do list and today's tasks.")
E+=[PageBreak(),P("6. Delegate to team leaders, clock in and out, daily results","h1"),
P("<b>Who:</b> site engineer and team leaders. <b>Where:</b> Site, QR badges."),
P("Set up once","h2"),
steps(["In <b>QR badges</b> add the employees with their ID, role (team leader, installer, helper, foreman and so on) and team, then print or show each QR badge."]),
P("Every working day","h2"),
steps(["Under <i>Today's tasks</i> choose the team for the task (each team is led by its team leader) and the number of workers.","Each worker scans his QR badge: this clocks him in. Press <b>Start</b>.","During the day record any obstruction (see chapter 9).","At the end of the day enter the quantity installed (m2) and the hours, then press <b>Finish and log</b>. This clocks the team out and records the day's result: quantity, workers, hours and manhours."]),
P("The system stops impossible entries: the cumulative quantity can never exceed the BOQ quantity."),
P("Alarm if no daily update is made","h2"),
P("If a started activity is scheduled for the day but has no work logged, or the team was clocked in and not out, the app raises an alarm: for yesterday's missing updates at the first opening, and for today's from 17:00. The project manager and site engineers get a notification, and the project manager's dashboard shows a <i>Daily updates missing</i> list. Sundays are skipped."),
P("Manhours are also compared with the budget: the estimated manhour budget is set by the project manager in Setup, and an alarm is raised at 50% consumption and at every 10% after that (see appendix B).","m"),PageBreak(),
P("7. Materials: QA/QC check, then MIR","h1"),
P("<b>Who:</b> site engineer records, quality engineer approves, project manager assigns locations. <b>Where:</b> Materials."),
P("Set up once (project manager)","h2"),
bullets(["Add the <b>storage locations</b> (main store, laydown area, levels).","Edit the <b>delivery checklist</b>: quantities match the delivery note, items match the engineering cutting list, finish free of damage, consumables delivered, certificates provided, and so on.","Enter or import the <b>cutting list</b> issued by engineering, including the consumables needed for installation."]),
P("For every delivery","h2"),
steps(["The site engineer presses <b>Record delivery</b>: date, supplier, delivery note, material, the cutting-list item and BOQ line it belongs to, the quantity, and the equivalent BOQ quantity (used for the payment claim). Tick the checklist.","The project manager assigns the storage location.","The quality engineer inspects and presses <b>QA approve</b> or <b>Reject</b>. If checklist items are not ticked you are asked to confirm.","On approval an <b>MIR (material inspection request)</b> is raised automatically to the Main contractor with a formal letter that includes the checklist and the location.","When the Main contractor replies, log the decision (Approved, Approved with comments, Rejected) with its date."]),
P("The table <i>Engineering cutting list and consumables</i> compares what was required with what was delivered and QA-approved, and shows Complete, Short or Not delivered for every item, so you can tell at a glance whether everything on the cutting list has arrived.")]
E+=shot("mat","Materials: locations, checklist, cutting list, deliveries and MIR.")
E+=[PageBreak(),P("8. Task completion: QA/QC check, then WIR","h1"),
P("<b>Who:</b> site engineer requests, quality engineer checks and groups. <b>Where:</b> Site, WIR log."),
steps(["When a task or part of it is complete, the site engineer presses <b>Request WIR for completed quantity</b> (it is also raised automatically when a task reaches 100%).","In the <b>WIR log</b> the quality engineer opens the WIR, completes the inspection checklist (tick, pass/fail or value items) and adds photos.","Press <b>Approve</b>, or <b>Reject</b> with a reason and an optional photo. A rejected WIR is reworked and requested again.","<b>Group and send:</b> at the top of the WIR log, tick the WIRs that you have checked and press <b>Group and send</b>. They go to the Main contractor as one package (for example WIRP-001) with a covering letter listing every WIR, task and quantity.","Log the Main contractor's decision on the package (Approved or Rejected, with the date and comment)."]),
P("In Setup you can choose whether a WIR counts in the IPA from your own QA/QC approval, or only after the Main contractor approves the package.")]
E+=shot("wir","WIR log: inspections, approvals and grouping into packages.")
E+=[PageBreak(),P("9. Record obstructions, instructions and other site records","h1"),
P("<b>Obstructions (site engineer).</b> In <b>Site</b> use <i>Record obstruction</i>: choose the task, the type, the hours lost, a note and photos. They feed the weekly delay analysis and the FIDIC delay report."),
P("<b>Instructions from the Main contractor.</b> Open <b>Instructions</b>, enter the subject, who gave it, the date, whether it is a site or engineering instruction, and the description. When you record it:"),
bullets(["the Main contractor receives a formal letter saying the variation is under process and that a commercial proposal will follow;","Engineering and Commercial receive a copy with a deadline of 7 working days;","the item is added to the BOQ in a group called <b>Variations</b>."]),
P("The project manager then enters quantity, rate and time impact from Engineering and Commercial and issues the proposal letter, and records the Main contractor's decision. The project manager or planning engineer creates the schedule for the variation; if it finishes after the baseline completion date, an <b>extension of time letter</b> is issued automatically."),
P("<b>Other records.</b> Requests to other parties (material, clearance) are in <i>Requests</i> with automatic escalation when overdue. <i>Snagging</i> holds the snag list with drawing pins, photos and close-out; the quality engineer can also record a snag or de-snag inspection approval there. <i>Safety</i> holds permits, toolbox talks and incidents. <i>Progress photos</i> collects weekly photos per building and elevation. <i>Chat</i> and the <i>Activity log</i> keep the project record.")]
E+=shot("inst","Instructions: record, notify, price and schedule the variation.")
E+=[PageBreak(),P("10. Weekly reports, monthly IPA and delay claims","h1"),
P("<b>Who:</b> project manager, Management. <b>Where:</b> Reports, Delay analysis, Rates and IPA, Commercial."),
P("Reports","h2"),P("<b>Reports</b> holds the daily diary, weekly and monthly reports, which you can print or export to Excel. The <b>Dashboard</b> gives the live picture: plan versus actual, WIR-approved progress, manhours against budget, cumulative IPA against contract value, and WIR, MIR and variation orders raised versus approved."),
P("Monthly IPA","h2"),
steps(["In <b>Setup</b> the project manager sets the cut-off day and issue day of each month, and the claim percentages: materials on site with an approved MIR, installed work with an approved WIR, and work with its snag or de-snag inspection approved.","In <b>Rates and IPA</b> import the BOQ rates from Excel (visible only to Management and the project manager).","On the issue day a draft IPA is prepared automatically from the MIR, WIR and snag approvals up to the cut-off day, with retention. Review it and press <b>Issue to Main contractor</b>.","The same tab shows the <b>IPA forecast per month</b>, using the rates and the execution schedule, and the Excel download."]),
P("Delay analysis and claims","h2"),P("<b>Delay analysis</b> gives a weekly analysis with substantiation, and each month a delay report and extension of time claim letter based on FIDIC (1999 or 2017). The Main contractor's responses and the monthly notices are kept with the project record.")]
E+=shot("ipa","Rates and IPA: rates import, forecast and the monthly IPA.")
E+=[PageBreak(),P("Appendix A. Other tabs","h1"),
table([["Tab","What it does"],
["Lean planner","Optional guided Last Planner System: value and waste, takt zones, trade train, pull planning, make-ready and weekly PPC. The project manager or planning engineer chooses Yes or No. When on, the schedule is locked and changed only through the planner, with a reason for each change."],
["Installation Gantt / Baseline","Bar chart of the programme, and the frozen baseline for comparison."],
["Productivity rates","Standard quantity per team per day and team sizes, with an approval workflow."],
["Site tools","List the tools required, plan their disbursement to installers by employee ID, and get a store tools requisition form automatically. Mark tools issued and returned. The tool assignment log downloads as Excel."],
["Commercial","Contract rates and estimate cost, costs, labour cost per manhour, retention and the older progress invoice (visible to Management and the project manager)."],
["Claims / Delay analysis","Extension of time and delay documentation (see chapter 10)."],
["Portfolio","Projects, sub-projects, buildings, scopes and zones as a tree with rolled-up totals."],
["Team performance","Monthly ranking, points for on-time tasks, congratulation pop-ups and the team-of-the-month recommendation."],
["Progress photos","Upload photos (compressed automatically) tagged by building and elevation; slide through them per elevation. A reminder goes out every Saturday."],
["Safety / Snagging","Permits, toolbox talks, incidents; snag list with drawing pins."],
["Setup","Company details and logo, users and sign-up approvals, permissions by role, contacts, estimated manhour budget, IPA dates and percentages, email and WhatsApp, backups."],
["Alerts / Activity log","The pre-start alert list; every delegation, acceptance, revert, email and approval with date and time."]],[40*mm,132*mm]),
PageBreak(),P("Appendix B. Alarms and automatic actions","h1"),
table([["Event","What the app does automatically"],
["Activity starts within 3, 2 or 1 month","Pre-start alert for each unmet prerequisite; missing items trigger an email to the Main contractor or Production."],
["Task delegated","Invitation to the site engineer; accept or revert is logged."],
["Task finished on or before the planned date","Congratulation pop-up and points for the team; monthly ranking and team-of-the-month report."],
["No daily update on a started activity","Alarm for yesterday, and for today from 17:00; list on the project manager's dashboard."],
["Manhours reach 50%, then every 10%","Notification and email to the project manager against the estimated budget (or the plan if no budget is set)."],
["Material delivery approved by QA/QC","MIR raised and a letter sent to the Main contractor."],
["Instruction recorded","Acknowledgement letter to the Main contractor, copy to Engineering and Commercial with a 7 working day deadline; BOQ line added under Variations; alert if the deadline is missed."],
["Variation schedule ends after baseline completion","Extension of time letter issued."],
["Tool disbursement planned","Store tools requisition form created and emailed to the store keeper."],
["IPA issue day","Draft monthly IPA prepared and the project manager is notified."],
["Every Saturday","Reminder to site engineers to upload progress photos."],
["Request overdue","Escalation text to the Main contractor's escalation contact."]],[62*mm,110*mm]),
Spacer(1,5*mm),P("Emails and WhatsApp messages are sent by the server only if your administrator has configured them in Setup. Otherwise the letter text is kept with the record so that it can be copied and sent manually.","m"),
P("Appendix C. Who sees what","h1"),
table([["Role","Main tabs"],
["Management","Everything, plus users and permissions in Setup."],
["Project manager","Everything except user administration; sets the manhour budget, locations, checklists, IPA settings; sees rates and IPA."],
["Planning engineer","Planning, schedule, Lean planner, P6, delay analysis; does not see rates, IPA or commercial values."],
["Site engineer","Schedule, Gantt, Baseline, Site, WIR log, Snagging, Safety, Materials, Site tools, Instructions, Progress photos, Chat, Activity log, Alerts."],
["Quality engineer","Materials, WIR log, Snagging and related quality tabs."],
["HSE officer","Safety and site records."],
["Main contractor","Dashboard, Schedule, Installation Gantt and Baseline (read only)."],
["Production department","Chat and material requests."]],[40*mm,132*mm]),
P("Management can change any role's tabs in Setup under Permissions.","m"),PageBreak(),
P("Appendix D. Administration and troubleshooting","h1"),
P("First start and passwords","h2"),P("The first Management account is user name <b>management</b>. Its first password is the INIT_ADMIN_PASSWORD value that was set when the server was installed (or a random one printed once in the server log). You must change it at first login. If it is lost, delete users.json in the data folder and restart the server, which creates the management account again."),
P("Data and backups","h2"),P("All project data, users, photos and the audit log are stored in the server's data folder (the /data volume in Docker). Management can download a backup from Setup. Back the volume up regularly."),
P("Common questions","h2"),
table([["Question","Answer"],
["Why is the Schedule locked?","The Lean planner is on. Open the Lean planner and finish steps 1 to 4, or switch the Lean planner off there."],
["A WIR or MIR is not in the IPA.","Only approved items count, up to the cut-off day, and only for BOQ lines that have a rate. Check the MIR decision date and the Setup percentages."],
["The quantity was rejected.","A cumulative quantity cannot exceed the BOQ quantity. Check the BOQ line or split it correctly."],
["No emails are sent.","Ask the administrator to configure email in Setup; contacts must have an email address (Setup > Contacts)."],
["A tab is missing.","Your role does not include it. Management can change this in Setup > Permissions."],
["I cannot log in.","Check the user name and password. After several wrong attempts the account is locked for a short time. Management can reset passwords."]],[55*mm,117*mm])]
Doc(OUT).multiBuild(E)
print("ok",os.path.getsize(OUT))
