// ---- Rollover record, forecast finish, optional PM-applied forecast (additive; no existing data is changed unless the PM applies)
const _fx20=fixS;fixS=function(){_fx20();if(!S)return;if(!Array.isArray(S.roll))S.roll=[];if(!Array.isArray(S.fca))S.fca=[]};
const FCv={sel:{},why:"",msg:"",open:false};
const wdBetween=(a,b)=>{let n=0,x=a;while(x<=b){if(new Date(x).getUTCDay()!=0)n++;x=add(x,1)}return n};
const remQ=l=>r1(Math.max(0,(l.qty||0)-(l.ac||0)));
function fcTask(l){
 if(!l.start||l.st=="comp"||!l.dur||!(l.qty>0))return null;
 const rem=remQ(l);if(rem<=0)return null;
 const lg_=(S.logs||[]).filter(x=>x.t==l.id&&x.d).sort((a,b)=>a.d<b.d?-1:1),pe=end(l);
 if(!lg_.length&&pe>=T)return null;
 const plan=l.qty/l.dur;let rate=plan,src="planned";
 if(lg_.length){const f=lg_[0].d,lastD=lg_[lg_.length-1].d,upto=lastD>=T?T:(add(T,-1)>lastD?add(T,-1):lastD),wd=Math.max(1,wdBetween(f,upto)),q=lg_.reduce((a,x)=>a+(+x.q||0),0);if(q>0){rate=q/wd;src="actual"}}
 const n=Math.max(1,Math.ceil(rem/rate)),doneToday=lg_.some(x=>x.d==T),st0=(!doneToday&&new Date(T).getUTCDay()!=0)?T:addWD(T,1),fin=n>1?addWD(st0,n-1):st0,delay=Math.max(0,diff(pe,fin));
 return{l,rem,rate:r1(rate),plan:r1(plan),src,fin,pe,delay,team:l.team||"",carried:(S.roll||[]).filter(x=>x.id==l.id).length}}
const fcAll=()=>leaves().map(fcTask).filter(Boolean).sort((a,b)=>b.delay-a.delay||(a.fin<b.fin?-1:1));
function rollCheck(){
 if(new Date(T).getUTCDay()==0)return 0;S.roll=S.roll||[];let n=0;
 leaves().forEach(l=>{if(!l.start||l.st=="comp"||!l.dur||!(l.qty>0))return;const rem=remQ(l);if(rem<=0||end(l)>=T)return;
  if(S.roll.some(x=>x.d==T&&x.id==l.id))return;
  const days=wdBetween(add(end(l),1),T);
  S.roll.push({d:T,id:l.id,n:l.name,team:l.team||"",rem,days});n++;
  S.ev=S.ev||[];S.ev.push({d:T,tm:nowT(),id:l.id,n:l.name,ev:"Carried over",by:"system",note:rem+" m² remaining, same team "+(l.team||"-")+" ("+days+" working day"+(days>1?"s":"")+" past the planned finish)",u:"system"})});
 if(S.roll.length>3000)S.roll=S.roll.slice(-3000);
 if(n){save();if(PMR()){const k="roll"+T;if(!NT.done[k]){NT.done[k]=1;notify("Work carried over to today",n+" task"+(n>1?"s are":" is")+" past the planned finish with quantity remaining. Same team continues; see the forecast on the Schedule.")}}}
 return n}
