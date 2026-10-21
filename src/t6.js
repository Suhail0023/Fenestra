setTimeout(async()=>{try{fixS();role="Project manager";
console.log("leaves",leaves().length,"zones",lnZones().length,"trades",lnTrades().length,lnTrades().join(" | "));
let h=V.lean();console.log("view len",h.length,/Learn this step first/.test(h));
// locked
upd(leaves()[0].id,"start","2030-01-01");console.log("locked msg",/Schedule is locked/.test(document.getElementById("lnm")?.innerHTML||"")||"modal?");
S.lean.learned={1:T,2:T,3:T,4:T,5:T,6:T};lnStep(1,true);lnStep(2,true);lnStep(3,true);
const cur=lnScore(lnCur()),P=lnProp(),pr=lnScore(P.res);console.log("cur",JSON.stringify(cur),"prop",JSON.stringify(pr),"shift",P.shift,"fin",P.fin);
h=V.lean();console.log("s4 shown",/Lean proposal/.test(h));
const n0=leaves().filter(l=>l.start).length;lnApply();console.log("approved",S.lean.approved,"starts",leaves().filter(l=>l.start).length==n0);
const l=leaves()[3];upd(l.id,"start",add(l.start,3));lnReasonOk(l.id,"start",add(l.start,3));console.log("chg",S.lean.chg.length);
h=V.lean();const a=leaves().filter(l=>diff(T,l.start)<=42)[0];if(a){["dwg","mat","lab","eqp","spc"].forEach(k=>lnCon(a.id,k,true));S.chk[a.id]=(itemsFor(a)||[]).map(()=>true);lnRel(a.id);lnCommit(a.id,true);lnRes(a.id,false,"Materials not on site");lnClose();console.log("ppc",lnPpc(lnWk()),lnWk().closed)}
h=V.lean();console.log("final view ok",h.length);lnUndo();console.log("undo",S.lean.approved==="");
re();console.log("re gate ok");
role="Planning engineer";V.plan();V.gantt();
}catch(x){console.log("FAIL",x.stack.slice(0,700))}process.exit(0)},50)
