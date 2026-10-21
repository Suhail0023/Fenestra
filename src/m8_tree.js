/* ---- project tree: projects can hold sub-projects, buildings, scopes, phases, zones ---- */
const KINDS=["Project","Sub-project","Building","Scope / package","Phase","Zone"];
let PCOL=[];try{PCOL=JSON.parse(localStorage.getItem("fx-pcol")||"[]")}catch(x){}
function plTree(){const by={},ok=c=>PL.some(x=>x.code==c);PL.forEach(p=>{const k=p.parent&&p.parent!=p.code&&ok(p.parent)?p.parent:"";(by[k]=by[k]||[]).push(p)});
 const out=[],seen=new Set(),walk=(k,d,pa)=>(by[k]||[]).forEach(p=>{if(seen.has(p.code))return;seen.add(p.code);out.push({p,d,kids:(by[p.code]||[]).length,anc:pa});walk(p.code,d+1,pa.concat(p.code))});walk("",0,[]);
 PL.forEach(p=>{if(!seen.has(p.code))out.push({p,d:0,kids:0,anc:[]})});return out}
function plDesc(c){const r=new Set(),w=k=>PL.filter(x=>x.parent==k).forEach(x=>{if(!r.has(x.code)){r.add(x.code);w(x.code)}});w(c);return r}
const _hu=hdrUpd;hdrUpd=function(){_hu();try{const s=document.getElementById("prj");if(s){s.innerHTML=plTree().map(({p,d})=>`<option value="${e(p.code)}" ${p.code==PC?"selected":""}>${"  ".repeat(d)}${d?"└ ":""}${e(p.code)}${p.name&&p.name!=p.code?" - "+e(p.name):""}</option>`).join("")}const h=document.querySelector("header");if(h)document.documentElement.style.setProperty("--hh",h.offsetHeight+"px")}catch(x){}};
const PMR=()=>["Project manager","Management","Planning engineer"].includes(role);
newProj=async function(code,name,kind,parent){
 if(typeof code!="string"){view="port";R();return}
 if(!PMR())return;
 code=code.trim().replace(/[^A-Za-z0-9_-]/g,"").slice(0,24);if(!code||PL.some(x=>x.code==code)){alert("Enter a project code that is not used yet");return}
 name=(name||"").trim()||code;parent=parent||"";kind=KINDS.includes(kind)?kind:(parent?"Sub-project":"Project");
 const b=blankProj(code,name),cp=o=>JSON.parse(JSON.stringify(o));
 b.emps=cp(S.emps||[]);b.rates=cp(S.rates);b.chkItems=[...(S.chkItems||CHK)];b.wirTpl=cp(S.wirTpl||defTpl());b.fin=Object.assign({},S.fin);b.contacts=cp(S.contacts||{});
 if(API){const r=await api("/api/project",{method:"POST",body:JSON.stringify({code,name,state:b,parent,kind})});if(!r.ok){alert((await r.json()).error||"Could not create the project");return}PL=await r.json()}
 else{PL.push({code,name,parent,kind});try{localStorage.setItem("fx-projs",JSON.stringify(PL));localStorage.setItem(KEY+"-"+code,JSON.stringify(b))}catch(x){}}
 portAt=0;await switchProj(code);view="port";R()};
function portAdd(){const v=i=>document.getElementById(i).value;newProj(v("pa_c"),v("pa_n"),v("pa_k"),v("pa_p"))}
async function portMove(code,parent,kind){
 if(parent&&(parent==code||plDesc(code).has(parent))){alert("A project cannot sit under itself or its own sub-projects");R();return}
 if(API){try{const r=await api("/api/ptree",{method:"POST",body:JSON.stringify({code,parent,kind})}),j=await r.json();if(!r.ok){alert(j.error||"Failed");R();return}PL=j}catch(x){alert("Cannot reach the server");return}}
 else{const p=PL.find(x=>x.code==code);if(p){p.parent=parent;if(kind)p.kind=kind}try{localStorage.setItem("fx-projs",JSON.stringify(PL))}catch(x){}}
 portAt=0;R()}
