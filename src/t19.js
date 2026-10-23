setTimeout(async()=>{fixS();role="Project manager";USER={name:"PM"};
const L=leaves().filter(l=>l.qty>0&&l.dur);let a=L[0],b=L[1],c=L[2];
// a: started 6 days ago, dur 5, only 20% done => carried over
a.start=add(T,-6);a.dur=5;a.st="acc";a.team="Team Alpha";a.ac=a.qty*0.2;S.logs=S.logs.filter(x=>x.t!=a.id);
for(let i=6;i>=1;i--)S.logs.push({t:a.id,d:add(T,-i),q:a.ac/6,w:5,h:40,team:"Team Alpha"});
const snap=JSON.stringify(S.items.map(i=>[i.id,i.start,i.dur]));
console.log("rollCheck",rollCheck(),"again",rollCheck(),"roll",S.roll.length,S.roll[0]&&S.roll[0].rem);
const f=fcTask(a);console.log("fc",f&&{rem:f.rem,rate:f.rate,plan:f.plan,fin:f.fin,pe:f.pe,delay:f.delay,src:f.src});
console.log("views",V.plan().includes("Forecast finish"),V.gantt().includes("forecast overrun"));
console.log("unchanged before apply",snap==JSON.stringify(S.items.map(i=>[i.id,i.start,i.dur])));
// a successor on same team not started, starting inside delay window
b.st="plan";b.ac=0;
FCv.sel[a.id]=1;const p=fcPlan([a.id]);console.log("preview",p.rows.map(r=>[r.l.name.slice(0,20),r.os,r.oe,r.ns,r.ne,r.why]),"bf",p.bf,"pf",p.pf,"late",p.late.length);
role="Site engineer";fcApply();console.log("blocked for non-PM",S.fca.length);
role="Project manager";FCv.why="test";fcApply();console.log("applied",S.fca.length,a.dur,b.start,FCv.msg);
const r=S.fca[0];if(r){S.fca[0].days=5;S.fca[0].bf=add(T,10);S.fca[0].pf=add(T,15);S.fca[0].late=["x"];fcEot(1);await new Promise(x=>setTimeout(x,20));console.log("eot",!!S.fca[0].eot, fcEotBody(S.fca[0]).split("\n").length)}
console.log("ev",S.ev.filter(x=>/Carried|Forecast/.test(x.ev)).length);
process.exit(0)},50)
