/* ===== m26: Demonstration project (6BR Villa) and day-by-day simulation =====
   Everything here is additive. The simulation only touches the project whose state carries S.sim.on = true,
   and it writes ordinary records (logs, WIR, delays, IPA, ...) in the formats the rest of the app already reads. ===== */
const SIM_CODE="VILLA6BR",SIM_START="2026-10-01",SIM_END="2026-11-15";
const _fx26=fixS;fixS=function(){_fx26();if(!S)return;const d={on:false,date:"",auto:false,spd:6,prodDelay:.10,instDelay:.20,procDelay:5,engDelay:4,pk:{},log:[],seed:20261001,wx:{}};S.sim=Object.assign({},d,S.sim&&typeof S.sim=="object"&&!Array.isArray(S.sim)?S.sim:{});["log"].forEach(k=>{if(!Array.isArray(S.sim[k]))S.sim[k]=[]});["pk","wx"].forEach(k=>{if(!S.sim[k]||typeof S.sim[k]!="object"||Array.isArray(S.sim[k]))S.sim[k]={}});
 T=(S.sim.on&&S.sim.date)?S.sim.date:iso(new Date());try{window.SIMON=!!S.sim.on}catch(x){}};
/* quiet notifications while the simulator replays days */
const _notify26=notify;notify=function(){if(window.SIMQ)return;return _notify26.apply(this,arguments)};
/* tiny deterministic random generator so the demonstration is the same every time */
function simRnd(){let s=(S.sim.seed=((S.sim.seed*1103515245+12345)&0x7fffffff));return s/0x7fffffff}
const simDow=d=>new Date(d+"T00:00:00Z").getUTCDay(),simWork=d=>simDow(d)!=0;
const simNextW=d=>{let x=d,g=0;while(!simWork(x)&&g++<9)x=add(x,1);return x};
const simAddW=(d,n)=>{let x=d,k=0,g=0;n=Math.round(n);while(k<n&&g++<400){x=add(x,1);if(simWork(x))k++}return x};
/* ---------- the villa: scopes and quantities taken from the priced BOQ (Sections E and H) ---------- */
const VILLA={
 name:"Sharjah Villa 6BR (mock-up villa), Plot 2930, Umm Fannain",owner:"Azizi Developments",
 zones:["Ground floor","First floor","Roof"],
 /* [root name, uom, contract rate AED, rate-table key, scope tag, [qty GF, FF, Roof]] */
 roots:[
  ["Curtain wall and fixed glazing - frames","m2",793.65,"CURTAIN WALL FRAME INSTALLATION","CW",[156.14,8.73,32.61]],
  ["Curtain wall and fixed glazing - glass","m2",427.35,"CURTAIN WALL GLASS INSTALLATION","CW",[156.14,8.73,32.61]],
  ["Sliding doors","m2",774,"DOORS AND WINDOWS FRAME INSTALLATION","SD",[18.46,35.97,9.44]],
  ["Hinged doors","m2",774,"DOORS AND WINDOWS FRAME INSTALLATION","SD",[6.28,3.6,9.71]],
  ["Side-hung window","m2",755,"DOORS AND WINDOWS FRAME INSTALLATION","SD",[0,1.88,0]],
  ["Aluminium louver doors","m2",745,"LOUVERS INSTALLATION","LV",[7.44,0,0]],
  ["Aluminium fixed louver panels","m2",529,"LOUVERS INSTALLATION","LV",[0,0,21.6]],
  ["Aluminium access panel doors 800 x 800","nos",703,"LOUVERS INSTALLATION","LV",[0,0,2]],
  ["Staircase wall-mounted SS handrail","m",343,"STAIRCASE HANDRAIL INSTALLATION","BL",[8,12,0]],
  ["Glass balustrade 1200 high","m",703,"BALUSTRADE GLASS INSTALLATION","BL",[0,18,0]],
  ["Glass balustrade 1400 high","m",820,"BALUSTRADE GLASS INSTALLATION","BL",[0,0,46]],
  ["Shower glass partition","m",1369,"SHOWER PARTITION GLASS INSTALLATION","BL",[2,5.5,1.8]],
  ["Roof aluminium louver screen for MEP","m2",610,"LOUVERS INSTALLATION","LV",[0,0,54]],
  ["Aluminium canopy 4095 x 2750","nos",13626.11,"PERGOLA INSTALLATION","BL",[1,0,0]],
  ["Galvanised steel ladder for water tank","nos",973,"STAIRCASE HANDRAIL INSTALLATION","BL",[0,0,2]],
  ["Mirrors incl. fixing","nos",435.17,"SHOWER PARTITION GLASS INSTALLATION","BL",[3,6,0]]
 ]
};
/* planning parameters per scope: engineering approval, material arrival and production, in the baseline (1 Oct start) */
const VILLA_PLAN={
 CW:{eng:["2026-10-14"],mat:"2026-10-15",prod:{rate:25,start:"2026-10-15"},nm:"Curtain wall"},
 SD:{eng:["2026-10-14"],mat:"2026-10-15",prod:{rate:17,start:"2026-10-15"},nm:"Doors and windows"},
 LV:{eng:["2026-10-16"],mat:"2026-10-20",prod:{rate:15,start:"2026-10-20"},nm:"Louvers and panels"},
 BL:{eng:["2026-10-16"],mat:"2026-10-20",prod:null,nm:"Balustrade, partitions and metalwork"}
};
/* baseline installation plan: scheduled per team with the app's own productivity table, zone by zone */
function simPlanLeaves(rates){
 const zi=[0,1,2],startZ=["2026-10-19","2026-10-26","2026-11-02"],teams=["Team Alpha","Team Bravo","Team Charlie"],free={"Team Alpha":"","Team Bravo":"","Team Charlie":""};
 const L=[];let seq=0;
 zi.forEach(z=>{VILLA.roots.forEach((r,ri)=>{const q=r[5][z];if(!q)return;const rt=rates.find(x=>x.k==r[3])||{q:12,z:4};L.push({ri,z,q,rt,tag:r[4],name:r[0],uom:r[1]})})});
 /* teams: curtain wall, doors and windows to Alpha/Bravo; metalwork and louvers to Charlie */
 const teamOf=l=>l.tag=="CW"?(l.z==1?"Team Bravo":"Team Alpha"):l.tag=="SD"?"Team Bravo":"Team Charlie";
 const fstart={};
 L.forEach(l=>{l.team=teamOf(l);l.nt=l.tag=="CW"&&l.z==0?3:l.tag=="CW"&&l.z==2?2:l.tag=="LV"&&l.q>40?2:1;l.dur=Math.max(1,Math.ceil(l.q/(l.rt.q*l.nt)));l.seq=++seq});
 L.forEach(l=>{let s=startZ[l.z];const isGlass=/GLASS INSTALLATION/.test(l.rt.k)&&l.tag=="CW";if(isGlass){const f=L.find(x=>x.tag=="CW"&&x.z==l.z&&!/GLASS/.test(x.rt.k));if(f&&f.start)s=s>simAddW(f.start,3)?s:simAddW(f.start,3)}
  if(free[l.team]&&free[l.team]>s)s=free[l.team];l.start=simNextW(s);free[l.team]=simAddW(l.start,l.dur);l.end=simAddW(l.start,l.dur-1)});
 return L}
