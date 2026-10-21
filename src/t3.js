setTimeout(()=>{try{fixS();
for(const r of ["Main contractor","Site engineer","Management","Project manager","Planning engineer"]){console.log(r,NAV.filter(([k])=>canTab(k,r)).map(x=>x[0]).join(","))}
role="Management";view="setup";let h=V.setup();console.log(h.length,/Company details/.test(h),/Contacts/.test(h),/Permissions/.test(h));
role="Site engineer";h=V.setup();console.log(/disabled/.test(h));
role="Management";h=V.reqs();console.log("reqs has contacts card:",/Contacts \(/.test(h));
showLogin();suShow("x");console.log(document.getElementById("loginbox").innerHTML.includes("Request an account"));
permTog("Main contractor","boq",true);
}catch(x){console.log("FAIL",x.stack.slice(0,600))}process.exit(0)},50)
