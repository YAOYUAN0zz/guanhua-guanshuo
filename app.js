'use strict';
const generate=OfficialWords.create(CORPUS);
const $=id=>document.getElementById(id);
let index=0,expanded=true,timer,composing=false,current;
const exampleIds=['SC41','SC46','SC56','SC75'];
for(const id of exampleIds){const s=CORPUS.find(s=>s.id===id);const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=s.input;b.addEventListener('click',()=>{$('input').value=s.input;reset();render();});$('examples').appendChild(b);}
function reset(){clearTimeout(timer);index=0;}
function render(){
  clearTimeout(timer);const input=$('input').value;const count=[...input.trim()].length;
  $('count').textContent=`输入 ${count} / 300 字`;
  current=generate(input,index,expanded,Number($('length').value));
  $('empty').hidden=current.kind!=='empty';$('result').hidden=current.kind==='empty';
  $('result').textContent=current.text;$('actions').hidden=['empty','limit'].includes(current.kind);
  $('status').textContent={empty:'等待来事',matched:'已认真表达',topic:'主题式表达',limit:'内容较长'}[current.kind];
  $('match-note').textContent=expanded?'围绕输入主题展开的本地句库文章。':current.kind==='matched'?`${current.category} · ${current.name}`:'这句采用通用主题表达，原话将直接保留。';
  $('expand').hidden=false;$('expand').textContent=expanded?'切换短句':'生成长文';$('copy').textContent=expanded?'复制全文 ↗':'复制这段话 ↗';
  $('output-count').textContent=current.mode==='article'?`正文 ${current.characters} 字`:current.text&&current.kind!=='limit'?`${[...current.text].length} 字`:'';
  $('another').textContent=expanded?'再写一篇 ↻':'换个说法 ↻';
}
$('input').addEventListener('input',()=>{reset();$('count').textContent=`输入 ${[...$('input').value.trim()].length} / 300 字`;$('actions').hidden=true;$('result').hidden=true;$('empty').hidden=false;$('status').textContent='正在整理';if(!composing)timer=setTimeout(render,350);});
$('input').addEventListener('compositionstart',()=>{composing=true;clearTimeout(timer);});
$('input').addEventListener('compositionend',()=>{composing=false;reset();timer=setTimeout(render,350);});
$('input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&!composing){e.preventDefault();reset();render();}});
$('clear').addEventListener('click',()=>{reset();$('input').value='';render();$('input').focus();});
$('another').addEventListener('click',()=>{index++;render();});
$('length').addEventListener('change',()=>{expanded=true;render();});
$('generate').addEventListener('click',()=>{expanded=true;render();});
$('expand').addEventListener('click',()=>{expanded=!expanded;render();});
$('copy').addEventListener('click',async()=>{
  if(!current||!current.text)return;
  const text=current.text;
  try {if(!navigator.clipboard)throw Error();await navigator.clipboard.writeText(text);$('copy').textContent='已复制 ✓';}
  catch {const selection=window.getSelection();const range=document.createRange();range.selectNodeContents($('result'));selection.removeAllRanges();selection.addRange(range);$('copy').textContent='已选中，请手动复制';}
});
render();