/* ---------- building the demonstration project ---------- */
function simStateVilla(base){
 const b=blankProj(SIM_CODE,"6BR Villa, Umm Fannain, Sharjah"),cp=o=>JSON.parse(JSON.stringify(o));
 b.rates=cp(base.rates);b.chkItems=[...(base.chkItems||CHK)];b.wirTpl=cp(base.wirTpl||defTpl());b.onb={open:false};
 b.proj={code:SIM_CODE,name:"6BR Villa, Umm Fannain, Sharjah"};
 b.fin=Object.assign({},base.fin||{},{cur:"AED",ret:5});b.ipa=Object.assign({},base.ipa,{pm:40,pw:90,ps:100,cut:25,iss:28,on:true,from:"2026-10"});
 /* a small fictional crew, so nobody's real record appears in the demonstration */
 const names=["Imran Qureshi","Farid Haddad","Joseph Reyes","Anil Thapa","Nasser Omar","Tariq Aziz","Ravi Menon","Samuel Okoro","Bilal Khan","Dennis Cruz","Ahmed Salim","Pradeep Nair","Yusuf Demir","Kamal Hossain","Rohan D'Souza","Mohan Lal","Hamza Yilmaz","Sunil Perera"];
 b.teams=["Team Alpha","Team Bravo","Team Charlie"];b.emps=names.map((n,i)=>({id:"V"+(1001+i),name:n,role:i%6==0?"Supervisor / Site team leader":i%6==1?"Foreman":"Installer",team:b.teams[i%3],site:SIM_CODE}));
 b.contacts={"Main contractor":{name:"Khalid Rahman (Azizi Developments, project engineer)",email:"",phone:""},"Project manager":{name:"Sara Mansoor",email:"",phone:""},"Site engineer":{name:"Raj Patel",email:"",phone:""}};
 b.fid=Object.assign({},base.fid||{},{ref:"VILLA-6BR",contract:"Aluminium and glazing sub-contract, Azizi Florence Villa-6BR",ed:"1999"});
 const L=simPlanLeaves(b.rates),tot=L.reduce((a,l)=>a+l.q*VILLA.roots[l.ri][2],0);let n=1,sq=0;const roots={};
 VILLA.roots.forEach((r,ri)=>{if(!L.some(l=>l.ri==ri))return;const id=n++;roots[ri]=id;b.items.push({id,p:0,name:r[0],qty:0,uom:r[1],cr:r[2],sc:r[4]})});
 L.forEach(l=>{const r=VILLA.roots[l.ri],id=n++;const z=VILLA.zones[l.z];b.items.push({id,p:roots[l.ri],name:r[0]+" / "+z,qty:Math.round(l.q*100)/100,uom:r[1],wtg:Math.round(l.q*r[2]/tot*10000)/100,lm:0,ac:0,sc:r[0],seq:l.seq,dur:l.dur,start:l.start,done:0,st:"plan",team:l.team,eng:l.tag=="CW"?"Omar K.":"Layla M.",rt:r[3],nt:l.nt,w:l.rt.z*l.nt});l.id=id});
 b.n=n;
 /* package chain (engineering, material, production) per leaf */
 const pk={};L.forEach(l=>{const P=VILLA_PLAN[l.tag],isFrameOrBody=!(l.tag=="CW"&&/GLASS/.test(l.rt.k)),prd=P.prod&&isFrameOrBody;pk[l.id]={tag:l.tag,eng:{p:P.eng[0],a:""},mat:{p:P.mat,a:""},pr:prd?{rate:(b.rates.find(x=>x.k==(l.tag=="CW"?"CURTAIN WALL FRAME PRODUCTION":"DOORS AND WINDOWS FRAME PRODUCTION"))||{q:P.prod.rate}).q,qty:Math.round(l.q*100)/100,done:0,s0:"",fin:"",p:P.prod.start}:null}});
 b.sim={on:true,date:"2026-09-30",auto:false,spd:6,prodDelay:.10,instDelay:.20,procDelay:5,engDelay:4,pk,log:[],seed:20261001,wx:{}};
 /* baseline = the plan as at 1 October */
 const t={};b.items.filter(i=>i.dur).forEach(i=>{t[i.id]={s:i.start,e:add(i.start,i.dur-1)}});b.base={d:SIM_START,by:"Planning engineer",t};
 return b}
