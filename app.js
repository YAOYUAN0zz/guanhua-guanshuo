'use strict';
const generate=OfficialWords.create(CORPUS);
const $=id=>document.getElementById(id);
let index=0,expanded=false,timer,composing=false,current;
const exampleIds=['SC41','SC46','SC56','SC75'];
for(const id of exampleIds){const s=CORPUS.find(s=>s.id===id);const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=s.input;b.addEventListener('click',()=>{$('input').value=s.input;reset();render();});$('examples').appendChild(b);}
function reset(){clearTimeout(timer);index=0;expanded=false;}
function render(){
  clearTimeout(timer);const input=$('input').value;const count=[...input.trim()].length;
  $('count').textContent=`${count} / 300`;
  current=generate(input,index,expanded);
  $('empty').hidden=current.kind!=='empty';$('result').hidden=current.kind==='empty';
  $('result').textContent=current.text;$('actions').hidden=['empty','limit'].includes(current.kind);
  $('status').textContent={empty:'等待来事',matched:'已认真表达',topic:'主题式表达',limit:'内容较长'}[current.kind];
  $('match-note').textContent=current.kind==='matched'?`${current.category} · ${current.name}`:'这句采用通用主题表达，原话将直接保留。';
  $('expand').hidden=current.kind!=='matched';$('expand').textContent=expanded?'收起论述':'展开论述';$('copy').textContent='复制这段话 ↗';
}
$('input').addEventListener('input',()=>{reset();$('count').textContent=`${[...$('input').value.trim()].length} / 300`;$('actions').hidden=true;$('result').hidden=true;$('empty').hidden=false;$('status').textContent='正在整理';if(!composing)timer=setTimeout(render,350);});
$('input').addEventListener('compositionstart',()=>{composing=true;clearTimeout(timer);});
$('input').addEventListener('compositionend',()=>{composing=false;reset();timer=setTimeout(render,350);});
$('input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&!composing){e.preventDefault();reset();render();}});
$('clear').addEventListener('click',()=>{reset();$('input').value='';render();$('input').focus();});
$('another').addEventListener('click',()=>{index++;render();});
$('expand').addEventListener('click',()=>{expanded=!expanded;render();});
$('copy').addEventListener('click',async()=>{
  if(!current||!current.text)return;
  const text=current.text;
  try {if(!navigator.clipboard)throw Error();await navigator.clipboard.writeText(text);$('copy').textContent='已复制 ✓';}
  catch {const selection=window.getSelection();const range=document.createRange();range.selectNodeContents($('result'));selection.removeAllRanges();selection.addRange(range);$('copy').textContent='已选中，请手动复制';}
});
render();