const _chk20=chkAlerts;chkAlerts=function(){_chk20();try{rollCheck()}catch(x){}ntSave()};
// ---- apply: build a preview of the schedule changes
function fcPlan(ids){
 const ch={},get=l=>ch[l.id]||(ch[l.id]={l,s:l.start,d:l.dur,why:""}),L=leaves().filter(l=>l.start),E=[...autoLinks(),...S.xl].filter(x=>x.a&&x.b);
 const fe=c=>add(c.s,c.d-1);ids.forEach(id=>{const f=fcTask(L.find(l=>l.id==id)||{});if(f&&f.delay>0){const c=get(f.l);c.d=diff(f.l.start,f.fin)+1;c.why="forecast"}});
 let guard=0,moved=true;while(moved&&guard++<60){moved=false;
  Object.values(ch).forEach(a=>{const oldEnd=add(a.l.start,a.l.dur-1),newEnd=fe(a);if(newEnd<=oldEnd)return;
   E.filter(x=>x.a==a.l.id).forEach(x=>{const b=L.find(l=>l.id==x.b);if(!b||b.st=="comp"||(b.ac||0)>0)return;const c=get(b),sh=x.ty=="FS"?add(fe(a),1+(x.lag||0)):null;
    if(sh&&sh>c.s){c.s=sh;c.why=c.why||"follows "+a.l.name;moved=true}
    else if(!sh&&fe(c)<=fe(a)){c.s=add(c.s,diff(fe(c),fe(a))+1);c.why=c.why||"cannot finish before "+a.l.name;moved=true}})})}
 const rows=Object.values(ch).map(c=>({...c,ns:c.s,ne:fe(c),os:c.l.start,oe:end(c.l)})).filter(c=>c.ns!=c.os||c.ne!=c.oe).sort((a,b)=>a.os<b.os?-1:1);
 const bf=baseFin14(),late=rows.filter(c=>bf&&c.ne>bf),pf=L.reduce((m,l)=>{const c=ch[l.id];const x=c?fe(c):end(l);return x>m?x:m},"");
 return{rows,late,bf,pf}}
function fcSel(id,v){if(v)FCv.sel[id]=1;else delete FCv.sel[id];R()}
function fcAllSel(){fcAll().filter(f=>f.delay>0).forEach(f=>FCv.sel[f.l.id]=1);R()}
function fcApply(){
 if(!PMR()){alert("Only the project manager or planning engineer can apply the forecast to the schedule.");return}
 const ids=Object.keys(FCv.sel);if(!ids.length){FCv.msg="Tick at least one task first.";R();return}
 const w=document.getElementById("fcwhy"),why=(w&&w.value||FCv.why||"").trim();
 if(lnOn()&&!why){FCv.msg="The Lean planner is on. Give the reason for the change (shown in the lean change log).";R();return}
 const p=fcPlan(ids);if(!p.rows.length){FCv.msg="Nothing to change.";R();return}
 p.rows.forEach(c=>{const l=c.l;if(lnOn()){S.lean.chg=S.lean.chg||[];if(c.ne!=c.oe)S.lean.chg.push({d:T,by:who14(),id:l.id,n:l.name,f:"dur",from:l.dur,to:c.d,why:"Forecast applied: "+why});if(c.ns!=c.os)S.lean.chg.push({d:T,by:who14(),id:l.id,n:l.name,f:"start",from:l.start,to:c.ns,why:"Forecast applied: "+why})}
  l.start=c.ns;l.dur=c.d;S.ev.push({d:T,tm:nowT(),id:l.id,n:l.name,ev:"Forecast applied to schedule",by:role,note:fd(c.os)+"-"+fd(c.oe)+" to "+fd(c.ns)+"-"+fd(c.ne)+(c.why&&c.why!="forecast"?" ("+c.why+")":""),u:who14()})});
 const rec={no:S.fca.length+1,d:T,by:who14(),n:p.rows.length,late:p.late.map(c=>c.l.name),bf:p.bf,pf:p.pf,days:p.bf&&p.pf>p.bf?diff(p.bf,p.pf):0,why,eot:null,chg:p.rows.map(c=>({id:c.l.id,n:c.l.name,os:c.os,oe:c.oe,ns:c.ns,ne:c.ne}))};
 S.fca.push(rec);FCv.sel={};FCv.why="";FCv.msg=p.rows.length+" activit"+(p.rows.length>1?"ies":"y")+" updated"+(rec.days?". The programme now finishes "+rec.days+" days after the baseline; an EOT letter can be issued below.":".");
 notify("Forecast applied to the schedule",rec.n+" activities changed by "+who14()+(rec.days?"; finish is "+rec.days+" days after the baseline":""));save();R()}