/* ---------- one day of site life ---------- */
const simLg=(l,ev,note)=>{S.ev.push({d:T,tm:"17:30",id:l.id,n:l.name,ev,by:"Site engineer",note:note||"",u:"Raj Patel"})};
const simQ=(n)=>Math.round(n*100)/100;
function simLog(d,txt,kind){S.sim.log.push({d,t:txt,k:kind||""});if(S.sim.log.length>400)S.sim.log.splice(0,S.sim.log.length-400)}
function simDelay(d,l,cause,party,days,note,tag){const kk="dl|"+cause+"|"+(tag||l.id);if(S.sim.wx[kk])return;S.sim.wx[kk]=1;S.delays.push({id:S.n++,d,tid:l.id,cause,party,days,note:note||""})}
function simDay(d){
 const W=simWork(d),sm=S.sim,P=sm.pk,dly=sm;let any=false;
 /* engineering approvals, material arrival, production */
 Object.entries(P).forEach(([id,k])=>{const l=g(+id);if(!l)return;
  const eD=add(k.eng.p,Math.round(dly.engDelay*(k.tag=="CW"||k.tag=="SD"?1:.5))),mD=add(k.mat.p,Math.round(dly.procDelay*(k.tag=="CW"?1:k.tag=="SD"?.8:.4)));
  if(!k.eng.a&&d>=eD){k.eng.a=d;if(diff(k.eng.p,d)>0){simDelay(d,l,"Shop drawing approval received late",k.tag=="BL"?"Engineering":"Consultant",diff(k.eng.p,d),"Approved "+diff(k.eng.p,d)+" day(s) after the planned date",k.tag);simLog(d,"Shop drawings approved "+diff(k.eng.p,d)+" day(s) late ("+VILLA_PLAN[k.tag].nm+")","eng")}}
  if(!k.mat.a&&d>=mD){k.mat.a=d;if(diff(k.mat.p,d)>0){simDelay(d,l,"Materials delivered late by supplier","Supplier",diff(k.mat.p,d),"Aluminium / glass arrived "+diff(k.mat.p,d)+" day(s) after the planned date",k.tag);simLog(d,"Materials arrived "+diff(k.mat.p,d)+" day(s) late ("+VILLA_PLAN[k.tag].nm+")","proc")}}
  const pr=k.pr;if(W&&pr&&!pr.fin&&k.eng.a&&k.mat.a&&d>=pr.p){if(!pr.s0)pr.s0=d;const q=Math.min(pr.qty-pr.done,pr.rate*(1-dly.prodDelay)*(.9+simRnd()*.2)*(1+(l.team=="Team Alpha"?0:0)));pr.done=simQ(pr.done+q);S.sim.pl=S.sim.pl||[];S.sim.pl.push({d,k:+id,q:simQ(q)});if(pr.done>=pr.qty-.01){pr.fin=d;simLog(d,"Production complete: "+l.name,"prod")}}});
 if(!W)return;
 /* installation: each team works one task per day */
 const teams=S.teams.slice();
 teams.forEach(tm=>{const L=leaves().filter(l=>l.team==tm&&l.st!="comp").sort((a,b)=>a.seq-b.seq);
  for(const l of L){const k=P[l.id];if(!k)continue;const ready=k.eng.a&&k.mat.a&&(!k.pr||(k.pr.fin&&d>k.pr.fin)),after=d>=l.start;
   if(!after)break;
   let blocked="";if(!ready)blocked=!k.eng.a?"shop drawings not approved":!k.mat.a?"materials not on site":"frames not yet produced";
   /* glass follows the frame */
   if(!blocked&&/GLASS/.test(l.rt||"")&&(k.tag=="CW")){const f=leaves().find(x=>x.sc==l.sc.replace(" - glass"," - frames")&&x.name.split(" / ")[1]==l.name.split(" / ")[1]);if(f&&(f.ac||0)<f.qty*.6)blocked="frame not yet installed"}
   if(blocked){const key="b"+l.id+"|"+blocked;if(!sm.wx[key]){sm.wx[key]=1;S.obs.push({d,t:l.id,ty:blocked.includes("materials")||blocked.includes("frames")?"Material":"To be determined",h:10,n:l.name+": waiting, "+blocked,ph:[]});S.reqs.push({id:S.n++,to:"Production",tid:l.id,n:l.name,items:["Materials needed on site: "+blocked],d,due:add(d,3),s:"open",reply:"",dc:"",ch:"",b:"Please confirm the date; the crew is idle.",esc:"",eb:""});simLog(d,l.name+" waiting: "+blocked,"block")}continue}
   /* clear any open request for this task */
   S.reqs.forEach(r=>{if(r.tid==l.id&&r.s=="open"){r.s="closed";r.dc=d;r.reply="Delivered to site"}});
   const r=S.rates.find(x=>x.k==l.rt)||{q:12,z:4},wx=simDow(d)==6?.7:1,q0=r.q*(l.nt||1)*(1-dly.instDelay)*(.88+simRnd()*.24)*wx,q=Math.min(l.qty-(l.ac||0),simQ(q0)),w=r.z*(l.nt||1),hr=simDow(d)==6?6:9;
   if(!(q>0))continue;
   if(!l.t0&&(l.ac||0)==0){simLg(l,"Task started","Team "+tm);}
   S.logs.push({d,team:tm,t:l.id,w,h:hr,q,s:"07:30",f:hr>8?"17:30":"13:30"});
   const E=S.emps.filter(x=>x.team==tm).concat(S.emps.filter(x=>x.team!=tm)).slice(0,w);E.forEach(x=>S.att.push({d,t:l.id,id:x.id,name:x.name,in:"07:2"+(Math.floor(simRnd()*9)),out:hr>8?"17:3"+Math.floor(simRnd()*9):"13:3"+Math.floor(simRnd()*9)}));
   l.ac=simQ((l.ac||0)+q);l.done=r1(Math.min(100,l.ac/l.qty*100));l.st="acc";any=true;
   if(l.done>=99.99){l.ac=l.qty;l.done=100;l.st="comp";l.fa=d;simLg(l,"Task completed",l.qty+" "+l.uom);mkWir(l);simLog(d,"Completed "+l.name,"inst");
    const late=diff(end(l),d);S.pts.push({id:Date.now()+l.id,d,team:tm,t:l.id,n:l.name,pts:late<=0?100+Math.min(50,-late*10):0,why:late<=0?(late<0?"Finished "+(-late)+" day(s) early":"Finished on time"):"Finished "+late+" day(s) late"});
    if(late>0)simDelay(d,l,"Installation slower than planned",(l.team||"")+" / site",Math.max(1,late),"Installation finished "+late+" day(s) after the planned finish");}
   break}});
 /* weekly interim WIR for work in progress (Thursday), and QA/Main contractor approval 1 to 2 days later */
 if(simDow(d)==4)leaves().forEach(l=>{if(l.st=="acc")mkWir(l)});
 S.insp.forEach(x=>{if(x.s=="Pending"&&diff(x.d,d)>=(1+Math.floor(simRnd()*2))){if(x.no=="WIR-003"&&!sm.rej){sm.rej=1;x.s="Rejected";x.dd=d;x.by="Main contractor";x.note="Silicone joint at the head not continuous. Re-seal and re-submit.";x.ph=[];const l=g(x.tid);if(l&&l.st=="comp")l.st="acc";simLg(l||{id:x.tid,name:x.n},"WIR rejected "+x.no,x.note);S.snags.push({id:S.n++,no:"SN-"+String(S.snags.length+1).padStart(3,"0"),tid:x.tid,loc:x.n,desc:x.note,owner:"Team Alpha",due:add(d,2),s:"open",d,dc:"",dr:"",dw:0,px:"",py:"",ph:[],by:"Main contractor",note:""})}
   else{x.s="Approved";x.dd=d;x.by="Main contractor";x.ph=[];const l=g(x.tid)||{id:x.tid,name:x.n};simLg(l,"WIR approved "+x.no,x.qty+" m2")}}});
 /* snag follow-up */
 S.snags.forEach(s=>{if(s.s=="open"&&diff(s.d,d)>=2){s.s="closed";s.dc=d;s.dr=d}});
 /* resubmit rejected WIRs two days after the rejection */
 S.insp.filter(x=>x.s=="Rejected"&&!x.rs&&x.dd&&diff(x.dd,d)>=2).forEach(x=>{x.rs=1;S.insp.push({no:"WIR-"+String(S.insp.length+1).padStart(3,"0"),tid:x.tid,n:x.n,qty:x.qty,s:"Pending",c:x.c,d,dt:"15:00",dd:"",by:"",note:"",ph:[]})});
 /* monthly IPA: auto-prepared by the app on the cut-off, issued by the project manager */
 try{simScen(d)}catch(e2){console.log('simScen',e2)}
 try{ipaAuto()}catch(e1){}
 S.ipas.forEach(x=>{if(x.st=="Draft"&&d>=x.iss){x.st="Issued";x.by="Sara Mansoor";x.id=d;x.mail=false;x.body="";S.ev.push({d,tm:"09:00",id:0,n:x.no,ev:"IPA issued",by:"Project manager",note:"AED "+Math.round(x.net).toLocaleString(),u:"Sara Mansoor"})}});
 return any}

