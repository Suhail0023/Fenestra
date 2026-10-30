/* ===== m27: more demonstration data for the 6BR Villa (manpower budget, production, logistics, materials QA, weekly plan, huddle, planning engine) ===== */
function simSetup27(){const sm=S.sim;if(sm.wx.s27)return;sm.wx.s27=1;
 /* manhour budget and logistics */
 if(S.mh)S.mh.est=3000;
 if(S.lgt&&!S.lgt.teams.length)S.lgt.teams.push({name:"Logistics Team 1",size:3,q:250},{name:"Logistics Team 2",size:2,q:180});
 /* production, logistics and store people */
 const extra=[["Production manager","Khalid Mansour"],["Production engineer","Waleed Sabri"],["Production foreman","Dilip Kumar"],["Production foreman","Edgar Santos"],["Production team leader","Rashid Ali"],["Production team leader","Noman Sheikh"],["Production team leader","Jomon Thomas"],["Site logistics","Ismail Hassan"],["Storekeeper","Gopal Das"]];
 extra.forEach((x,i)=>{if(!S.emps.some(e=>e.name==x[1]))S.emps.push({id:"V"+(2001+i),name:x[1],role:x[0],team:/Production/.test(x[0])?"Production":"Logistics",site:SIM_CODE})});
 if(S.pm&&!S.pm.stock.length)[["Silicone sealant (structural)","tube",120],["Setting blocks and spacers","set",60],["Stainless steel screws M6","box",40],["Backer rod 10 mm","m",300]].forEach(x=>S.pm.stock.push({id:++S.pm.n,item:x[0],uom:x[1],qty:x[2],rec:SIM_START,loc:"Main store",bk:[]}));
 /* planning engine: realistic durations for a villa from the notice to proceed */
 const pe=S.pe;pe.ntp=SIM_START;
 [...peTrades().keys()].forEach(n=>peCfg(n));Object.keys(pe.tr).forEach(n=>{const c=pe.tr[n];(c.pre||[]).forEach(s=>{s.days=Math.max(1,Math.round(s.days/4))});(c.mats||[]).forEach(m=>{m.lead=Math.min(+m.lead||7,10)})});
 /* marked-up drawing interface and openings for cutting optimisation */
 if(!pe.ifc.length)pe.ifc.push({id:"if1",name:"Roof slab and MEP platform handover",zone:"Roof",anchor:"start",lag:2,note:"Main contractor completes the roof waterproofing before roof glazing"});
 if(!pe.cut.open.length)[["CW-1",1800,2700,6],["CW-2",1200,2700,8],["CW-3",900,2400,4],["SD-1",2400,2400,2]].forEach((o,i)=>pe.cut.open.push({id:"op"+i,frame:o[0],w:o[1],h:o[2],qty:o[3],mullN:1,mull:"MU-1"}))}
function simPlanActs(d){const pe=S.pe,P=S.sim.pk;Object.keys(pe.tr).forEach(n=>{const l=leaves().find(x=>x.sc==n&&P[x.id]);if(!l)return;const k=P[l.id],c=pe.tr[n];pe.act[n]=pe.act[n]||{};(c.pre||[]).forEach(s=>{if(pe.act[n][s.id])return;
   if(s.kind=="approve"&&/shop/i.test(s.name)){if(k.eng.a&&d>=k.eng.a)pe.act[n][s.id]=k.eng.a}
   else if(/material/i.test(s.name)&&s.kind=="approve"){if(k.mat.a&&d>=add(k.mat.a,-3))pe.act[n][s.id]=add(k.mat.a,-3)}
   else{const dd=add(SIM_START,Math.round(s.days));if(d>=dd)pe.act[n][s.id]=dd}})})}
/* weekly work plan, PPC, huddle */
function simWeekly(d){const sm=S.sim,ws=(()=>{let x=d;while(simDow(x)!=1)x=add(x,-1);return x})();
 if(simDow(d)==1||!(S.mr.wp[ws])){if(!S.mr.wp[ws]){const W=S.mr.wp[ws]={c:[]};leaves().filter(l=>l.st!="comp"&&l.start<=add(ws,6)&&(S.sim.pk[l.id]||{}).eng&&(S.sim.pk[l.id].eng.a)).forEach(l=>{const q=Math.min(l.qty-(l.ac||0),Math.max(1,(S.rates.find(r=>r.k==l.rt)||{q:12}).q*(l.nt||1)*5));W.c.push({id:++S.mr.n,act:l.id,q:Math.round(q*10)/10,team:l.team||"",tl:"Site team leader",by:"Site engineer",d:ws,tm:"07:45",st:"plan",rdy:true,ov:"",late:false,log:[],q0:l.ac||0})})}}
 /* close last week on Saturday */
 if(simDow(d)==6){const W=S.mr.wp[ws];if(W)W.c.forEach(c=>{if(c.st!="plan")return;const l=g(c.act);if(!l)return;const got=S.logs.filter(x=>x.t==l.id&&x.d>=ws&&x.d<=d).reduce((a,x)=>a+x.q,0),ok=got>=c.q*.9;c.aq=Math.round(got*10)/10;c.st=ok?"done":"missed";if(!ok){const k=S.sim.pk[l.id]||{};c.why=!k.mat||!k.mat.a?"Materials not on site":!k.pr||k.pr.fin||!k.pr.p?"Crew not available":"Materials not on site";if(got>0)c.why=got<c.q*.5?"Equipment or tools":"Weather"}c.log.push({d,t:ok?"Done":"Missed: "+(c.why||""),by:"Site engineer"})})}
 /* daily huddle */
 if(simWork(d)){const tp=S.mr.cfg.topics[Math.floor((new Date(d)-new Date(d.slice(0,4)+"-01-01"))/864e5)%S.mr.cfg.topics.length];S.mr.hd[d]={by:"Raj Patel",tm:"07:20",att:16+Math.floor(simRnd()*5),note:simDow(d)==6?"Half day. Early finish at 13:30.":"Crew briefed on today's plan and blockers.",topic:tp}}}
