setTimeout(async()=>{try{
fixS();const L=leaves(),l=L.find(x=>x.st=='plan');l.st='deleg';l.eng='Omar K.';l.ea=[];
// revert with missing items -> requests
role='Site engineer';rev(l.id);
console.log('reqs',S.reqs.map(r=>r.to+':'+r.items.length),S.mail.length);
// overdue request + escalate + notifications
S.reqs[0].due=add(T,-2);chkAlerts();reqEsc(0);console.log('esc',!!S.reqs[0].eb);
role='Project manager';set('rr0','ok sent');reqClose(0);console.log('closed',S.reqs[0].s);
// delays derived
console.log('delays',delayRows().length);
// WIR with template
const t=L.find(x=>x.st=='plan'&&/Glass/i.test(x.name))||L[0];t.st='acc';t.ac=0;role='Site engineer';set('q'+t.id,String(t.qty));set('h'+t.id,'8');fin(t.id);
const w=S.insp[S.insp.length-1];console.log('wir',w.no,w.sc,w.c.length);
role='Quality engineer';
w.c.forEach((c,j)=>{set('wr'+(S.insp.length-1)+'_'+j,'P');set('wv'+(S.insp.length-1)+'_'+j,'5')});
set('wr'+(S.insp.length-1)+'_0','F');await wirDec(S.insp.length-1,1);console.log('approve with fail ->',w.s);
set('wr'+(S.insp.length-1)+'_0','P');await wirDec(S.insp.length-1,1);console.log('approve ->',w.s,w.cr.length);
console.log('wir view',/Pass/.test(V.wir()),'handover',handoverData());
// snags
role='Site engineer';set('sgt',String(t.id));set('sgl','A/2nd');set('sgd','scratch');set('sgo','Team Alpha');set('sgu','');await addSnag();snagAct(0,'fix');role='Quality engineer';snagAct(0,'close');console.log('snag',S.snags[0].s,V.snag().length>100);
// safety
role='Project manager';const hr=L.find(x=>hrOf(x));console.log('blocked?',safeBlock(hr));
set('pt',String(hr.id));set('py','Work at height');set('pf',T);set('pu',T);set('pn','');ptwAct('req');ptwAct('ap',S.ptw.length-1);console.log('after ptw',safeBlock(hr));
set('tbt_t','0');set('tbo','Glass handling');set('tbn','8');set('tbm','');tbtAdd();console.log('after tbt',JSON.stringify(safeBlock(hr)));
set('iny','Near miss');set('int','0');set('ind','x');set('ina','y');await incAdd();console.log('inc',S.inc.length,/Days since/.test(V.safe()));
// variation + claims + notice
set('vd','extra');set('vb',String(hr.id));set('vq','5');set('vv','1000');set('vw','');varAdd();S.vars[0].s='Approved';const q0=hr.qty;varApply(0);console.log('var',hr.qty-q0);
console.log('notice',noticeText('Main contractor').length>50,V.claims().length>200);
// baseline + cpm
role='Planning engineer';freezeBase();hr.start=add(hr.start,5);const C=cpm();console.log('cpm',C.length,C.filter(x=>x.crit).length,/Baseline/.test(V.base()));
// commercial
role='Management';S.items.filter(i=>!i.p).forEach(r=>{r.cr=100;r.bc=40});setFin('labour',15);console.log('fin',JSON.stringify(fin_()).slice(0,160));
costAdd;console.log('inv',invoice(T.slice(0,7)).gross>=0,V.comm().length>500);
// insights
console.log('ins',insights().rows.length,/Productivity learning/.test(V.res()));
// reports
for(const ty of['daily','weekly','monthly']){repT=ty;const b=repBuild();console.log('rep',ty,b.length>300)}
console.log(/Weekly/.test(V.rep()));
// p6
p6.rows=[['Activity name','Start','Finish'],[L[0].name,new Date(Date.UTC(2026,10,3)),new Date(Date.UTC(2026,10,20))]];p6.hdr=0;p6.key=0;p6.s=1;p6.f=2;p6Preview();console.log('p6',p6.prev.length,p6.prev[0]&&p6.prev[0].ns);role='Planning engineer';document.getElementById('p6c0').checked=true;p6Apply();console.log(L[0].start);
// portfolio and project creation (demo)
const sm=summarize(JSON.parse(JSON.stringify(S)));console.log('port',sm.p,sm.cpi);
console.log('lang',typeof trDom, Object.keys(DICT).length);
}catch(x){console.log('FAIL',x.stack.slice(0,700))}process.exit(0)},50)