/* ---------- scheduled scenarios: every site event the app handles ---------- */
function simScen(d){
 const sm=S.sim,L=leaves(),n=diff(SIM_START,d),once=k=>{if(sm.wx["sc|"+k])return false;sm.wx["sc|"+k]=1;return true};
 const pick=i=>L[Math.min(L.length-1,i)],ev=(t,id,e,note)=>S.ev.push({d,tm:"10:00",id:id||0,n:t,ev:e,by:"Site team",note:note||"",u:"Site team"});
 const act=L.filter(l=>l.st=="acc");const a=act[0]||pick(0);
 if(n>=19&&once("tbt1")){S.tbt.push({id:S.n++,d,tid:0,topic:"Working at height and glass handling",by:"Site engineer",n:9,note:"All teams briefed before first installation"});simLog(d,"Toolbox talk: working at height and glass handling","safe")}
 if(n>=19&&once("ptw1")){S.ptw.push({id:S.n++,no:"PTW-001",tid:pick(0).id,type:"Work at height",vf:d,vt:add(d,14),s:"Approved",by:"Site engineer",ap:"Safety officer",d,note:"Scaffold tag green"});simLog(d,"Permit to work PTW-001 approved (work at height)","safe")}
 if(n>=22&&once("inc1")){S.inc.push({id:S.n++,d,ty:"Near miss",tid:a.id,desc:"Glass pane slipped from the A-frame during unloading. Nobody hurt.",act:"Area cordoned off, A-frame straps replaced, team briefed",s:"Closed",ph:[],by:"Site engineer"});simLog(d,"Near miss reported: glass slipped from the A-frame","safe")}
 if(n>=24&&once("wx1")){S.obs.push({d,t:a.id,ty:"Weather",h:6,n:"Strong wind: glass lifting stopped for the afternoon",ph:[]});simLog(d,"Weather obstruction: high wind, lifting stopped","obs")}
 if(n>=25&&once("acc1")){S.obs.push({d,t:a.id,ty:"Access",h:8,n:"Main contractor blocked the first-floor opening for MEP works",ph:[]});S.reqs.push({id:S.n++,to:"Main contractor",tid:a.id,n:a.name,items:["Clear the opening for installation"],d,due:add(d,2),s:"closed",reply:"Cleared the next day",dc:add(d,1),ch:"",b:""});simLog(d,"Access obstruction: first-floor opening blocked by MEP","obs")}
 if(n>=26&&once("danger")){S.inc.push({id:S.n++,d,ty:"Unsafe condition",tid:a.id,desc:"Unprotected slab edge next to the glazing line",act:"Danger notice issued, edge protection installed within 2 hours",s:"Closed",ph:[],by:"Safety officer"});simLog(d,"Danger notice: unprotected slab edge, closed same day","safe")}
 if(n>=27&&once("vo1")){const it=S.items[0];S.vo.push({no:"VO-001",d,tm:"11:00",by:"Sara Mansoor",role:"Project manager",idate:d,from:"Main contractor",mref:"MC-IR-014",kind:"Additional work",to:"Commercial",subject:"Add 2 No. fixed mirrors in the maid room",desc:"Added to the scope by the architect",qty:3.2,uom:"m2",iid:it?it.id:0,st:"Under process",due:add(d,7),docs:[],hist:[{d,e:"Instruction recorded"}],ref14:PC+"/VO-001"});simLog(d,"Variation VO-001 received: extra mirrors, 3.2 m2","comm")}
 if(n>=28&&once("tbt2")){S.tbt.push({id:S.n++,d,tid:0,topic:"Manual handling and PPE check",by:"Site engineer",n:12,note:""});simLog(d,"Toolbox talk: manual handling and PPE","safe")}
 if(n>=29&&once("idle")){S.obs.push({d,t:a.id,ty:"Resources",h:9,n:"Team Alpha idle: waiting for the glass delivery",ph:[]});simLog(d,"Team Alpha idle all day waiting for glass","obs")}
 if(n>=29&&once("claim")){S.delays.push({id:S.n++,d,tid:a.id,cause:"Main contractor access (EOT claim)",party:"Main contractor",days:2,note:"Notice of delay issued, extension of time requested for 2 days"});simLog(d,"Notice of delay and EOT claim: 2 days, access","comm")}
}
/* advance the simulation by n days (replays history quickly and silently) */
function simAdvance(n,quiet){n=Math.max(1,Math.round(n||1));window.SIMQ=true;try{for(let i=0;i<n;i++){const d=add(S.sim.date||add(SIM_START,-1),1);S.sim.date=d;T=d;S.sim.on=true;simDay(d)}}finally{window.SIMQ=false}if(!quiet){save();R()}}

