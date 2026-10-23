setTimeout(async()=>{fixS();role="Quality engineer";USER={name:"Quinn"};const l0=leaves()[0];
S.sigs["Quinn"]="data:image/png;base64,AAA";
S.insp.push({no:"W1",tid:l0.id,n:l0.name,qty:50,s:"Pending",c:["A","B"],d:add(T,-10),ph:[]});
console.log("age items",ageItems().map(x=>x.t+" "+x.ref+" "+x.age));
// snag
S.snags.push({id:99,no:"SN-001",tid:l0.id,loc:"L1",desc:"scratch",owner:"X",due:add(T,-2),s:"open",d:add(T,-9),ph:[],by:"QE",note:""});
snagAct(0,"fix");console.log("fix sig",S.snags[0].sgf,S.snags[0].sgfn);snagAct(0,"close");console.log("close sig",S.snags[0].sgc,S.snags[0].sgn);
// WIR approve through wirDec: need DOM results; set checks
const tpn=(S.wirTpl[S.insp[S.insp.length-1].sc||wirScope(l0)]||[]).length;console.log("tpl",tpn);S.insp[S.insp.length-1].c=["A"];S.wirTpl[S.insp[S.insp.length-1].sc||wirScope(l0)]=[{t:"A",ty:"tick"}];document.getElementById("wr"+(S.insp.length-1)+"_0").value="P";
await wirDec(S.insp.length-1,true);const w=S.insp[S.insp.length-1];console.log("wir",w.s,w.sn,w.sg);
// mir flow
role="Project manager";USER={name:"Pat"};S.sigs.Pat="data:image/png;base64,BBB";
set("dl_i","Frames");set("dl_q","10");set("dl_u","m2");set("dl_d",T);S.mt.chk.forEach((c,i)=>document.getElementById("dl_ck"+i).checked=true);delAdd();
const d=S.mt.del[0];delQA(d.id,true);console.log("qa sig",d.qa.sg,d.qa.sn);mirDecide(d.mir,"Approved");const m=S.mt.mir[0];console.log("mir sig",m.sg,m.sn,m.st);
htmlOut=(b,n)=>console.log('OUT',n,b.length);
wirReport(w.no);mirReport(m.no);snagReport("SN-001");snagReport("ALL");console.log("reports ok");
console.log("repCards",repCard("wir").length,repCard("mir").length,repCard("snag").length,V.wir().includes("Printable"),V.snag().includes("Printable"),V.mat().includes("Printable"));
// cutting list short
set("cl_i","Mullion");set("cl_t","Material");set("cl_u","nr");set("cl_q","100");set("cl_r","");set("cl_n",add(T,3));cutAdd();console.log("short",cutShort().length,V.mat().includes("needed soon"));
// tools
S.emps=S.emps||[];const em=S.emps[0];set("tc_n","Cup");set("tc_q","5");toolAdd();set("tp_e",String(em.id));set("tp_t","Cup");set("tp_q","1");set("tp_d",T);set("tp_r",add(T,-3));toolPlan();toolAct(S.tl.plan[0].id,"iss");S.tl.plan[0].iss=add(T,-5)+" 08:00";
console.log("tools out",toolsOut().map(x=>[x.out,x.od]),V.tool().includes("currently with installers"));
// dashboard
console.log("dash chase",V.dash().includes("Chasing list"));chkAlerts();console.log("notifs",NT.n.length);
// variation register
role="Project manager";S.vo.push({no:"INS-001",d:add(T,-4),idate:T,subject:"X",kind:"Site",st:"Proposal issued",prop:{amt:900,days:3,d:add(T,-2)},due:add(T,3),iid:0,docs:[],hist:[]});
console.log("reg",V.inst().includes("Variation register"),voRegister().includes("900"));voXlsx();
role="Planning engineer";console.log("planner reg no money",!voRegister().includes("AED 900"));
process.exit(0)},50)
