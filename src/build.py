import re
h=open("app_before.html",encoding="utf-8").read()
def rep(a,b,c=1):
    global h; assert h.count(a)==c,(a[:70],h.count(a)); h=h.replace(a,b)
def rx(p,b,flags=re.S):
    global h; n=len(re.findall(p,h,flags)); assert n==1,(p[:60],n); h=re.sub(p,lambda m:b,h,count=1,flags=flags)
# --- state init
rep('try{S=JSON.parse(localStorage.getItem(KEY))}catch(x){}if(!S)S=seed();','''let PC="LR001",PL=[{code:"LR001",name:"LR001"}],API=false,TOKEN="",USER=null,tm,last="",dirty=false,offline=false;
try{TOKEN=sessionStorage.getItem("fx-tok")||"";const pp=localStorage.getItem("fx-projs");if(pp)PL=JSON.parse(pp);PC=localStorage.getItem("fx-pc")||"LR001";if(!PL.some(x=>x.code==PC))PC=PL[0].code}catch(x){}
try{S=JSON.parse(localStorage.getItem(KEY+(PC=="LR001"?"":"-"+PC)))}catch(x){}if(!S)S=PC=="LR001"?seed():blankProj(PC);''')
rep('const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(x){}},g=','const g=')
# --- remove old duplicated async helpers (new versions live in m1)
rx(r'async function sendChat\(\).*?\n(?=async function poll)','')
rx(r'async function poll\(\).*?\n(?=function|const|let|async)','')
rx(r'async function keepPhoto\(d\).*?\n','')
# --- shrink max size
rep('function shrink(f){','function shrink(f,mx){'); rep('720/Math.max(im.width,im.height)','(mx||720)/Math.max(im.width,im.height)')
# --- canTab and NAV
rx(r'canTab=\(k,r=role\)=>\{.*?\},\nbyStart','''canTab=(k,r=role)=>tabsOf(r).includes(k),
byStart''')
rx(r'const NAV=\[.*?\];','const NAV=[["dash","Dashboard"],["boq","BOQ"],["bqup","Upload BOQ"],["plan","Schedule"],["lean","Lean planner"],["gantt","Installation Gantt"],["base","Baseline"],["p6","P6 exchange"],["res","Productivity rates"],["rdel","Delegate resources"],["rsend","Task delegation"],["reqs","Requests"],["site","Site"],["wir","WIR log"],["snag","Snagging"],["safe","Safety"],["comm","Commercial"],["claims","Claims"],["delay","Delay analysis"],["mat","Materials"],["tool","Site tools"],["inst","Instructions"],["ipa","Rates and IPA"],["rep","Reports"],["port","Portfolio"],["badge","QR badges"],["pph","Progress photos"],["perf","Team performance"],["chat","Chat"],["setup","Setup"],["log","Activity log"],["alerts","Alerts"]];')
rep('function setRole(v){role=v;view=v=="Project manager"?"dash":v=="Management"?"res":v=="Quality engineer"?"wir":v=="Planning engineer"?"plan":v=="Main contractor"?"dash":v=="Production department"?"chat":"site";R();permPopup()}','function setRole(v){role=v;view=landing(v);R();permPopup()}')
# --- lg with user
rep('ev,by:role,note:note||""});if(l.id)notify','ev,by:role,note:note||"",u:USER?USER.name:role});if(l.id)notify')
# --- chkAlerts: overdue requests
rep('ntSave()}\nfunction bellUpd','(S.reqs||[]).filter(r=>r.s=="open"&&r.due<T).forEach(r=>{const k="req|"+r.id+"|"+T;if(!NT.done[k]){NT.done[k]=1;notify("Request overdue: "+r.to,r.n+" (due "+r.due+")")}});ntSave()}\nfunction bellUpd')
# also make chkAlerts not return early when there are no flags
rep('if(!nw.length)return;nw.forEach','nw.forEach')
rep('if(nw.length>3){toast','if(nw.length>3){toast')
# --- hit gating
rep('const l=g(scT),tm=new Date().toTimeString().slice(0,5);S.att=S.att||[];','const l=g(scT),tm=new Date().toTimeString().slice(0,5);S.att=S.att||[];{const why=safeBlock(l);if(why){m.textContent=why;return}}')
# --- rev creates requests
rep('S.mail.push({to:"Project manager",n:l.name,miss,from:from,ps:l.start,pf:f0,delay:d});','S.mail.push({to:"Project manager",n:l.name,miss,from:from,ps:l.start,pf:f0,delay:d});const m0=S.mail.length;')
rep('R();return}}\nlet stm=null','S.mail.slice(m0).filter(m=>m.body).forEach(m=>mkReq(l,m.to,m.miss,m.body));R();return}}\nlet stm=null')
# --- nicer header: nav on its own scrolling row, quieter first-load alerts
rep('nav{display:flex;gap:4px;flex-wrap:wrap;flex:1}nav button{','#wrap{display:flex;align-items:flex-start}#wrap>main{flex:1;min-width:0;margin:0}nav{display:flex;flex-direction:column;gap:2px;width:196px;flex:none;position:sticky;top:var(--hh,52px);max-height:calc(100vh - var(--hh,52px));overflow-y:auto;padding:8px 6px;border-inline-end:1px solid var(--ln);background:var(--pn)}#mnu{display:none;border:0;background:none;font-size:22px;cursor:pointer;color:var(--tx,inherit)}[data-dv=mob] #mnu{display:inline-block}[data-dv=mob] nav{position:fixed;top:0;bottom:0;inset-inline-start:0;z-index:40;width:230px;max-height:none;padding-top:56px;transform:translateX(calc(-105% * var(--d,1)));transition:transform .2s;box-shadow:2px 0 12px rgba(0,0,0,.3)}[data-dv=mob] nav.open{transform:none}[dir=rtl]{--d:-1}[data-dv=tab] nav{width:158px}[data-dv=tab] main{padding:10px}[data-dv=mob] main{padding:8px}[data-dv=mob] .c{overflow-x:auto}[data-dv=mob] input,[data-dv=mob] select,[data-dv=mob] button,[data-dv=tab] button,[data-dv=tab] select{min-height:38px}[data-dv=mob] .g{grid-template-columns:1fr}[data-dv=mob] header{padding:6px 8px;gap:6px}[data-dv=mob] h1{font-size:16px}[data-dv=mob] #lang,[data-dv=mob] #role,[data-dv=mob] #prj{max-width:130px}#vmb{margin-inline-start:auto;border:1px solid var(--ln);border-radius:6px;padding:4px 10px;cursor:pointer}@media print{nav{display:none!important}}nav button{text-align:start;white-space:nowrap;')
rep('notify("Alert: "+f.x,f.l.name+" starts "+fd(f.l.start)+" ("+f.lab+" before start)",i>=3)','notify("Alert: "+f.x,f.l.name+" starts "+fd(f.l.start)+" ("+f.lab+" before start)",nw.length>3)')
rep('if(nw.length>3){toast((nw.length-3)+" more alerts, see the bell")','if(nw.length>3){toast(nw.length+" pre-start alerts, see the bell")')
# --- header, overlays, css
rep('<h1>Fenestra Site <span class="t">LR001</span></h1><nav id="nav"></nav>','<button id="mnu" class="np" aria-label="Menu" onclick="document.getElementById(\'nav\').classList.toggle(\'open\')">☰</button><h1>Fenestra Site <span class="t" id="pcode"></span></h1>')
rep('<option>Planning engineer</option><option>Main contractor</option>','<option>Planning engineer</option><option>HSE officer</option><option>Main contractor</option>')
rep('</button></header>','</button><select id="prj" aria-label="Project" onchange="switchProj(this.value)"></select><button id="npb" class="np" onclick="newProj()" title="New project" style="border:0;background:none;font-size:18px;cursor:pointer">+</button><select id="lang" aria-label="Language" onchange="setLang(this.value)"><option value="en">English<option value="ar">العربية<option value="hi">हिन्दी<option value="ur">اردو<option value="tl">Filipino<option value="bn">বাংলা<option value="ta">தமிழ்<option value="zh">中文</select><span id="off" class="m"></span><span id="usr" class="m"></span><button id="vmb" class="np" onclick="vmCycle()" title="Screen layout: Auto, PC, iPad, Phone"></button></header>')
rep('<main id="v"></main>','<div id="wrap"><nav id="nav"></nav><main id="v"></main></div>\n<div id="login" class="np" style="display:none;position:fixed;inset:0;z-index:60;background:var(--bg);align-items:center;justify-content:center;padding:16px"><div class="c" id="loginbox" style="max-width:340px;width:100%"></div></div>\n<div id="prt"></div>')
rep('.tr{position:relative','#prt{display:none}@media print{body.printing>*:not(#prt){display:none!important}body.printing #prt{display:block!important;padding:12px}body.printing{background:#fff;color:#000}}\n.tr{position:relative')
# --- R0: header update + translate
rep("onclick=\"view='${k}';R()\"","onclick=\"view='${k}';document.getElementById('nav').classList.remove('open');R()\"")
rep('document.getElementById("v").innerHTML=V[view]();save()}','document.getElementById("v").innerHTML=V[view]();hdrUpd();save();trDom()}')
# --- final boot
rep('\nR();permPopup();\n</script>','\nboot();\nif("serviceWorker" in navigator)navigator.serviceWorker.register("/sw.js").catch(()=>{});\n</script>')
# --- modules
mods="".join(open(f,encoding="utf-8").read()+"\n" for f in ["m1_core.js","m2_quality_safety.js","m3_requests_claims_plan.js","m4_commercial_reports.js","m5_i18n.js","m6_setup.js","m7_lang_new.js","m8_tree.js","m9_photos_awards.js","m10_lean.js","m11_delay_fidic.js","m12_help.js","m13_scope.js","m14_mh_vo_ipa.js","m15_mat_tools.js","m16_services.js","m17_wir_daily.js","m18_manual.js","m19_records.js","m20_rollover.js","m21_lookahead.js"])
rep('\nfunction R(){if(!canTab','\n'+mods+'\nfunction R(){if(!canTab')
rep('const upd=(id,k,v)=>{g(id)[k]=v;R()}','const upd=(id,k,v)=>{leanUpd(id,k,v)}')
rep('function re(){if(!isPL())return;','function re(){if(!isPL())return;if(!lnGate())return;')
rep('function mv(id,d){if(!isPL())return;','function mv(id,d){if(!isPL())return;if(!lnGate())return;')
rx(r'document\.getElementById\("nav"\)\.innerHTML=NAV\.filter.*?\.join\(""\);','document.getElementById("nav").innerHTML=navHtml();')
rep('document.getElementById("v").innerHTML=V[view]();hdrUpd()','document.getElementById("v").innerHTML=pageHead()+V[view]();hdrUpd()')
rep('<button id="vmb" class="np"','<button id="hbtn" class="np" onclick="helpOpen()" title="Help and guide (Ctrl+K to search)" style="margin-inline-start:auto;background:var(--ac);color:#fff;border-color:var(--ac)">? Help</button><button id="vmb" class="np"')
rep('#vmb{margin-inline-start:auto;','#vmb{')
css = """
nav .ng{font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--mu);padding:12px 10px 4px}nav .ng:first-child{padding-top:4px}nav .ni{display:inline-block;width:22px}nav button{display:flex;align-items:center;width:100%;border-radius:8px}nav button:hover:not(.on){background:var(--bg)}nav button b{margin-inline-start:auto}
.ph{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin:0 0 12px;padding:2px 2px 10px;border-bottom:1px solid var(--ln)}.ph h2{margin:0;font-size:20px}.ph p{margin:2px 0 0;color:var(--mu);font-size:13px;max-width:70ch}
.c{box-shadow:0 1px 2px rgba(0,0,0,.04)}button:hover:not(:disabled){filter:brightness(.96)}button.p:hover:not(:disabled){filter:brightness(1.1)}th{position:sticky;top:0;background:var(--pn);font-size:12px;color:var(--mu);text-transform:uppercase;letter-spacing:.4px}tbody tr:hover td,tr:hover>td{background:rgba(11,122,117,.05)}input,select{min-height:32px}input:disabled,select:disabled{opacity:.6}
#hlp{position:fixed;top:0;bottom:0;inset-inline-end:0;width:390px;max-width:100vw;background:var(--pn);border-inline-start:1px solid var(--ln);box-shadow:-6px 0 24px rgba(0,0,0,.25);z-index:60;display:flex;flex-direction:column}#hlp .hh{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-bottom:1px solid var(--ln);font-size:16px}#hlp .ht{display:flex;gap:4px;padding:6px 10px;border-bottom:1px solid var(--ln)}#hlp .ht button{border:0;background:none;color:var(--mu);border-radius:6px}#hlp .ht button.on{background:var(--ac);color:#fff}#hlp .hm{flex:1;overflow:auto;padding:12px 14px}#hlp .hf{padding:6px 14px;border-top:1px solid var(--ln)}#hlp h4{margin:12px 0 4px}#hlp .tp{margin:6px 0}.bb{max-width:92%;margin:6px 0;padding:8px 11px;border-radius:12px;background:var(--bg)}.bb.u{margin-inline-start:auto;background:var(--ac);color:#fff}.chip{border-radius:14px;font-size:12px;padding:3px 10px}#hlp details{margin:4px 0}.cpi{padding:7px 10px;border-radius:8px;cursor:pointer}.cpi.on,.cpi:hover{background:var(--bg)}
@media print{#hlp,#lnm,#cgx{display:none!important}.ph{display:none}}
[data-dv=mob] #hlp{width:100vw}[data-dv=mob] #usr .un{display:block;font-size:12px}[data-dv=mob] header{row-gap:4px}[data-dv=mob] .ph{flex-direction:column;gap:6px}[data-dv=mob] .ph button{align-self:flex-start}
"""
rep('@media print{header,.np{display:none!important}main{padding:0}}</style>','@media print{header,.np{display:none!important}main{padding:0}}'+css+'</style>')
# manifest + title tags for installable app
rep('<title>Fenestra Site</title>','<title>Fenestra Site</title>\n<link rel="manifest" href="/manifest.webmanifest"><meta name="theme-color" content="#0b7a75"><link rel="apple-touch-icon" href="/icon-192.png"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Fenestra">')
h=h.replace(re.search(r'KEY="fenestra-lr001-v\d+"',h).group(0),'KEY="fenestra-lr001-v22"')
open("fenestra-site.html","w",encoding="utf-8").write(h)
print("built",len(h))