/* ---------- creating the demonstration project from the app ---------- */
async function simCreate(){if(!["Management","Project manager"].includes(role)){alert("Management or the project manager creates the demonstration project.");return}
 if(PL.some(x=>x.code==SIM_CODE)&&!confirm("The project "+SIM_CODE+" already exists. Rebuild it from the start? Its data will be replaced.")){return}
 const b=simStateVilla(S);let ok=false;
 if(API){const r=await api("/api/project",{method:"POST",body:JSON.stringify({code:SIM_CODE,name:b.proj.name,state:b})});if(!r.ok&&!PL.some(x=>x.code==SIM_CODE)){alert((await r.json()).error||"Could not create the project");return}try{PL=await r.json()}catch(x){}}
 else{if(!PL.some(x=>x.code==SIM_CODE))PL.push({code:SIM_CODE,name:b.proj.name});try{localStorage.setItem("fx-projs",JSON.stringify(PL));localStorage.setItem(KEY+"-"+SIM_CODE,JSON.stringify(b))}catch(x){}}
 PC=SIM_CODE;try{localStorage.setItem("fx-pc",PC)}catch(x){}S=b;fixS();last="";simAdvance(30,true);try{S.eng&&0}catch(x){}save();view="dash";R();toast("Demonstration project ready: "+SIM_CODE+", simulated to "+fd(T))}
