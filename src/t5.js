setTimeout(async()=>{try{fixS();
role="Site engineer";console.log(NAV.filter(([k])=>canTab(k)).map(x=>x[0]).join(","));
S.pp.push({id:1,d:T,tm:"10:00",by:"A",bld:"TOWER-A",elv:"EL-01",u:"data:x",o:2000,k:200},{id:2,d:T,tm:"11:00",by:"A",bld:"TOWER-A",elv:"EL-02",u:"data:y",o:2000,k:200});
let h=V.pph();console.log("pph",/TOWER-A/.test(h),/Slideshow/.test(h));lbOpen("TOWER-A","EL-01");lbGo(1);lbClose();
// points
const l=leaves()[0];l.team="Team Alpha";l.start=add(T,-3);l.dur=5;l.qty=10;l.ac=0;S.logs.push({d:T,team:"Team Alpha",t:l.id,w:4,h:8,q:5,s:"",f:""});
document.getElementById("q"+l.id).value=10;document.getElementById("h"+l.id).value=8;
fin(l.id);console.log("pts",JSON.stringify(S.pts.map(p=>[p.team,p.pts,p.why])));
S.logs.push({d:add(T,-40),team:"Team Bravo",t:1,w:4,h:8,q:20});
role="Project manager";for(const m of [T.slice(0,7)]){pfM=m;h=V.perf();console.log("perf",/Team Alpha/.test(h),/recommendation/.test(h))}
S.logs.push({d:prevM(T)+"-10",team:"Team Bravo",t:1,w:4,h:8,q:30});awdAuto();console.log("awd",S.awd.length&&S.awd[0].text);
for(const r of ROLES){role=r;for(const [k] of NAV){if(!canTab(k,r))continue;try{V[k]()}catch(x){console.log("ERR",r,k,x.message)}}}
vmCycle();console.log(VM,vmEff());console.log("done")
}catch(x){console.log("FAIL",x.stack.slice(0,700))}process.exit(0)},50)
