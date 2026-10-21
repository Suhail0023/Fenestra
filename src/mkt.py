import re,subprocess,sys
js=re.search(r"<script>(.*)</script>\s*</body>",open("fenestra-site.html",encoding="utf-8").read(),re.S).group(1)
pre="""global.navigator={};global.Notification={permission:'granted'};global.window={addEventListener(){}};global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
const els={};const mk=id=>({id,style:{},files:[],checked:false,value:'',textContent:'',set innerHTML(v){this._h=v},get innerHTML(){return this._h||''},focus(){},setAttribute(){},querySelectorAll:()=>[],appendChild(){},remove(){}});
global.document={title:'',activeElement:null,documentElement:{},body:{appendChild(){},classList:{add(){},remove(){}}},createElement:()=>mk('x'),querySelector:()=>mk('q'),getElementById:id=>els[id]||(els[id]=mk(id))};
global.alert=m=>console.log('ALERT',m);global.confirm=()=>true;global.prompt=()=>null;global.fetch=()=>Promise.reject(new Error('nofetch'));
global.localStorage={_d:{},getItem(k){return this._d[k]??null},setItem(k,v){this._d[k]=v},removeItem(k){delete this._d[k]}};global.qrcode=()=>({addData(){},make(){},createImgTag:()=>''});
global.XLSX=undefined;global.location={origin:'http://x'};global.URL={createObjectURL:()=>'',revokeObjectURL(){}};global.Blob=function(){};
const set=(id,v)=>{document.getElementById(id).value=v};
"""
open("/tmp/h.js","w").write(pre+js+"\n"+open(sys.argv[1]).read())
r=subprocess.run(["node","/tmp/h.js"],capture_output=True,text=True,timeout=60);print(r.stdout[-6000:]);print(r.stderr[:2500])