window.simCreate=simCreate;

/* ---------- simulation control view ---------- */
let simTm=null;
function simAuto(on){if(simTm){clearInterval(simTm);simTm=null}S.sim.auto=!!on;if(on){simTm=setInterval(()=>{if(add(S.sim.date||T,1)>"2026-11-30"){simAuto(false);return}simAdvance(1)},Math.max(500,(+S.sim.spd||3)*1000))}save();R()}
function simSet(k,v){S.sim[k]=+v;save();R()}
function simGo(){const d=document.getElementById("sim_d").value;if(!d||d<=S.sim.date)return alert("Choose a date after "+S.sim.date);simAdvance(diff(S.sim.date,d))}
V.sim=()=>{const sm=S.sim||{};if(PC!=SIM_CODE)return`<div class="c"><h3>Simulation</h3><div class="m">Create the demonstration project (6BR Villa, 1 Oct to 15 Nov 2026) and let the app run it day by day with planned delays.</div><button class="b" onclick="simCreate()">Create the demonstration project</button></div>`;
 const inp=(k,l,u)=>`<label>${l}<br><input type="number" value="${sm[k]}" step="${k.includes("Delay")&&k.startsWith("p")&&k!="procDelay"?.05:1}" style="width:90px" onchange="simSet('${k}',this.value)"> ${u}</label>`;
 return`<div class="c"><h3>Simulation: ${e(PC)}</h3><div class="m">Site date <b>${fd(sm.date)}</b>. The app plays the project day by day against its own programme, with the delays set below.</div>
 <div class="f"><button class="b" onclick="simAdvance(1)">+1 day</button><button class="b" onclick="simAdvance(7)">+1 week</button><label>Run to<br><input type="date" id="sim_d" value="${add(sm.date,14)}"></label><button class="b" onclick="simGo()">Go</button><button class="b" onclick="simAuto(${!sm.auto})">${sm.auto?"Stop auto-run":"Auto-run"}</button><label>Seconds per day<br><input type="number" min="1" value="${sm.spd||3}" style="width:70px" onchange="simSet('spd',this.value)"></label><button class="b" onclick="simCreate()">Rebuild from start</button></div>
 <div class="f" style="margin-top:8px">${inp("prodDelay","Production slower by (0.10 = 10%)","")}${inp("instDelay","Installation slower by (0.20 = 20%)","")}${inp("procDelay","Procurement delay","days")}${inp("engDelay","Engineering delay","days")}</div><div class="m">Delay settings apply from the next simulated day.</div></div>
 <div class="c"><h3>Latest events</h3>${(sm.log||[]).slice(-25).reverse().map(x=>`<div class="m"><b>${fd(x.d)}</b> ${e(x.t)}</div>`).join("")||"No events yet"}</div>`};
