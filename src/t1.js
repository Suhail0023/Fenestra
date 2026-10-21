setTimeout(async()=>{try{
fixS();
for(const r of ROLES.concat(['Management'])){role=r;for(const [k] of NAV){if(!canTab(k,r))continue;view=k;try{const h=V[k]();if(typeof h!='string'||h.length<5)console.log('EMPTY',r,k)}catch(x){console.log('ERR',r,k,x.message.slice(0,150))}}}
console.log('tabs ok');
role='Management';console.log(NAV.filter(([k])=>canTab(k)).map(x=>x[0]).join(','));
}catch(x){console.log('FAIL',x.stack.slice(0,500))}process.exit(0)},50)
