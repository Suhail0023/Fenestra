setTimeout(async()=>{fixS();role="Project manager";USER={name:"Pat"};const L=leaves();
S.items.filter(i=>!i.p&&!i.vg).forEach((r,i)=>r.cr=100+i*10);
const r0=S.items.find(i=>!i.p&&!i.vg),ids=subL(r0),l0=ids[0];console.log("root",r0.name,"leaves",ids.length,"q",roll(r0));
set("dl_d",T);set("dl_s","Sup");set("dl_n","DN1");set("dl_i","Frames");set("dl_c","0");set("dl_l","r"+r0.id);set("dl_q","300");set("dl_u","m2");set("dl_b","300");S.mt.chk.forEach((c,i)=>document.getElementById("dl_ck"+i).checked=true);
delAdd();const d=S.mt.del[0];console.log(d.no,d.st,MTv.err);delLoc(d.id,"Main store");role="Quality engineer";delQA(d.id,true);await new Promise(r=>setTimeout(r,20));console.log(d.st,d.mir,S.mt.mir[0].doc.body.split("\n").length);
role="Project manager";set("md"+d.mir,add(T,-3));mirDecide(d.mir,"Approved");console.log(d.st,S.mt.mir[0].st);
let c=ipaCalc(T.slice(0,7));let row=c.rows.find(x=>x.key=="r"+r0.id);console.log("MIR qty",row.qM,"gross",Math.round(c.gross),"expected",300*row.rt*0.4);
// WIR on l0 then snag
S.insp.push({no:"W1",tid:l0.id,qty:100,s:"Approved",dd:add(T,-2)});c=ipaCalc(T.slice(0,7));row=c.rows.find(x=>x.key=="r"+r0.id);console.log("after WIR gross",Math.round(row.cumA),"expected",row.rt*(0.4*200+0.9*100));
role="Quality engineer";set("sir_t",String(l0.id));set("sir_d",T);sirAdd();c=ipaCalc(T.slice(0,7));row=c.rows.find(x=>x.key=="r"+r0.id);console.log("after SIR",Math.round(row.cumA),"expected",row.rt*(0.4*200+1.0*100),"qS",row.qS);
role="Project manager";const F=fcCalc();const tot=lines14().reduce((a,x)=>a+x.q*x.rt,0);console.log("fc months",F.length,"sum",Math.round(F.reduce((a,x)=>a+x.g,0)),"tot*ps",Math.round(tot*S.ipa.ps/100));
console.log("views",V.mat().length,V.tool().length,V.ipa().length,V.snag().length);
// tools
S.emps=S.emps||[];const em=S.emps[0];console.log("emp",em&&em.id);set("tc_n","Suction cup");set("tc_q","10");toolAdd();set("tp_e",String(em.id));set("tp_t","Suction cup");set("tp_q","2");set("tp_d",add(T,1));toolPlan();set("tp_e",String(em.id));toolPlan();
console.log("plan",S.tl.plan.length,"rq",S.tl.rq.length,S.tl.rq[0].rev,S.tl.rq[0].body.split("\n").length);toolAct(S.tl.plan[0].id,"iss");console.log(S.tl.plan[0].st);toolAct(S.tl.plan[0].id,"ret");console.log(S.tl.plan[0].st);tlXlsx();
for(const r of ["Project manager","Planning engineer","Site engineer","Management","Quality engineer","HSE officer","Main contractor"]){role=r;console.log(r,["mat","tool","inst","ipa"].map(k=>canTab(k)?1:0).join(""))}
process.exit(0)},50)