function portTog(c){const i=PCOL.indexOf(c);i<0?PCOL.push(c):PCOL.splice(i,1);try{localStorage.setItem("fx-pcol",JSON.stringify(PCOL))}catch(x){}R()}
function portAgg(code,m){const ds=[code].concat([...plDesc(code)]).map(c=>m[c]).filter(x=>x&&!x.err);if(!ds.length)return null;
 const W=x=>Math.max(x.tasks||0,1),tw=ds.reduce((a,x)=>a+W(x),0),wa=k=>Math.round(ds.reduce((a,x)=>a+(+x[k]||0)*W(x),0)/tw*10)/10,sm=k=>Math.round(ds.reduce((a,x)=>a+(+x[k]||0),0)*10)/10;
 return{p:wa("p"),a:wa("a"),w:wa("w"),sn:sm("sn"),rq:sm("rq"),dl:sm("dl"),inc:sm("inc"),n:ds.length}}
V.port=()=>{if(!portD||Date.now()-portAt>20000)setTimeout(portLoad,0);const m={};(portD||[]).forEach(x=>{const y=Object.assign({},x);["p","a","w"].forEach(k=>{if(!isFinite(y[k]))y[k]=0});m[x.code]=y});const T_=plTree(),M=PMR();
 const opts=(sel,ex)=>`<option value="">(top level)`+T_.filter(({p})=>!ex.has(p.code)).map(({p,d})=>`<option value="${e(p.code)}" ${p.code==sel?"selected":""}>${"  ".repeat(d)}${e(p.code)}`).join("");
 const rows=T_.filter(({anc})=>!anc.some(a=>PCOL.includes(a))).map(({p,d,kids})=>{const x=m[p.code],ag=kids&&x&&!x.err?portAgg(p.code,m):null,v=ag||x;
  const nm=`<td style="padding-inline-start:${8+d*18}px">${kids?`<a href="#" onclick="portTog('${e(p.code)}');return false">${PCOL.includes(p.code)?"▸":"▾"}</a> `:'<span style="display:inline-block;width:12px"></span> '}<a href="#" onclick="switchProj('${e(p.code)}');view='dash';return false"><b>${e(p.code)}</b></a> ${e(p.name==p.code?"":p.name)} <span class="t">${e(p.kind||"Project")}</span>${ag?` <span class="m">total of ${ag.n}</span>`:""}`;
  const mv=M?`<td><select onchange="portMove('${e(p.code)}',this.value)" title="Move under">${opts(p.parent||"",new Set([p.code,...plDesc(p.code)]))}</select><td><select onchange="portMove('${e(p.code)}','${e(p.parent||"")}',this.value)">${KINDS.map(k=>`<option ${k==(p.kind||"Project")?"selected":""}>${k}`).join("")}</select>`:"";
  return !v||v.err?`<tr>${nm}<td colspan=${M?11:9}>No data${mv}</tr>`:`<tr>${nm}<td>${v.p}<td>${v.a}<td>${v.w}<td>${v.sn}<td>${v.rq}<td>${v.dl}<td>${v.inc}<td>${ag?"-":v.cpi}<td>${ag?"-":v.spi}${mv}</tr>`}).join("");
 return`<div class="c w"><h3>Portfolio tree</h3><table><tr><th>Project / sub-project<th>Plan %<th>Actual %<th>WIR approved %<th>Open snags<th>Overdue requests<th>Delay days<th>Incidents<th>CPI<th>SPI${M?"<th>Under<th>Kind":""}</tr>${rows||"<tr><td colspan=12 class=m>Loading...</tr>"}</table><div class="m">Click a name to open it. Rows with a ▾ are parents: their figures are the weighted total of the project and everything below it (percentages weighted by task count). ${portBusy?"Refreshing...":""}</div></div>
${M?`<div class="c"><h3>Add project or sub-project</h3><div class="f"><input id="pa_c" placeholder="Project code"><input id="pa_n" placeholder="Project name"><select id="pa_k">${KINDS.map(k=>`<option>${k}`).join("")}</select><select id="pa_p">${opts(PC,new Set())}</select><button class="p" onclick="portAdd()">Create</button></div><div class="m">The new item copies employees, productivity rates, checklists, WIR templates and contacts from the project you are in now, and starts with an empty BOQ. Use Upload BOQ to load its scope.</div></div>`:""}`};