function fcEotBody(rec){const F=fd1(),c=S.contacts["Main contractor"]||{};return head14("EOT/"+PC+"/PRG-"+rec.no,"The Main Contractor (cc "+(c.name||"")+")","NOTICE OF CLAIM FOR EXTENSION OF TIME - PROGRESS FORECAST").concat([
 "1. NOTICE","We give notice under Sub-Clause "+F.nt+" of the Conditions of Contract (FIDIC "+(S.fid&&S.fid.ed||"1999")+") that, on the updated programme of "+fd(rec.d)+", the Works cannot be completed by the Time for Completion and we are entitled to an Extension of Time under Sub-Clause "+F.eot+".","",
 "2. PARTICULARS","Completion date in the baseline programme: "+fd(rec.bf)+" "+rec.bf.slice(0,4),"Forecast completion on the updated programme: "+fd(rec.pf)+" "+rec.pf.slice(0,4),"Extension of Time claimed: "+rec.days+" days.","Activities finishing after the baseline completion: "+rec.late.join("; "),"",
 "3. RESERVATION","Full particulars, with the supporting records, will be submitted within the time allowed by Sub-Clause "+F.fullc+". We also reserve our entitlement to the associated Cost."]).concat(sign14()).join("\n")}
function fcEot(no){if(!PMR())return;const rec=S.fca.find(x=>x.no==no);if(!rec||rec.eot||!rec.days)return;const c=S.contacts["Main contractor"]||{},body=fcEotBody(rec),sub="Notice of claim for extension of time, programme forecast - "+PC;
 rec.eot={d:T,by:who14(),days:rec.days};sendMail14(c.email,sub,body).then(ok=>{rec.eot.sent=!!ok;S.mail=S.mail||[];save();R()});notify("EOT letter issued","Forecast finish is "+rec.days+" days after the baseline completion");save();R()}
