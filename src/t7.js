setTimeout(async()=>{try{fixS();role="Project manager";
const Ls=leaves();const l=Ls[2],pm=prevM(T),d=pm+"-12";
l.start=pm+"-10";l.dur=10;
const r=mkReq(l,"Main contractor",["Approved shop drawings","Site access (scaffold)"],"body");r.d=pm+"-05";r.dc=pm+"-20";r.s="closed";
S.obs.push({d:pm+"-15",t:l.id,ty:"Access",h:30,n:"Scaffold blocked by others",ph:["/photos/a.jpg"]});
S.obs.push({d:pm+"-16",t:Ls[5].id,ty:"Material",h:20,n:"glass late"});
S.delays.push({id:S.n++,d:pm+"-18",tid:l.id,cause:"Rework due to our fault",party:"Production department",days:2,note:"x"});
S.fid.rate=1500;S.contacts["Main contractor"]={name:"Mr Ali",email:"a@b.c"};
const A=wkAnalysis(mondayOf(add(pm+"-15",0)));console.log("week",A.w,A.tot,A.eot,A.pl,A.ac,A.ev.length,A.rec.length);
const R_=monRep(pm);console.log("month",R_.ev.length,R_.eot,R_.comp,R_.cost,R_.aw,R_.wks.length);
const txt=letterText(R_);console.log(txt.slice(0,1800));console.log("...len",txt.length);
S.fid.ed="2017";console.log(letterText(monRep(pm)).includes("8.5"));
S.fid.mo=[];S.fid.wk=[];NT.done={};delayAuto();console.log("auto mo",S.fid.mo.length,"wk",S.fid.wk.length);
dlM=pm;const h=V.delay();console.log("view",h.length,/Claim letter/.test(h),/draft/.test(h));
console.log(monthLetterHtml(R_,txt).length);
// xer
const x=["%T\tPROJWBS","%F\twbs_id\tparent_wbs_id\twbs_name","%R\t1\t\tProj","%R\t2\t1\t"+l.name.split(" / ")[0],"%T\tTASK","%F\ttask_id\ttask_code\ttask_name\twbs_id\ttarget_start_date\ttarget_end_date\tearly_start_date\tearly_end_date\tact_start_date\tact_end_date\tphys_complete_pct\ttarget_drtn_hr_cnt\ttask_type"]
Ls.slice(0,6).forEach((q,i)=>x.push(["%R",i+1,"T"+i,q.name.split(" / ").slice(1).join(" "),"2",add(T,20+i)+" 08:00",add(T,29+i)+" 17:00",add(T,20+i)+" 08:00",add(T,29+i)+" 17:00","","","0",80,"TT_Task"].join("\t")));
x.push(["%R",99,"T99","Unrelated activity","2",T+" 08:00",T+" 17:00",T+" 08:00",T+" 17:00","","","0",8,"TT_Task"].join("\t"));
const rows=xerRows(xerParse(x.join("\n")));console.log("xer rows",rows.length,rows[1][1]);
p6.rows=rows;p6.hdr=0;p6.key=1;p6.s=4;p6.f=5;p6Preview();console.log("matched",p6.prev.length,"unmatched",p6.un,p6.prev.slice(0,2).map(q=>[Math.round(q.sc*100),q.ns]));
p6.prev.forEach((q,i)=>{document.getElementById("p6c"+i).checked=true});p6Apply();console.log("applied",g(p6.prev.length?Ls[0].id:0).start);
S.lean.mode="off";upd(Ls[1].id,"start","2030-01-01");console.log("lean off edit",g(Ls[1].id).start);
for(const r of ROLES){role=r;for(const [k] of NAV){if(!canTab(k,r))continue;try{V[k]()}catch(x){console.log("ERR",r,k,x.message)}}}console.log("done")
}catch(x){console.log("FAIL",x.stack.slice(0,800))}process.exit(0)},50)
