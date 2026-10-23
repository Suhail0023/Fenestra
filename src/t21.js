setTimeout(async()=>{fixS();role="Project manager";USER={name:"PM"};
const L=leaves().filter(l=>l.qty>0&&l.dur);const a=L[0],b=L[1];
// attendance + timesheet
S.emps=[{id:"E1",name:"Ali",role:"Team leader",team:"Team Alpha"},{id:"E2",name:"Raj",role:"Installer",team:"Team Alpha"},{id:"E3",name:"Sam",role:"Installer",team:"Team Bravo"}];
const d1=add(T,-2);S.att=[{d:d1,t:a.id,id:"E1",name:"Ali",in:"07:00",out:"18:00"},{d:d1,t:a.id,id:"E2",name:"Raj",in:"07:30",out:""}];
const dh=dayHours([S.att[0]],d1);console.log("hours",JSON.stringify(dh),"dow",new Date(d1).getUTCDay());
TSv.p="day";TSv.d=d1;console.log("ts rows",tsRows(d1,d1).sum.length,V.ts().includes("Warning letters"));
S.wh.sunOT=true;console.log("sunday ot",JSON.stringify(dayHours([{in:"07:00",out:"15:00"}],"2026-10-18")));
// warnings: team alpha task active
a.team="Team Alpha";a.start=add(T,-5);a.dur=10;a.st="acc";S.hrStart=add(T,-5);S.warn=[];
console.log("expected",expectedOn(add(T,-1)).map(x=>x.em.id).join(","));
const n=warnCheck();console.log("warnings",n,S.warn.map(w=>w.no+":"+w.id+":"+w.n).join(","),(S.warn[0]||{body:""}).body.split("\n").length);
console.log("again",warnCheck());
// idle: team Bravo no task
const I=idleTeams();console.log("idle",I.map(x=>x.t+":"+x.sug.length).join(","),"(time "+nowT()+")");
console.log("dash idle",V.dash().includes("Idle teams")||nowT()<"09:00");
// contract
S.tc.text="1.1 Definitions\n8.4 Extension of Time for Completion: the Contractor shall be entitled to an extension of time.\n13.1 Variation instruction shall be in writing.\n20.1 Claims notice within 28 days.";S.tc.name="Contract.docx";S.tc.ov={eot:"44.1",ndays:"14",vcl:"13"};tcApply();
console.log("fd1 eot",fd1().eot,"letter",sign14.toString().length>0);
const body=head14("X","Y","NOTICE OF CLAIM FOR EXTENSION OF TIME").concat(sign14()).join("\n");console.log("eot note",body.includes("CONTRACT PROVISIONS"),body.includes("Notice period under the Contract: 14"),body.includes("extension of time"));
console.log("var note",head14("X","Y","VARIATION").concat(sign14()).join("\n").includes("Variation clause of the Contract: 13"));
console.log("setup",V.setup().includes("Contract terms and conditions"),V.setup().includes("Logistics teams"),V.setup().includes("Working hours"));
// tools look-ahead
a.st="plan";a.start=add(T,10);role="Project manager";console.log("tools flag",flags().some(f=>f.k.startsWith("la30t|"+a.id)));laTools(a.id,true);console.log("tools flag after",flags().some(f=>f.k.startsWith("la30t|"+a.id)));LAv.tab="m30";console.log("tools card",V.alerts().includes("Tools required"));
// danger
role="HSE officer";S.contacts["Main contractor"]={name:"MC",email:"mc@x.com"};
view="dg";console.log("dg view",V.dg().includes("Raise danger notice"));set("dgl","Level 5");set("dgd","Loose panel");set("dga","Barricade");set("dgs","High");set("dgt","0");dgAdd();console.log("dg",S.dg.length,S.dg[0].dist.length,Object.keys(S.dg[0].ack));
USER={name:"Other"};console.log("open for other",dgOpen().length);dgAck("DN-001");console.log("after ack",dgOpen().length);
// logistics
role="Project manager";USER={name:"PM"};lgAdd&&(set("lgn","LT1"),set("lgz","3"),set("lgq","200"),lgAdd());console.log("lg teams",S.lgt.teams.length,"chk has lg",(S.chkItems||[]).includes(LGIT),"need",lgNeed(a));console.log("rdel",V.rdel().includes("Logistics for activities"));
global.prompt=()=>'Sub';const kb=S.items.length;const c0=a;addKid(c0.id);console.log("addKid items +",S.items.length-kb);
// rewards
const tid=b.id;S.rwStart=add(T,-30);S.pts.push({id:1,d:T,team:"Team Alpha",t:tid,n:b.name,pts:100,why:"on time"});
console.log("rw1",rwState(S.pts[S.pts.length-1]).k);S.insp.push({no:"W9",tid,n:b.name,qty:5,s:"Approved",dd:T});console.log("rw2",rwState(S.pts[S.pts.length-1]).k);
rwAppr(1,"pm");console.log("rw3",rwState(S.pts[S.pts.length-1]).k);role="Management";rwAppr(1,"mg");console.log("rw4",rwState(S.pts[S.pts.length-1]).k);
console.log("perf",V.perf().includes("reward approval"));
// charts
const c=sCurve();console.log("scurve",c&&c.pts.length,c&&c.pts[c.pts.length-1].p.toFixed(0),chartCard().includes("<svg"),V.dash().includes("S-curve"));
console.log("nav",NAV.some(n=>n[0]=="ts"),canTab("ts","Site engineer"),canTab("dg","Main contractor"),canTab("ts","Quality engineer"));
process.exit(0)},50)