/* materials: deliveries to site, QA and MIR */
function simMat(d){if(!S.mt)return;const P=S.sim.pk,tags=[...new Set(Object.values(P).map(k=>k.tag))],NM={CW:["Aluminium curtain wall profiles","Glass units 6+12+6"],SD:["Aluminium door and window profiles","Tempered glass 10 mm"],LV:["Louver profiles and panels","Fixing accessories"],BL:["Toughened glass 12 mm","SS 316 handrail and fittings"]};
 tags.forEach(t=>{const k=Object.values(P).find(x=>x.tag==t);if(!k||!k.mat.a||d<k.mat.a)return;NM[t].forEach((nm,i)=>{const key="mt|"+t+i;if(S.sim.wx[key])return;S.sim.wx[key]=1;
   const ids=Object.keys(P).filter(x=>P[x].tag==t).map(Number),dl={id:++S.mt.n,no:"DEL-"+String(S.mt.del.length+1).padStart(3,"0"),d:k.mat.a,sup:i?"Emirates Glass Trading":"Gulf Extrusions LLC",dn:"DN-"+(4100+S.mt.del.length),item:nm,cl:"",line:"",q:i?120:3200,u:i?"m2":"kg",bq:ids[0]||0,ck:[true,true,true,true,true,true,true,true],chk:S.mt.chk.slice(),st:"Received",loc:S.mt.locs[i%3],by:"Site logistics",qa:null,mir:""};
   S.mt.del.push(dl);const rej=(t=="BL"&&i==0);dl.qa={ok:!rej,by:"QA/QC",d:add(k.mat.a,1),note:rej?"Two glass panes chipped at the edge. Return to supplier.":""};dl.st=rej?"Rejected":"Accepted";
   if(!rej){const m={no:"MIR-"+String(S.mt.mir.length+1).padStart(3,"0"),did:dl.id,d:add(k.mat.a,1),st:"Approved",dd:add(k.mat.a,2),by:"Main contractor",note:"",doc:null};S.mt.mir.push(m);dl.mir=m.no;dl.st="MIR approved"}
   else{S.mt.sor=S.mt.sor||[];S.mt.sor.push({no:"SOR-001",d:add(k.mat.a,1),mir:"",did:dl.id,item:nm,q:12,u:"m2",sup:dl.sup,dn:dl.dn,loc:dl.loc,reason:dl.qa.note,st:"Raised",by:"QA/QC",hist:[{d:add(k.mat.a,1),e:"Rejected at incoming inspection"}],mail:[]})}})})}