function fcLetter(no){const rec=S.fca.find(x=>x.no==no);if(rec)htmlOut("<pre style='white-space:pre-wrap;font:14px/1.5 Arial'>"+e(fcEotBody(rec))+"</pre>","EOT-programme-"+no)}
// ---- views
function fcCard(gantt){
 const A=fcAll(),dl=A.filter(f=>f.delay>0),can=PMR(),ids=Object.keys(FCv.sel),pv=can&&ids.length?fcPlan(ids):null,my=S.roll.filter(x=>x.d==T);
 const row=f=>`<tr><td>${can&&f.delay>0?`<input type="checkbox" ${FCv.sel[f.l.id]?"checked":""} onchange="fcSel('${f.l.id}',this.checked)">`:""}</td><td><b>${e(f.l.name)}</b></td><td>${e(f.team)}</td><td>${fd(f.pe)}</td><td>${f.rem} m²</td><td>${f.rate} / ${f.plan}<br><small>${f.src}</small></td><td><b>${fd(f.fin)}</b></td><td style="color:var(${f.delay?"--bad":"--ok"})">${f.delay?"+"+f.delay+" d":"on time"}</td><td>${f.carried||""}</td></tr>`;
 let h=`<div class="c"><h3>📈 Forecast finish and carried-over work</h3><p class="m">Forecast = remaining quantity ÷ the team's actual daily output (planned rate until logs exist), working days only. Unfinished work stays with the same team and appears again in Today's tasks, with the target capped at what is left.</p>`;
 if(my.length)h+=`<div class="m"><b>Carried over today (${my.length}):</b> ${my.map(x=>e(x.n)+" - "+x.rem+" m² ("+e(x.team||"-")+")").join("; ")}</div>`;
 if(!A.length)return h+`<div class="m">No task is behind or in progress with quantity remaining.</div></div>`;
 h+=`<div style="overflow-x:auto"><table><tr><th></th><th>Task</th><th>Team</th><th>Planned finish</th><th>Remaining</th><th>Output m²/day<br><small>actual / plan</small></th><th>Forecast finish</th><th>Delay</th><th>Days carried</th></tr>${A.slice(0,60).map(row).join("")}</table></div>`;
 if(gantt){const mn=A.reduce((m,f)=>f.l.start<m?f.l.start:m,A[0].l.start),mx=A.reduce((m,f)=>f.fin>m?f.fin:m,A[0].fin),sp=Math.max(1,diff(mn,mx)+1);
  h+=`<div style="margin-top:8px">${A.slice(0,20).map(f=>{const a=diff(mn,f.l.start)/sp*100,b=(diff(f.l.start,f.pe)+1)/sp*100,c=Math.max(0,diff(f.pe,f.fin))/sp*100;return`<div style="display:flex;align-items:center;gap:6px;font-size:12px"><span style="width:150px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${e(f.l.name)}</span><div style="flex:1;position:relative;height:12px;background:var(--pn2,#0001)"><div style="position:absolute;left:${a}%;width:${b}%;height:100%;background:var(--ac,#4a90d9)"></div><div style="position:absolute;left:${a+b}%;width:${c}%;height:100%;background:var(--bad,#d44)"></div></div></div>`}).join("")}<div class="m">Blue = planned, red = forecast overrun.</div></div>`}
 if(can){h+=`<div style="margin-top:10px;border-top:1px solid var(--ln);padding-top:8px"><b>Apply the forecast to the schedule (optional, project manager or planner)</b><div class="m">Nothing changes unless you apply it. Tick the tasks; their duration is extended to the forecast finish, unstarted successors that would finish before it move later, and the result is checked against the baseline completion.</div>
  <button onclick="fcAllSel()" ${dl.length?"":"disabled"}>Tick all delayed (${dl.length})</button> <button onclick="FCv.sel={};R()" ${ids.length?"":"disabled"}>Clear</button>`;
  if(pv){h+=`<div style="overflow-x:auto;margin-top:6px"><table><tr><th>Activity</th><th>Now</th><th>After</th><th>Reason</th></tr>${pv.rows.map(c=>`<tr><td>${e(c.l.name)}</td><td>${fd(c.os)} - ${fd(c.oe)}</td><td>${fd(c.ns)} - ${fd(c.ne)}</td><td>${e(c.why)}</td></tr>`).join("")}</table></div>
   <div class="m">${pv.bf?`Baseline completion ${fd(pv.bf)}; programme would finish ${fd(pv.pf)}${pv.pf>pv.bf?` <b style="color:var(--bad)">(${diff(pv.bf,pv.pf)} days late)</b>`:" (within baseline)"}.`:"No baseline is frozen, so the baseline check is skipped."}${pv.late.length?`<br>Finishing after the baseline: ${pv.late.map(c=>e(c.l.name)).join("; ")}`:""}</div>`}
  if(lnOn())h+=`<div style="margin-top:6px"><input id="fcwhy" placeholder="Reason for the change (Lean planner is on)" style="width:60%" value="${e(FCv.why)}" oninput="FCv.why=this.value"></div>`;
  h+=`<div style="margin-top:6px"><button class="pri" onclick="fcApply()" ${ids.length?"":"disabled"}>Apply forecast to schedule (${ids.length})</button></div>`}
 if(FCv.msg)h+=`<div class="m"><b>${e(FCv.msg)}</b></div>`;
 const last=S.fca.slice(-5).reverse();if(last.length)h+=`<div style="margin-top:8px"><b>Applied forecasts</b>${last.map(r=>`<div class="m">#${r.no} ${fd(r.d)} by ${e(r.by)}: ${r.n} activities${r.days?`, finish ${r.days} days after baseline`:""}${r.why?" - "+e(r.why):""} ${r.days?(r.eot?`· EOT letter issued ${fd(r.eot.d)} <button onclick="fcLetter(${r.no})">View</button>`:(can?`<button onclick="fcEot(${r.no})">Issue EOT letter</button> <button onclick="fcLetter(${r.no})">Preview</button>`:"")):""}</div>`).join("")}</div>`;
 return h+"</div>"}
const _vp20=V.plan;V.plan=()=>_vp20()+fcCard(false);
const _vg20=V.gantt;V.gantt=()=>_vg20()+fcCard(true);
