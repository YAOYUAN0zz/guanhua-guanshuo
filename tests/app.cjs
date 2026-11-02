// DOM fixture checks event wiring; this is not a real-browser/device test.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const base=path.join(__dirname,'..');
const nodes=new Map();
function node(){return {value:'',hidden:false,textContent:'',children:[],handlers:{},appendChild(n){this.children.push(n);},addEventListener(k,f){(this.handlers[k]??=[]).push(f);},focus(){},async emit(k,e={}){for(const f of this.handlers[k]||[])await f(e);}};}
for(const m of fs.readFileSync(path.join(base,'index.html'),'utf8').matchAll(/id="([^"]+)"/g))nodes.set(m[1],node());
nodes.get('length').value='3000';
const pending=new Map();let next=0,copied='';
const context=vm.createContext({console,document:{getElementById:id=>{assert(nodes.has(id),id);return nodes.get(id);},createElement:node},navigator:{clipboard:{async writeText(t){copied=t;}}},setTimeout:f=>{pending.set(++next,f);return next;},clearTimeout:id=>pending.delete(id)});
for(const file of ['corpus.js','article.js','engine.js','app.js'])vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),context,{filename:file});
async function flush(){const jobs=[...pending.values()];pending.clear();for(const f of jobs)f();}
(async()=>{
 assert.equal(nodes.get('actions').hidden,true);
 nodes.get('input').value='洗碗';await nodes.get('input').emit('input');await flush();
 assert.match(nodes.get('output-count').textContent,/正文 3\d{3} 字/);
 assert.equal(nodes.get('expand').textContent,'切换短句');
 nodes.get('length').value='5000';await nodes.get('length').emit('change');
 assert.match(nodes.get('output-count').textContent,/正文 5\d{3} 字/);
 await nodes.get('copy').emit('click');assert.equal(copied,nodes.get('result').textContent);assert(copied.length>5000);
 await nodes.get('expand').emit('click');assert(nodes.get('result').textContent.length<300);
 await nodes.get('generate').emit('click');assert(nodes.get('result').textContent.length>5000);
 await nodes.get('clear').emit('click');assert.equal(nodes.get('result').textContent,'');
 await nodes.get('input').emit('compositionstart');nodes.get('input').value='不想洗碗';await nodes.get('input').emit('input');assert.equal(pending.size,0);
 await nodes.get('input').emit('compositionend');await flush();assert(nodes.get('result').textContent.includes('不想洗碗'));
 console.log('DOM夹具通过：默认长文、5000字选择、全文复制、长短切换、清空与中文组词保护。');
})().catch(e=>{console.error(e);process.exitCode=1;});
