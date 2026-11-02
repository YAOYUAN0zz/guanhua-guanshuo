(function(root){
  'use strict';
  const aliases={SC41:['不想洗碗','我不想洗碗','今天我不想洗碗'],SC46:['今晚吃什么','晚上吃什么','晚饭吃啥','晚饭吃什么'],SC56:['怎么还没到','你咋还没到'],SC57:['我在忙晚点回你','忙着呢晚点回你'],SC58:['这次不去了你们玩'],SC59:['谢谢帮忙','谢谢你帮忙'],SC51:['再睡五分钟','让我再睡五分钟'],SC52:['今晚早点睡','今晚我要早睡'],SC53:['懒得出门','我今天不想出门'],SC54:['我想歇会儿','我想休息一会儿'],SC63:['作业还差一点'],SC66:['太贵了先不买','太贵了我先不买了'],SC71:['已经在路上了','我在路上了'],SC75:['到家了','我到家了'],SC76:['手机快没电了','手机没什么电了'],SC77:['网有点卡等一下'],SC78:['发错群了','我发错群了'],SC79:['我先下线了有事明天说'],SC80:['照片找到了','我找到那张照片了'],SC06:['中午不知道吃什么翻了半天外卖']};
  function normalize(s){return String(s).normalize('NFKC').replace(/[\s，。！？、；：,.!?;:]/gu,'');}
  function create(scenes){
    const lookup=new Map();
    for(const s of scenes){for(const input of [s.input,...(aliases[s.id]||[])]){
      const key=normalize(input);if(lookup.has(key)&&lookup.get(key).id!==s.id)throw new Error('场景冲突:'+key);
      lookup.set(key,s);
    }}
    return function generate(input,index=0,expanded=false,targetLength=3000){
      const raw=String(input).trim();
      if(!raw)return {text:'',kind:'empty',scene:null};
      if([...raw].length>300)return {text:'先说一件小事就好，请控制在 300 字以内。',kind:'limit',scene:null};
      const scene=lookup.get(normalize(raw));
      if(expanded){
        const article=root.OfficialArticle.generate(raw,targetLength);
        return {...article,kind:scene?'matched':'topic',scene:scene?.id||null,name:scene?.name,category:scene?.category,mode:'article'};
      }
      if(scene){
        const chosen=scene.variants[((index%scene.variants.length)+scene.variants.length)%scene.variants.length].text;
        const text=chosen;
        return {text,kind:'matched',scene:scene.id,name:scene.name,category:scene.category};
      }
      const variants=[`关于“${raw}”这一事项，有必要结合具体情况进一步研究，明确关注重点，做到有所思考、有所回应。`,`“${raw}”虽是日常小事，也值得认真对待。相关讨论应从实际出发，让表达有依据、关注有落点。`];
      return {text:variants[index%2],kind:'topic',scene:null};
    };
  }
  const api={create,normalize};root.OfficialWords=api;
  if(typeof module!=='undefined')module.exports=api;
})(globalThis);