window.simAuto=simAuto;window.simSet=simSet;window.simGo=simGo;window.simAdvance=simAdvance;
if(!NAV.some(n=>n[0]=="sim"))NAV.push(["sim","Simulation"]);
(function(){const g2=GROUPS.find(x=>x[0]=="Team and admin");if(g2&&!g2[1].includes("sim"))g2[1].push("sim")})();
const _tabs26=tabsOf;tabsOf=function(r){const t=_tabs26(r).slice(),ok=["Management","Project manager"].includes(r),i=t.indexOf("sim");if(ok&&i<0)t.push("sim");if(!ok&&i>=0)t.splice(i,1);return t};
KB.sim={i:"🎬",t:"Simulation",d:"Plays the demonstration project day by day with planned delays so every module has live data.",who:"Management, project manager",steps:["Create the demonstration project.","Set the delay percentages.","Press Auto-run or advance by day or week."],tips:[],kw:"simulation demo test"};
try{if(typeof MENU!="undefined"&&!MENU.some(m=>m.id=="sim"))MENU.push({id:"sim",sec:"Project",grp:"Dashboard",lab:"Simulation (demo)",views:["sim"],h:"10000",r:"100000000000000000",tip:"Run the demonstration project day by day",x:1,hide:0})}catch(e){}
