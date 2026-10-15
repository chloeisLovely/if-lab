// Behavioral checks using DOM doubles. Not a substitute for real browser QA.
const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
class Element {
 constructor(value = '') {this.value=value;this.textContent='';this.hidden=false;this.disabled=false;this.dataset={};this.attrs={};this.events={};this.style={};this.classList={add(){}};}
 addEventListener(type, fn){this.events[type]=fn;}
 setAttribute(k,v){this.attrs[k]=v;}
 getAttribute(k){return this.attrs[k]??null;}
 contains(e){return e===this;}
 focus(){this.focused=true;}
 select(){this.selected=true;}
 after(el){nodes['#'+el.id]=el;}
}
const nodes={}, groups={};
const add = (selector,value='') => nodes[selector]=new Element(value);
for (const id of ['year','case-status','form-status','participants-field','copy-inquiry']) add('#'+id);
const menu=add('#mobile-menu');menu.hidden=true;menu.querySelectorAll=()=>[];
const menuBtn=add('.menu-toggle');menuBtn.setAttribute('aria-expanded','false');
const form=add('#inquiry-form');form.elements={};let validity=true;form.reportValidity=()=>validity;
for(const [id,value] of Object.entries({service:'AI·AX 교육 / 워크숍',organization:'  기관 A ',name:' 담당자 ',email:'test@example.com',message:'교육 협업 문의입니다.',schedule:'11월',participants:'30',budget:'협의'}))form.elements[id]=add('#'+id,value);
const filters=['all','public','education'].map(x=>{const e=new Element();e.dataset.filter=x;e.textContent=x;return e;});
const cards=['public','public','public','public','education','education'].map(x=>{const e=new Element();e.dataset.category=x;return e;});
const serviceLink=new Element();serviceLink.dataset.service='AI·AX 교육 / 워크숍';
groups['.case-filters button']=filters;groups['.case-card']=cards;groups['.reveal']=[];groups['[data-service]']=[serviceLink];
const docEvents={};
const document={querySelector:s=>nodes[s]??null,querySelectorAll:s=>groups[s]??[],addEventListener:(t,f)=>docEvents[t]=f,createElement:()=>new Element(),documentElement:new Element()};
let copied='';const navigator={clipboard:{writeText:async body=>{copied=body;}}};
const location={search:'?service=data',href:''};
const context={document,navigator,location,window:{location,matchMedia:()=>({matches:false,addEventListener(){}})},URLSearchParams,Date,encodeURIComponent,console};
vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/assets/site.js','utf8'),context);
(async()=>{
 assert.equal(nodes['#service'].value,'데이터 분석 / AI 솔루션');
 assert.equal(nodes['#participants'].disabled,true);
 await menuBtn.events.click();assert.equal(menu.hidden,false);assert.equal(menuBtn.getAttribute('aria-expanded'),'true');
 docEvents.keydown({key:'Escape'});assert.equal(menu.hidden,true);assert.equal(menuBtn.focused,true);
 filters[2].events.click();assert.equal(cards.filter(x=>!x.hidden).length,2);assert.equal(filters[2].getAttribute('aria-pressed'),'true');
 filters[1].events.click();assert.equal(cards.filter(x=>!x.hidden).length,4);
 filters[0].events.click();assert.equal(cards.filter(x=>!x.hidden).length,6);
 await nodes['#copy-inquiry'].events.click();assert.match(copied,/기관 \/ 소속: 기관 A/);assert.doesNotMatch(copied,/참여 인원/);
 serviceLink.events.click();assert.equal(nodes['#participants'].disabled,false);
 let prevented=false;form.events.submit({preventDefault(){prevented=true;}});assert.equal(prevented,true);
 assert.match(location.href,/^mailto:chloehappylee@gmail.com\?subject=/);
 const body=new URLSearchParams(location.href.split('?')[1]).get('body');
 assert.match(body,/담당자 성함: 담당자/);assert.match(body,/참여 인원: 30/);assert.match(body,/프로젝트 이야기: 교육 협업 문의입니다/);
 const prior=location.href;validity=false;nodes['#message'].value='';form.events.submit({preventDefault(){}});assert.equal(location.href,prior);assert.match(nodes['#form-status'].textContent,/필수 항목/);
 validity=true;nodes['#message'].value='수동 복사 테스트';navigator.clipboard.writeText=async()=>{throw Error('Clipboard unavailable');};await nodes['#copy-inquiry'].events.click();assert.equal(nodes['#copy-fallback'].selected,true);assert.match(nodes['#copy-fallback'].value,/수동 복사 테스트/);
 console.log('PASS: service selection, conditional field, menu/Escape, 3 filters, encoded email, validation guard, clipboard and fallback. DOM doubles; real browser not tested.');
})().catch(e=>{console.error(e);process.exit(1);});
