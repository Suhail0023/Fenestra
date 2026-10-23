setTimeout(async()=>{fixS();role="Project manager";USER={name:"PM"};
const L=leaves().filter(l=>l.qty>0&&l.dur);const a=L[0],b=L[1],c=L[2];a.st="plan";b.st="plan";c.st="plan";
a.start=add(T,20);b.start=add(T,4);c.start=nextWD21();if(c.start<=T)c.start=add(T,1);
S.logs=S.logs.filter(x=>true);
console.log("flags",flags().map(f=>f.lab+":"+f.l.id).join(","),"old ack kept",Object.keys(S.ack).length>=0);
console.log("rows",laRows().length,"alerts view",V.alerts().includes("1-month look-ahead"),"nav",NAV.find(n=>n[0]=="alerts")[1]);
la30Check();console.log("m30 marked",Object.keys(S.la.m30).length,"notif",NT.n.filter(n=>/look-ahead/i.test(n.t)).length);
LAv.tab="w7";console.log("w7 view",V.alerts().includes("Delegate to site engineer"));
S.la.items.forEach((_,i)=>laTick("a",b.id,i,true));set("la7e"+b.id,"Eng One");set("la7t"+b.id,"Team Alpha");laW7(b.id);console.log("w7",!!S.la.w7[b.id],S.la.w7[b.id]&&S.la.w7[b.id].ck.length);
role="Site engineer";LAv.tab="d1";console.log("d1 view",V.alerts().includes("Confirm doable"));
laD1(c.id,true);console.log("d1 blocked until ticked",!S.la.d1[c.id],LAv.msg);
S.la.items.forEach((_,i)=>laTick("b",c.id,i,true));laD1(c.id,true);console.log("d1 saved",S.la.d1[c.id]&&S.la.d1[c.id].ok);
console.log("flags after",flags().length);
// daily
const d1=add(T,-1);S.logs.push({t:a.id,d:d1,q:12,w:3,h:30,team:"Team Alpha"});a.start=add(T,-3);dayClose();console.log("snap",JSON.stringify(S.la.day[d1]));
console.log("dash card",V.dash().includes("Daily actual vs plan"));LAv.dt="month";console.log("month",V.dash().includes("This month"));
console.log("setup",V.setup().includes("Site location"));
WX.d[b.start]={code:63,t:30,w:40,r:5};console.log(wxFor(b.start).txt);
process.exit(0)},50)
