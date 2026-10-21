setTimeout(async()=>{try{fixS();
PL=[{code:"LR001",name:"Lulu",parent:"",kind:"Project"},{code:"LR001-A",name:"Tower A",parent:"LR001",kind:"Building"},{code:"LR001-A1",name:"Podium",parent:"LR001-A",kind:"Scope / package"},{code:"X",name:"X",parent:"",kind:"Project"}];
role="Management";portD=PL.map(p=>({code:p.code,name:p.name,p:50,a:40,w:30,sn:1,rq:0,dl:2,inc:0,tasks:5,cpi:1,spi:1}));portAt=Date.now()+1e9;
let h=V.port();console.log(h.length,(h.match(/<tr>/g)||[]).length,/total of 3/.test(h));
PCOL=["LR001-A"];h=V.port();console.log((h.match(/<tr>/g)||[]).length);
await portMove("LR001","LR001-A1");
await portMove("X","LR001");console.log(PL.find(x=>x.code=="X").parent);
LANG="zh";console.log(DICT.zh.Setup,DICT.bn.Dashboard,DICT.ta.Safety);
hdrUpd();for(const r of ROLES){role=r;for(const [k] of NAV){if(!canTab(k,r))continue;try{V[k]()}catch(x){console.log("ERR",r,k,x.message)}}}console.log("ok");
}catch(x){console.log("FAIL",x.stack.slice(0,600))}process.exit(0)},50)
