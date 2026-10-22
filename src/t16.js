setTimeout(async()=>{fixS();role="Quality engineer";USER={name:"Q"};const L=leaves(),l0=L[0];
S.insp.push({no:"W1",tid:l0.id,n:l0.name,qty:50,s:"Approved",dd:add(T,-2)},{no:"W2",tid:l0.id,n:l0.name,qty:30,s:"Approved",dd:add(T,-1)},{no:"W3",tid:l0.id,n:l0.name,qty:10,s:"Pending",d:T});
console.log("view len",V.wir().length);set("wpkW1","x");document.getElementById("wpkW1").checked=true;document.getElementById("wpkW2").checked=true;set("wpn","note");wpaSend();await new Promise(r=>setTimeout(r,20));
const p=S.wp[0];console.log(p.no,p.wirs,p.st,S.insp[0].pk,p.doc.body.split("\n").length);
S.items.filter(i=>!i.p&&!i.vg).forEach(r=>r.cr=100);const m=T.slice(0,7),row=()=>ipaCalc(m).rows.reduce((a,x)=>a+x.cum,0);
console.log("wmc off qW",row());S.ipa.wmc=true;console.log("wmc on, before approval",row());set("wpd"+p.no,add(T,-1));wpaDecide(p.no,"Approved");console.log("after approval",row(),p.st);
// daily
role="Project manager";const l=L.find(x=>x.start&&end(x)>=T&&x.start<=T)||L[0];l.start=add(T,-3);l.dur=10;l.st="plan";l.t0=T+"x";S.logs=S.logs.filter(x=>x.t!=l.id);console.log("missing today",dailyMissing(T).length);S.logs.push({t:l.id,d:T,q:1,w:1,h:1});console.log("after log",dailyMissing(T).length);
S.logs.length=0;l.t0="";l.ac=5;console.log("started via ac",dailyMissing(add(T,-1)).length);dailyCheck();console.log("notif",NT.n.filter(n=>/daily/i.test(n.t)).length);
console.log("dash",V.dash().includes("Daily updates missing"));process.exit(0)},50)
