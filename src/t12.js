setTimeout(async()=>{fixS();role="Project manager";USER={name:"Pat"};const L=leaves();console.log("plan mh",Math.round(mhPlan()),"act",Math.round(mhAct()),"lvl",mhLevel());
mhSet(100000);console.log("est",S.mh.est,"base",mhBase());
// push logs to reach 55%
S.logs.push({t:L[0].id,d:T,q:10,w:50,h:1100,team:"Team Alpha"});console.log("act",mhAct(),"lvl",mhLevel());mhCheck();console.log("al",S.mh.al,"notif",NT.n.slice(0,1).map(n=>n.t));
S.logs.push({t:L[0].id,d:T,q:10,w:50,h:200});console.log("lvl",mhLevel());NT.done={};mhCheck();console.log("al",S.mh.al);
console.log("dash card",V.dash().slice(0,60).replace(/\s+/g," "));
set("vo_s","Extra mullion at core");set("vo_d","Add mullion");set("vo_q","120");set("vo_u","m2");set("vo_r","MC-17");set("vo_f","Eng Ali");set("vo_i",T);set("vo_k","Site");set("vo_t","Site engineer");
await voAdd();const v=S.vo[0];console.log("vo",v.no,v.st,v.due,v.docs.map(d=>d.k),VOv.err);const root=S.items.find(i=>i.vg);console.log("root",root.name,roll(root),kids(root.id).length);
set("pq"+v.no,"120");set("pr"+v.no,"850");set("pd"+v.no,"10");voProp(v.no);await new Promise(r=>setTimeout(r,20));console.log(v.st,v.prop);
voDecide(v.no,"Approved");
console.log("basefin",baseFin14());set("ss"+v.no,add(baseFin14(),-5));set("sd"+v.no,"20");set("sr"+v.no,S.rates.find(r=>/installation/i.test(r.k)).k);set("st"+v.no,"Team Alpha");voSched(v.no);await new Promise(r=>setTimeout(r,20));
console.log("sched",v.sched,"eot",v.eot,VOv.err,v.docs.map(d=>d.k));console.log("inst view",V.inst().length);
// rates
S.items.filter(i=>!i.p&&!i.vg).forEach((r,i)=>r.cr=100+i*10);RT.rows=[{d:"x",rt:900,key:"v"+v.no,name:"vo",on:true}];rtApply();console.log("vr",voItem(v).vr);
// WIR approved
const l0=L[0];S.insp.push({no:"W1",tid:l0.id,qty:50,s:"Approved",dd:add(T,-40)});S.insp.push({no:"W2",tid:l0.id,qty:30,s:"Approved",dd:add(T,-5)});
const c=ipaCalc(T.slice(0,7));console.log("ipa",c.cut,c.iss,Math.round(c.gross),Math.round(c.cur),Math.round(c.net),c.rows.length);
const f=fcCalc();console.log("fc",f.length,f.slice(0,2).map(x=>[x.m,Math.round(x.a),Math.round(x.f)]),"last",f[f.length-1].m,Math.round(f[f.length-1].cum));
ipaAuto();console.log("ipas",S.ipas.map(x=>[x.m,x.no,x.st]));ipaIssue(S.ipas[0].m);await new Promise(r=>setTimeout(r,20));console.log(S.ipas[0].st);
console.log("ipa view",V.ipa().length,"setup",V.setup().length);role="Planning engineer";console.log("planner tabs ipa/comm/inst",canTab("ipa"),canTab("comm"),canTab("inst"));role="Site engineer";console.log("site",canTab("inst"),canTab("ipa"));
fixS();console.log(typeof navHtml());process.exit(0)},50)
