const assert=require('node:assert/strict');
const fs=require('node:fs');
const {create}=require('../engine.js');
require('../corpus.js');
const corpus=globalThis.CORPUS;
const g=create(corpus);
for(const s of corpus){assert.equal(g(s.input).scene,s.id);assert.notEqual(g(s.input,0).text,g(s.input,1).text);}
const cases=[['我不想洗碗。','SC41'],['晚上吃什么？','SC46'],['你怎么还没到？','SC56'],['我到家了','SC75']];
for(const [input,id] of cases)assert.equal(g(input).scene,id);
for(const input of ['我不是不想洗碗','你不想洗碗吗','我已经洗完碗了','他说我不想洗碗','我不想洗碗，但是今天谁倒垃圾','手机已经充满电','我没到家','我到家了吗'])assert.equal(g(input).kind,'topic');
assert.equal(g('').kind,'empty');assert.equal(g(' '.repeat(10)).kind,'empty');assert.equal(g('啊'.repeat(301)).kind,'limit');
assert.equal(g('<img src=x onerror=alert(1)>').kind,'topic');
assert.match(g('我不想洗碗',0,true).text,/从.*说起/);
assert.equal(g('我不想洗碗',2).text,g('我不想洗碗',0).text);
assert.equal(g('今天下雨，我们改天再去吧。').scene,'SC74');
assert.match(g('今天下雨，我们改天再去吧。').text,/建议/);
console.log('通过：80场景与160表达、常用别名、否定与指代防误匹配、边界输入、轮换及展开。');