/* production: cutting list, delegation chain, daily output, packing and delivery note */
function simProd(d){if(!S.prd)return;const P=S.prd,E=S.eng,sm=S.sim;if(!E)return;
 Object.entries(sm.pk).forEach(([id,k])=>{if(!k.pr||!k.pr.s0)return;const l=g(+id);if(!l)return;const key="pc|"+id;let cl=E.cl.find(c=>c.simk==key);
  if(!cl){const cid=E.cl.length?Math.max(...E.cl.map(c=>c.id))+1:1;cl={id:cid,no:"CL-"+String(cid).padStart(3,"0"),kind:"CL",part:l.name.split(" / ")[1],sd:0,boq:l.id,src:"ifc",tl:0,acc:"accepted",st:"issued",iss:{no:"CL-"+String(cid).padStart(3,"0"),sqm:k.pr.qty,d:add(k.pr.s0,-2),mat:[]},hist:[{d:add(k.pr.s0,-2),e:"Issued to production"}],simk:key};E.cl.push(cl);P.c.push({id:++P.n,cl:cl.id,no:cl.iss.no,rcv:k.pr.s0,rcvT:"08:00",rd:{ans:"",ask:Date.now(),due:Date.now()+P.cfg.rd*3600000,by:"",d:"",note:"",log:[]},stock:false,pr:undefined,pin:"",hold:false,proc:"",prev:0,fin:false})}
  const r=P.c.find(x=>x.cl==cl.id&&!x.rej);if(!r)return;
  if(r.rd.ans==""){r.rd.ans="ready";r.rd.by="Raj Patel";r.rd.d=k.pr.s0;r.rd.log.push({t:Date.now(),e:"Site confirmed ready",by:"Raj Patel"})}
  let tk=P.tk.find(x=>x.cl==r.id);const pn=l.tag=="CW"||k.tag=="CW"?"Curtain wall":"Doors outer";
  if(!tk){const pr=P.proc.find(p=>p.name==pn)||P.proc[0];tk={id:++P.n,cl:r.id,no:r.no,boq:l.name,proc:pr.name,line:pr.line||"",unit:"m²",qty:k.pr.qty,start:k.pr.s0,end:k.pr.p&&add(k.pr.s0,Math.ceil(k.pr.qty/Math.max(1,k.pr.rate))),workers:6,mh:Math.round(k.pr.qty/Math.max(1,k.pr.rate)*6*10),hrs:10,eng:"Waleed Sabri",by:"Khalid Mansour",d:k.pr.s0,ea:k.pr.s0,st:"In progress",fa:[],hist:[{d:k.pr.s0,e:"Delegated to Waleed Sabri by Khalid Mansour"},{d:k.pr.s0,e:"Accepted by Waleed Sabri"}]};
   const f={id:++P.n,line:tk.line,name:pn=="Curtain wall"?"Dilip Kumar":"Edgar Santos",qty:k.pr.qty,from:k.pr.s0,to:tk.end,tla:[]};f.tla.push({id:++P.n,name:pn=="Curtain wall"?"Rashid Ali":"Noman Sheikh",eid:"",qty:k.pr.qty,from:k.pr.s0,to:tk.end,via:"list",crew:[],done:""});tk.fa.push(f);P.tk.push(tk)}
  const f=tk.fa[0],ta=f.tla[0];
  (sm.pl||[]).filter(p=>p.k==+id&&p.d<=d&&!p.lg).forEach(p=>{p.lg=1;const w=5+Math.floor(simRnd()*3),hrs=9;P.lg.push({id:++P.n,d:p.d,cl:r.id,tk:tk.id,fa:f.id,ta:ta.id,by:ta.name,proc:tk.proc,s:"07:30",e:"17:00",w,mh:Math.round(w*9.5*10)/10,qty:p.q,note:""})});
  if(k.pr.fin&&d>=k.pr.fin&&!P.pl.some(x=>x.cl==r.id)){tk.st="Complete";P.pl.push({id:++P.n,no:PC+"-PL-"+String(++P.nn).padStart(3,"0"),cl:r.id,clno:r.no,d:k.pr.fin,qty:k.pr.qty,cum:100,part:false,lines:[],st:"Packing",by:"Edgar Santos",qa:null,dn:null,boqN:l.name})}});
 /* quality check, delivery note, dispatch and receipt at site */
 P.pl.forEach(p=>{if(!p.qa&&d>=p.d){p.qa={ok:true,by:"QA/QC",d:p.d}}
  if(p.qa&&!p.dn&&d>=add(p.d,1)){p.dn={no:"DN-"+PC+"-"+String(++P.dn).padStart(3,"0"),d,by:"Ismail Hassan",q:p.qty};p.st="DN issued";const r=P.c.find(x=>x.id==p.cl),c=r?E.cl.find(x=>x.id==r.cl):null,l=c?g(c.boq):null;
   S.lg.dl.push({id:++S.lg.n,no:"DLV-"+String(S.lg.dl.length+1).padStart(3,"0"),pl:p.id,dn:p.dn.no,clno:p.clno,boq:l?l.name:"",boqId:l?l.id:0,qty:p.qty,part:false,cum:100,want:simNextW(add(d,1)),created:Date.now(),ack:{pm:{ok:true,by:"Sara Mansoor",d},se:{ok:true,by:"Raj Patel",d},qa:{ok:true,by:"QA/QC",d}},ck:{},pin:0,disp:null,rcv:null,log:[{d,t:"DN "+p.dn.no+" issued: delivery planned"}]})}
  const dl=S.lg.dl.find(x=>x.pl==p.id);if(dl&&!dl.disp&&d>=dl.want){const late=simRnd()<.25;dl.disp={d,tm:"08:30",by:"Ismail Hassan",loads:[{vn:"Flatbed 1",q:p.qty}],late};dl.log.push({d,t:"Dispatched with Flatbed 1",by:"Ismail Hassan"});p.st="Dispatched"}
  if(dl&&dl.disp&&!dl.rcv&&d>=dl.disp.d){const ok=!(S.lg.dl.indexOf(dl)==3);dl.rcv={d,tm:"11:00",by:"Raj Patel",ok,note:ok?"":"Two frames scratched in transit"};dl.log.push({d,t:"Received at site"+(ok?"":" with issues: Two frames scratched in transit"),by:"Raj Patel"});p.rcv={d,by:"Raj Patel"};p.st="Received at site"}})}
function simMore(d){try{simSetup27()}catch(e){console.log("m27 setup",e)}
 for(const f of [simPlanActs,simWeekly,simMat,simProd]){try{f(d)}catch(e){console.log("m27 "+f.name,e)}}}
