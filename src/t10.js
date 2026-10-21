setTimeout(async()=>{fixS();role="Management";const K=spScopeKeys();console.log("scopes",K.length,K.slice(0,3));
let x="%T\tPROJWBS\n%F\twbs_id\tparent_wbs_id\twbs_name\n%R\t1\t\tAV08_LR-001\n%R\t2\t1\tSUPPLY / PRODUCTION\n%R\t3\t1\tINSTALLATION\n%T\tTASK\n%F\ttask_id\twbs_id\ttask_code\ttask_name\ttask_type\tearly_start_date\tearly_end_date\ttarget_start_date\ttarget_end_date\tact_start_date\tact_end_date\tphys_complete_pct\n";
let i=0,d=1;K.forEach(k=>{const s="2026-11-"+String(1+i*3).padStart(2,"0"),f="2027-01-"+String(10+i*3);
 x+=`%R\t${100+i}\t3\tAV08-ALUM-INS-${100+i*10}\t${k}\tTT_Task\t${s} 08:00\t${f} 16:00\t${s} 08:00\t${f} 16:00\t\t\t0\n`;
 if(supName(k))x+=`%R\t${200+i}\t2\tAV08-ALUM-SUP-${100+i*10}\t${supName(k)}\tTT_Task\t2026-10-05 08:00\t2026-11-10 16:00\t2026-10-05 08:00\t2026-11-10 16:00\t\t\t0\n`;i++});
const f={name:"p.xer",text:async()=>x};SP.file="p.xer";
SP.acts=spFromXer(xerParse(x));console.log("acts",SP.acts.length,SP.acts[0]);SP.blds=[...new Set(SP.acts.map(a=>a.bld))];SP.bld=SP.blds[0];console.log("blds",SP.blds);spMatch();console.log("matched",SP.m.length,"unmatched",SP.un.length,SP.un.slice(0,3).map(a=>a.name));
spBuild();console.log("det",SP.det.length,"sum",SP.sum.length);console.log(SP.sum.slice(0,3).map(s=>[s.name,s.n,s.std,s.win,s.factor,s.note]));
const bad=SP.det.filter(z=>z.start<"2026-01-01"||z.fin<z.start||z.code.length>20);console.log("bad",bad.length);
const ids=new Set(SP.det.map(z=>z.code));console.log("unique codes",ids.size==SP.det.length);
// window containment
let out=0;SP.m.forEach(a=>SP.det.filter(z=>z.sc==a.code&&!z.fixed).forEach(z=>{if(z.start<a.s||z.fin>add(a.f,SP.sum.find(s=>s.code==a.code).win-(diff(a.s,a.f)+1)))out++}));console.log("outside window",out);
spApply();console.log("applied",S.dp.length,SP.msg);const g1=leaves()[0];g1.ac=g1.qty/2;
const P=spProgress();console.log(P.length,P.slice(0,2).map(p=>[p.a.name,p.pl,p.ac,p.det.length]));
console.log("card len",spCard().length,V.p6().length);spXlsx();process.exit(0)},50)
