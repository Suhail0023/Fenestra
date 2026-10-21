setTimeout(async()=>{try{fixS();role="Project manager";
console.log(navHtml().replace(/<[^>]+>/g,"|").replace(/\|+/g,"|").slice(0,300));
view="plan";console.log(pageHead().length>50);
console.log(answerHtml("why is the schedule locked").slice(0,160));
console.log(answerHtml("how do I upload photos of elevation").slice(0,120));
console.log(answerHtml("how to import p6 xer file").slice(0,100));
console.log(answerHtml("what can I do").slice(0,100));
console.log(answerHtml("zzz qqq").slice(0,80));
for(const t of["ask","page","start","all"]){HP.tab=t;drawHelp()}HP.tab="tour";HP.tk="lean";HP.tour=2;drawHelp();
cpOpen();CP.q="photo";console.log(cpItems().map(x=>x.l));
for(const r of ROLES){role=r;for(const k of kbTabs()){if(!KB[k])console.log("noKB",k)}}
NAV.forEach(([k])=>{if(!KB[k])console.log("missing KB",k)});
alert("hi");welcome(true);
for(const r of ROLES){role=r;for(const [k] of NAV){if(!canTab(k,r))continue;view=k;try{pageHead();V[k]()}catch(x){console.log("ERR",r,k,x.message)}}}
console.log("done")}catch(x){console.log("FAIL",x.stack.slice(0,800))}process.exit(0)},50)
