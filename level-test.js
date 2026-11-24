/* =============================================================================
   LEVEL TEST — módulo autônomo da aba "Level Test"
   -----------------------------------------------------------------------------
   Este arquivo contém TUDO da aba: lógica da prova, tela, estilos e estimativa.
   Para mexer só nela, edite este arquivo (e level-test-items.js, que guarda as perguntas).

   Como o app se liga a este módulo (são os únicos pontos de contato):
     index.html   <script src="level-test-items.js"> e <script src="level-test.js"> (antes do script principal)
                  <div id="levelTestRoot"></div> dentro de <section id="view-level">
                  route():       LevelTest.render()            ao abrir a aba
                  updateHome():  LevelTest.summary()           texto do cartão no menu principal
                  backup:        LevelTest.exportState() / .clean(raw) / .setState(state)
   Dependências (globais do app, usadas só em tempo de execução, todas opcionais):
     practiceStats e levelStats(topico, nivel)   resultados dos exercícios (estimativa combinada)
     focusPractice(topico) e showPracticeTab(aba) botões "Practise" depois da prova
   Armazenamento: localStorage 'englishStudiesLevelTest' (histórico de provas e prova salva).

   Como a nota é calculada (indicativo, não é um teste oficial):
     - Cada pergunta tem um nível CEFR (A2 a C2), definido em level-test-items.js.
     - Por habilidade: o nível é o mais alto em que você acertou 60% ou mais, desde que os níveis
       abaixo não tenham ficado abaixo de 50%. Se um nível fica abaixo de 50%, os níveis acima são
       pulados (não mudariam o resultado).
     - Resultado geral: média dos níveis das habilidades feitas.
     - Estimativa atual: combina a última prova (peso 70%) com os exercícios (30%).
   ============================================================================= */
const LevelTest=(()=>{
'use strict';
const KEY='englishStudiesLevelTest';
const CODES=['A1','A2','B1','B2','C1','C2'];
const SKILL_NAMES={grammar:'Grammar',vocabulary:'Vocabulary',reading:'Reading',listening:'Listening'};
const PER_LEVEL={quick:3,full:4};      // perguntas por nível em Grammar e Vocabulary
const PASS=.6, TOLERATE=.5, MAX_ATTEMPTS=20, MAX_PLAYS=2;
const CEFR=[
 ['A1','Iniciante','Entende e usa expressões simples do dia a dia.'],
 ['A2','Básico','Comunica-se em situações rotineiras e fala de assuntos imediatos.'],
 ['B1','Intermediário','Lida com a maioria das situações de viagem e descreve experiências e planos.'],
 ['B2','Intermediário avançado','Entende textos complexos e conversa com fluência e espontaneidade.'],
 ['C1','Avançado','Usa o idioma de forma flexível em contextos profissionais e acadêmicos.'],
 ['C2','Proficiente','Entende praticamente tudo e se expressa com precisão e naturalidade.']
];
const WRITING={
 prompt:'Write 80 to 120 words: describe a problem you had at work or while studying, and explain how you solved it.',
 checks:['I answered the whole question.','I used past and present tenses correctly most of the time.','I used linking words (however, because, so, although...).','I used a range of vocabulary, not only simple words.','I checked spelling and punctuation.','My ideas are in a clear order.']
};

/* ---------- estilos próprios (usam as variáveis do estilo atual do app) ---------- */
const css=`
.lt-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;align-items:start}
.lt-full{grid-column:1/-1}
.lt-row{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.lt-code{font-family:var(--ff-head);font-size:clamp(2.2rem,9vw,3.4rem);line-height:1;font-weight:var(--fw-head);padding:8px 16px;border:var(--bw) solid var(--edge);border-radius:var(--rad);background:var(--num-bg);color:var(--num-fg)}
.lt-code.none{background:var(--card);color:var(--muted)}
.lt-src{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:6px;font-size:.9rem}
.lt-bars{display:grid;gap:12px;margin-top:14px}
.lt-bar{font-size:.88rem}
.lt-bar b{display:flex;justify-content:space-between;gap:10px;margin-bottom:4px}
.lt-cefr{width:100%;border-collapse:collapse;font-size:.9rem}
.lt-cefr td{padding:9px 8px;text-align:left;border-top:1px solid var(--line);vertical-align:top}
.lt-cefr .code{font-family:var(--ff-head);font-weight:var(--fw-head2);white-space:nowrap}
.lt-cefr tr.now td{background:var(--accent2)}
.lt-choices{display:grid;gap:10px;margin:10px 0 4px}
.lt-choices .qoption small{display:block;font-weight:500;opacity:.85;margin-top:2px}
.lt-head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;font-size:.85rem;color:var(--muted);margin-bottom:8px}
.lt-timer{font-variant-numeric:tabular-nums;font-weight:800;color:var(--ink)}
.lt-skill{font-weight:800;color:var(--accent)}
.lt-passage{margin:0 0 14px;padding:12px 14px;border-left:4px solid var(--accent);border-radius:0 12px 12px 0;background:var(--accent2);line-height:1.55;font-size:.95rem}
.lt-player{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:14px}
.lt-chip{display:inline-block;font-size:.78rem;font-weight:800;padding:1px 8px;border:var(--bwp) solid var(--edge);border-radius:999px;margin:2px 4px 2px 0;background:var(--card);color:var(--ink)}
.lt-chip.ok{background:var(--correct-bg);color:var(--correct-fg)}
.lt-chip.bad{background:var(--danger-bg);color:var(--danger)}
.lt-skillrow{border-top:1px solid var(--line);padding:10px 0}
.lt-skillrow:first-child{border-top:0}
.lt-skillrow .top{display:flex;justify-content:space-between;gap:10px;align-items:baseline}
.lt-review{border-top:1px solid var(--line);padding:10px 0;font-size:.9rem}
.lt-review .st{font-weight:800}
.lt-review .st.ok{color:var(--ok)}
.lt-review .st.bad{color:var(--danger)}
.lt-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:12px}
.lt-hist{list-style:none;padding:0;margin:0;display:grid;gap:8px}
.lt-hist li{display:flex;gap:10px;justify-content:space-between;align-items:center;flex-wrap:wrap;border:var(--bw2) solid var(--edge);border-radius:var(--rad-m);padding:8px 12px;background:var(--card)}
.lt-write{width:100%;min-height:160px}
.lt-checks{display:grid;gap:8px;margin:12px 0}
.lt-checks label{display:flex;gap:8px;align-items:flex-start;font-size:.92rem}
.lt-weak{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:8px}
.lt-weak li{display:flex;gap:10px;justify-content:space-between;align-items:center;flex-wrap:wrap}
.lt-notice{font-weight:700;margin:0 0 12px}
.lt-notice:empty{display:none}
.qoption[aria-pressed="true"]{background:var(--sel-bg);color:var(--sel-fg);border-color:var(--edge)}
.qoption[aria-pressed="true"]:hover{background:var(--sel-bg)}
@media(max-width:760px){.lt-grid{grid-template-columns:1fr}}
`;
{const st=document.createElement('style');st.id='level-test-css';st.textContent=css;document.head.appendChild(st)}

/* ---------- utilitários ---------- */
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const lvIdx=l=>CODES.indexOf(l);
const clock=s=>{s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60,p=n=>String(n).padStart(2,'0');return h?`${h}:${p(m)}:${p(x)}`:`${p(m)}:${p(x)}`};
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const rootEl=()=>document.getElementById('levelTestRoot');

/* ---------- itens: cada pergunta vira uma "unidade" com id próprio ---------- */
const UNITS=new Map();
for(const it of levelTestItems){
 if(it.questions) it.questions.forEach((q,k)=>UNITS.set(`${it.id}.${k}`,{id:`${it.id}.${k}`,skill:it.skill,level:it.level,group:it,q:q.q,options:q.options,answer:q.answer,explain:q.explain,topic:''}));
 else UNITS.set(it.id,{id:it.id,skill:it.skill,level:it.level,group:null,q:it.q,options:it.options,answer:it.answer,explain:it.explain,topic:it.topic||''});
}

/* ---------- estado salvo ---------- */
let state=null;
function readRaw(){try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(S()))}catch(e){}}
const S=()=>state||(state=clean(readRaw()));
function cleanAnswers(arr){
 return (Array.isArray(arr)?arr:[]).filter(a=>a&&typeof a.id==='string'&&UNITS.has(a.id)).map(a=>{
  const chosen=Number.isInteger(a.chosen)&&a.chosen>=0&&a.chosen<4?a.chosen:-1;
  return {id:a.id,chosen,ok:chosen===UNITS.get(a.id).answer};
 });
}
function cleanWriting(w){
 if(!w||typeof w!=='object')return null;
 const checks=Array.isArray(w.checks)?w.checks.slice(0,6).map(Boolean):[];
 while(checks.length<6)checks.push(false);
 return {text:typeof w.text==='string'?w.text.slice(0,3000):'',checks};
}
function clean(raw){
 const out={v:1,attempts:[],progress:null};
 raw=raw&&typeof raw==='object'?raw:{};
 for(const a of (Array.isArray(raw.attempts)?raw.attempts:[])){
  if(!a||typeof a!=='object')continue;
  const answers=cleanAnswers(a.answers);
  if(!answers.length)continue;
  out.attempts.push({id:String(a.id||uid()).slice(0,30),at:Number(a.at)||Date.now(),mode:a.mode==='full'?'full':'quick',seconds:Math.max(0,Math.floor(Number(a.seconds))||0),answers,writing:cleanWriting(a.writing)});
 }
 out.attempts=out.attempts.slice(-MAX_ATTEMPTS);
 const p=raw.progress;
 if(p&&typeof p==='object'&&Array.isArray(p.queue)){
  const queue=p.queue.filter(id=>typeof id==='string'&&UNITS.has(id));
  const answers=cleanAnswers(p.answers);
  const prefixOk=queue.length===p.queue.length&&answers.length<=queue.length&&answers.every((a,i)=>a.id===queue[i]);
  const phase=p.phase==='writing'?'writing':'questions';
  if(prefixOk&&(answers.length<queue.length||phase==='writing')){
   out.progress={mode:p.mode==='full'?'full':'quick',extras:{writing:!!(p.extras&&p.extras.writing)},queue,answers,seconds:Math.max(0,Math.floor(Number(p.seconds))||0),phase,writing:cleanWriting(p.writing)||{text:'',checks:Array(6).fill(false)},at:Number(p.at)||Date.now()};
  }
 }
 return out;
}

/* ---------- pontuação ---------- */
function perLevel(answers,skill){
 const out={};
 for(const a of answers){
  const u=UNITS.get(a.id); if(!u||u.skill!==skill)continue;
  const o=out[u.level]||(out[u.level]={n:0,c:0});
  o.n++; if(a.ok)o.c++;
 }
 return out;
}
function skillIdx(per){
 let idx=0; // 0 = A1 (abaixo de A2)
 for(let i=1;i<CODES.length;i++){
  const o=per[CODES[i]];
  if(!o||!o.n)break;
  const acc=o.c/o.n;
  if(acc>=PASS)idx=i; else if(acc>=TOLERATE)continue; else break;
 }
 return idx;
}
function band(mean){
 const idx=Math.min(5,Math.floor(mean+0.4)), f=mean-Math.floor(mean), lo=Math.floor(mean);
 return {idx,code:CODES[idx],between:(f>=.35&&f<.65&&lo<5)?[CODES[lo],CODES[lo+1]]:null};
}
function summarize(answers){
 const skills={};
 for(const sk of Object.keys(SKILL_NAMES)){
  const per=perLevel(answers,sk), n=Object.values(per).reduce((a,x)=>a+x.n,0);
  if(n)skills[sk]={per,n,idx:skillIdx(per)};
 }
 const keys=Object.keys(skills);
 if(!keys.length)return null;
 const mean=keys.reduce((a,k)=>a+skills[k].idx,0)/keys.length;
 return Object.assign({skills,mean,total:answers.length,correct:answers.filter(a=>a.ok).length},band(mean));
}
// estimativa pelos exercícios (Practice Exercises): Easy ≈ B1, Medium ≈ B2, Hard ≈ C1
function practiceEstimate(){
 const names=['easy','medium','hard'], t={};
 if(typeof levelStats!=='function')return {code:null,idx:null,partial:false,t};
 names.forEach(l=>t[l]=levelStats(null,l));
 const MIN=10, THR=.6;
 let code=null, partial=false;
 if(t.easy.n>=MIN){
  if(t.easy.acc<THR)code='A2';
  else if(t.medium.n<MIN){code='B1';partial=true}
  else if(t.medium.acc<THR)code='B1';
  else if(t.hard.n<MIN){code='B2';partial=true}
  else if(t.hard.acc<THR)code='B2';
  else code='C1';
 }
 return {code,idx:code?lvIdx(code):null,partial,t};
}
function lastAttempt(){const a=S().attempts;return a.length?a[a.length-1]:null}
// estimativa atual: última prova (70%) + exercícios (30%)
function estimate(){
 const att=lastAttempt(), test=att?summarize(att.answers):null, pr=practiceEstimate();
 const sources=[]; let mean=null, conf='Baixa', note='';
 if(test)sources.push({kind:'Prova',code:test.code,between:test.between,detail:`${test.total} respostas · ${new Date(att.at).toLocaleDateString('pt-BR')}`});
 if(pr.code)sources.push({kind:'Exercícios',code:pr.code,detail:pr.partial?'parcial (faltam respostas Medium/Hard)':'dados suficientes'});
 if(test&&pr.code){
  mean=test.mean*0.7+pr.idx*0.3;
  const diff=Math.abs(test.mean-pr.idx);
  if(diff<=0.7){conf=test.total>=24?'Alta':'Média';note='A prova e os exercícios concordam.'}
  else if(diff<=1.5){conf='Média';note='A prova e os exercícios diferem em cerca de um nível.'}
  else{conf='Baixa';note='A prova e os exercícios diferem bastante. A prova tem mais peso.'}
 }else if(test){
  mean=test.mean; conf=test.total>=36?'Média':'Baixa'; note='Baseada só na prova. Responder exercícios ajuda a confirmar.';
 }else if(pr.code){
  mean=pr.idx; conf=pr.partial?'Baixa':'Média'; note='Baseada só nos exercícios de gramática. Faça a prova para uma estimativa mais completa.';
 }
 if(mean===null)return {code:null,test,pr,sources};
 const b=band(mean);
 return {code:b.code,between:b.between,conf,note,test,pr,sources};
}
function summary(){
 const e=estimate();
 if(!e.code)return 'Prova disponível';
 const src=e.test&&e.pr.code?'prova + exercícios':e.test?'prova':'exercícios'+(e.pr.partial?', parcial':'');
 return `Estimativa: ${e.code} (${src})`;
}

/* ---------- voz do aparelho (Listening) ---------- */
const synthOk=()=>typeof window!=='undefined'&&'speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined';
function voice(){
 if(!synthOk())return null;
 const vs=(speechSynthesis.getVoices()||[]).filter(v=>/^en/i.test(v.lang));
 return vs.find(v=>/en[-_]GB|en[-_]US/i.test(v.lang))||vs[0]||null;
}
function canSpeak(){
 return new Promise(res=>{
  if(!synthOk())return res(false);
  if(voice())return res(true);
  const done=()=>res(!!voice());
  try{speechSynthesis.addEventListener('voiceschanged',done,{once:true})}catch(e){}
  setTimeout(done,1500);
 });
}
function speak(group){
 if(!synthOk())return;
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(group.script), v=voice();
 if(v)u.voice=v;
 u.lang=(v&&v.lang)||'en-GB'; u.rate=group.rate||0.95;
 speechSynthesis.speak(u);
}
function stopSpeak(){try{if(synthOk())speechSynthesis.cancel()}catch(e){}}
window.addEventListener('hashchange',()=>{if(location.hash!=='#level')stopSpeak()});

/* ---------- prova em andamento ---------- */
let run=null;                    // prova ativa (em memória)
let view={mode:'home',id:null};  // tela quando não há prova ativa: home | result
const ui={mode:'quick',writing:false,notice:''};
let timer=null;
function startTimer(){
 stopTimer();
 timer=setInterval(()=>{
  if(run&&!document.hidden&&location.hash==='#level'){
   run.seconds++;
   const el=rootEl()&&rootEl().querySelector('[data-timer]');
   if(el)el.textContent='⏱ '+clock(run.seconds);
  }
 },1000);
}
function stopTimer(){if(timer){clearInterval(timer);timer=null}}
function buildQueue(mode,withListening){
 const per=PER_LEVEL[mode], skills=['grammar','vocabulary'];
 if(mode==='full'){skills.push('reading');if(withListening)skills.push('listening')}
 const q=[];
 for(const sk of skills)for(const lvl of CODES.slice(1)){
  const items=levelTestItems.filter(i=>i.skill===sk&&i.level===lvl);
  if(!items.length)continue;
  if(sk==='reading'||sk==='listening')items.forEach(it=>it.questions.forEach((_,k)=>q.push(`${it.id}.${k}`)));
  else shuffle(items).slice(0,per).forEach(it=>q.push(it.id));
 }
 return q;
}
async function start(mode,withWriting){
 const s=S();
 if(s.progress&&!confirm('Você tem uma prova salva. Começar outra vai substituí-la. Continuar?'))return;
 let voiceOk=false;
 if(mode==='full')voiceOk=await canSpeak();
 s.progress=null; persist();
 run={mode,extras:{writing:mode==='full'&&!!withWriting},queue:buildQueue(mode,voiceOk),answers:[],seconds:0,phase:'questions',plays:{},sel:-1,notes:[],writing:{text:'',checks:Array(6).fill(false)}};
 if(mode==='full'&&!voiceOk)run.notes.push('A parte de Listening foi ignorada: não encontrei voz em inglês neste aparelho.');
 ui.notice=''; startTimer(); render();
}
function resume(){
 const p=S().progress; if(!p)return;
 run={mode:p.mode,extras:{...p.extras},queue:[...p.queue],answers:p.answers.map(a=>({...a})),seconds:p.seconds,phase:p.phase,plays:{},sel:-1,notes:[],writing:{text:p.writing.text,checks:[...p.writing.checks]}};
 ui.notice=''; startTimer(); render();
}
function saveAndExit(){
 if(!run)return;
 const answered=run.answers.length;
 S().progress={mode:run.mode,extras:{...run.extras},queue:[...run.queue],answers:run.answers.map(a=>({...a})),seconds:run.seconds,phase:run.phase,writing:{text:run.writing.text,checks:[...run.writing.checks]},at:Date.now()};
 persist(); stopTimer(); stopSpeak(); run=null; view={mode:'home',id:null};
 ui.notice=`Prova salva (${answered} respondidas). Você pode continuar abaixo quando quiser.`; render();
}
function exitTest(){
 if(!run)return;
 if(!confirm('Sair da prova? O que você não salvou será perdido.'))return;
 stopTimer(); stopSpeak(); run=null; view={mode:'home',id:null}; ui.notice=''; render();
}
// pula os níveis acima de uma habilidade quando um nível ficou claramente fraco (< 50%)
function prune(u){
 const rest=run.queue.slice(run.answers.length);
 if(rest.some(id=>{const x=UNITS.get(id);return x.skill===u.skill&&x.level===u.level}))return;
 const o=perLevel(run.answers,u.skill)[u.level];
 if(o&&o.n&&o.c/o.n<TOLERATE){
  run.queue=run.queue.slice(0,run.answers.length).concat(rest.filter(id=>{const x=UNITS.get(id);return !(x.skill===u.skill&&lvIdx(x.level)>lvIdx(u.level))}));
 }
}
function answer(chosen){
 const id=run.queue[run.answers.length]; if(!id)return;
 const u=UNITS.get(id);
 run.answers.push({id,chosen,ok:chosen===u.answer});
 run.sel=-1; stopSpeak();
 prune(u);
 if(run.answers.length>=run.queue.length){
  if(run.extras.writing){run.phase='writing';render()}
  else finish();
 }else render();
}
function finish(){
 stopTimer(); stopSpeak();
 const attempt={id:uid(),at:Date.now(),mode:run.mode,seconds:run.seconds,answers:run.answers.map(a=>({...a})),writing:run.extras.writing?{text:run.writing.text.slice(0,3000),checks:[...run.writing.checks]}:null};
 const s=S(); s.attempts.push(attempt); s.attempts=s.attempts.slice(-MAX_ATTEMPTS); s.progress=null; persist();
 const notes=run.notes; run=null; view={mode:'result',id:attempt.id,notes}; render();
}

/* ---------- telas ---------- */
function estimateCard(){
 const e=estimate(), pr=e.pr||practiceEstimate();
 const names={easy:'Easy (≈ B1)',medium:'Medium (≈ B2)',hard:'Hard (≈ C1)'};
 let head;
 if(e.code){
  const bt=e.between?`entre ${e.between[0]} e ${e.between[1]}`:'';
  head=`<div class="lt-row"><div class="lt-code">${e.code}</div><div><strong>Nível estimado${bt?` <span class="note">(${bt})</span>`:''}</strong><p class="note" style="margin:4px 0 0">Confiança: <b>${e.conf}</b>. ${esc(e.note)}</p></div></div>`;
 }else{
  head='<div class="lt-row"><div class="lt-code none">?</div><div><strong>Ainda sem estimativa</strong><p class="note" style="margin:4px 0 0">Faça a prova abaixo ou responda pelo menos 10 questões Easy em Practice Exercises.</p></div></div>';
 }
 const src=e.sources&&e.sources.length?'<ul class="lt-src">'+e.sources.map(x=>`<li><b>${x.kind}:</b> ${x.code}${x.between?` (entre ${x.between[0]} e ${x.between[1]})`:''} · ${esc(x.detail)}</li>`).join('')+'</ul>':'';
 const bars='<div class="lt-bars">'+['easy','medium','hard'].map(l=>{
  const t=pr.t[l]||{n:0,acc:0}, pct=t.n?Math.round(t.acc*100):0;
  return `<div class="lt-bar"><b><span>${names[l]}</span><span>${t.n?pct+'% · '+t.n+' respostas':'sem respostas'}</span></b><div class="bar" role="img" aria-label="${names[l]}: ${pct}%"><span style="width:${pct}%"></span></div></div>`;
 }).join('')+'</div>';
 return `<section class="box" aria-label="Estimativa atual"><h3>📈 Estimativa atual</h3>${head}${src}<h4 class="seth">Seus exercícios</h4>${bars}<p class="note">A estimativa combina a última prova (peso maior) com seus resultados nos exercícios. É indicativa e não substitui um teste oficial.</p></section>`;
}
function startCard(){
 const s=S(), full=ui.mode==='full';
 const resumeBox=s.progress?`<div class="lt-weak" style="margin-bottom:14px"><li><span><b>Prova salva:</b> ${s.progress.answers.length} respondidas · ${clock(s.progress.seconds)} · ${s.progress.mode==='full'?'Completa':'Rápida'}</span><span><button class="btn" type="button" data-act="resume">Continuar</button> <button class="btn ghost" type="button" data-act="discard">Descartar</button></span></li></div>`:'';
 return `<section class="box" aria-label="Fazer a prova"><h3>📝 Fazer a prova</h3>
 <p class="lt-notice" id="ltNotice" role="status">${esc(ui.notice)}</p>${resumeBox}
 <div class="lt-choices" role="group" aria-label="Tipo de prova">
  <button type="button" class="qoption" data-act="mode" data-mode="quick" aria-pressed="${!full}"><strong>Rápida</strong><small>Grammar e Vocabulary · cerca de 30 perguntas · 10 a 15 min</small></button>
  <button type="button" class="qoption" data-act="mode" data-mode="full" aria-pressed="${full}"><strong>Completa</strong><small>Grammar, Vocabulary, Reading e Listening · até 60 perguntas · 25 a 40 min</small></button>
 </div>
 ${full?`<label class="check" style="margin:10px 0"><input type="checkbox" data-act="writing" ${ui.writing?'checked':''}> Incluir Writing (autoavaliação, não entra na nota)</label><p class="note">Listening usa a voz em inglês do seu aparelho. Se não houver uma, essa parte é ignorada.</p>`:''}
 <p class="note">A prova pula os níveis mais altos quando um nível fica claramente fraco, então costuma ter menos perguntas que o máximo. Você pode salvar e continuar depois.</p>
 <div class="lt-actions"><button class="btn" type="button" data-act="start">Iniciar prova</button></div></section>`;
}
function historyCard(){
 const a=S().attempts; if(!a.length)return '';
 const rows=a.slice().reverse().slice(0,8).map(x=>{const sm=summarize(x.answers);return `<li><span><b>${sm?sm.code:'?'}</b> · ${new Date(x.at).toLocaleDateString('pt-BR')} · ${x.mode==='full'?'Completa':'Rápida'} · ${clock(x.seconds)}</span><button class="btn ghost" type="button" data-act="open" data-id="${esc(x.id)}">Ver resultado</button></li>`}).join('');
 return `<section class="box lt-full" aria-label="Histórico"><h3>🗂️ Histórico de provas</h3><ul class="lt-hist">${rows}</ul><div class="lt-actions"><button class="btn bad" type="button" data-act="reset">Apagar histórico</button></div></section>`;
}
function cefrCard(){
 const e=estimate();
 return `<section class="box" aria-label="Níveis CEFR"><h3>🌍 Níveis CEFR</h3><table class="lt-cefr"><tbody>${CEFR.map(([c,n,d])=>`<tr class="${c===e.code?'now':''}"><td class="code">${c}</td><td><strong>${n}</strong><br><span class="note">${d}</span></td></tr>`).join('')}</tbody></table></section>`;
}
function renderHome(root){
 root.innerHTML=`<div class="lt-grid">${estimateCard()}${startCard()}${historyCard()}${cefrCard()}</div>`;
}
function groupBlock(u){
 const g=u.group; if(!g)return '';
 if(g.passage)return `<div class="lt-passage">${esc(g.passage)}</div>`;
 const left=MAX_PLAYS-(run.plays[g.id]||0);
 return `<div class="lt-player"><button class="btn" type="button" data-act="play" ${left<=0?'disabled':''}>▶ Ouvir</button><span class="note">${left>0?`Você pode ouvir ${left} ${left===1?'vez':'vezes'}.`:'Limite de audições atingido.'}</span></div>`;
}
function controls(){
 return `<div class="session-controls" role="group" aria-label="Opções da prova"><button class="btn ghost" type="button" data-act="save">Save &amp; exit</button><button class="btn bad" type="button" data-act="exit">Exit</button></div>`;
}
function renderRun(root){
 if(run.phase==='writing')return renderWriting(root);
 const id=run.queue[run.answers.length];
 if(!id){finish();return}
 const u=UNITS.get(id), n=run.answers.length+1, total=run.queue.length;
 const opts=u.options.map((o,i)=>`<button type="button" class="qoption" data-act="opt" data-i="${i}" aria-pressed="${run.sel===i}">${esc(o)}</button>`).join('');
 root.innerHTML=`<section class="box"><div class="lt-head"><span><span class="lt-skill">${SKILL_NAMES[u.skill]}</span> · Pergunta ${n} de até ${total}</span><span class="lt-timer" data-timer>⏱ ${clock(run.seconds)}</span></div>
 <div class="sessionbar" aria-hidden="true"><span style="width:${Math.round(run.answers.length/total*100)}%"></span></div>
 ${controls()}
 ${run.notes.map(x=>`<p class="note">${esc(x)}</p>`).join('')}
 <article class="qcard">${groupBlock(u)}<div class="qtext">${esc(u.q)}</div><div class="qoptions">${opts}</div>
 <div class="practice-actions"><button class="btn" type="button" data-act="next" ${run.sel<0?'disabled':''}>${n>=total&&!run.extras.writing?'Finalizar':'Próxima'}</button><button class="btn ghost" type="button" data-act="skip">Pular</button></div></article></section>`;
}
function renderWriting(root){
 const words=(run.writing.text.trim().match(/\S+/g)||[]).length;
 root.innerHTML=`<section class="box"><div class="lt-head"><span><span class="lt-skill">Writing</span> · autoavaliação (não entra na nota)</span><span class="lt-timer" data-timer>⏱ ${clock(run.seconds)}</span></div>${controls()}
 <article class="qcard"><div class="qtext">${esc(WRITING.prompt)}</div>
 <textarea class="lt-write" id="ltWrite" maxlength="1500" placeholder="Write your text here…" aria-label="Writing">${esc(run.writing.text)}</textarea>
 <p class="note" id="ltWords">${words} palavras</p>
 <p class="note"><b>Depois de escrever, marque o que você cumpriu:</b></p>
 <div class="lt-checks">${WRITING.checks.map((c,i)=>`<label><input type="checkbox" data-act="wcheck" data-i="${i}" ${run.writing.checks[i]?'checked':''}> ${esc(c)}</label>`).join('')}</div>
 <div class="practice-actions"><button class="btn" type="button" data-act="finishWriting">Finalizar prova</button></div></article></section>`;
}
function renderResult(root){
 const att=S().attempts.find(a=>a.id===view.id);
 if(!att){view={mode:'home',id:null};return renderHome(root)}
 const sm=summarize(att.answers), pr=practiceEstimate(), e=estimate();
 const head=`<section class="box lt-full"><h3>🏁 Resultado da prova</h3><div class="lt-row"><div class="lt-code">${sm.code}</div><div><strong>${sm.between?`Entre ${sm.between[0]} e ${sm.between[1]}`:'Nível '+sm.code}</strong><p class="note" style="margin:4px 0 0">${sm.correct} de ${sm.total} corretas · ${clock(att.seconds)} · ${att.mode==='full'?'Prova completa':'Prova rápida'}</p></div></div>
  ${(view.notes||[]).map(x=>`<p class="note">${esc(x)}</p>`).join('')}
  <p class="note">${e.code?`Estimativa atual (prova + exercícios): <b>${e.code}</b> · confiança ${e.conf}. ${esc(e.note)}`:''}</p>
  <p class="note">Resultado indicativo, baseado em perguntas deste app. Não é um teste oficial.</p></section>`;
 const skills=`<section class="box"><h3>📊 Por habilidade</h3>${Object.keys(sm.skills).map(k=>{const s=sm.skills[k];return `<div class="lt-skillrow"><div class="top"><strong>${SKILL_NAMES[k]}</strong><span><b>${CODES[s.idx]}</b></span></div><div>${CODES.slice(1).filter(l=>s.per[l]).map(l=>{const o=s.per[l];const cls=o.c/o.n>=PASS?'ok':o.c/o.n<TOLERATE?'bad':'';return `<span class="lt-chip ${cls}">${l} ${o.c}/${o.n}</span>`}).join('')}</div></div>`}).join('')}${att.writing?`<div class="lt-skillrow"><div class="top"><strong>Writing</strong><span class="note">autoavaliação</span></div><div class="note">${att.writing.checks.filter(Boolean).length} de 6 critérios marcados. Não entra na nota.</div></div>`:''}</section>`;
 const wk={};
 att.answers.filter(a=>!a.ok).forEach(a=>{const t=UNITS.get(a.id).topic;if(t)wk[t]=(wk[t]||0)+1});
 const weak=Object.entries(wk).sort((a,b)=>b[1]-a[1]).slice(0,3);
 const weakest=Object.keys(sm.skills).sort((a,b)=>sm.skills[a].idx-sm.skills[b].idx)[0];
 const next=`<section class="box"><h3>🎯 O que treinar agora</h3><p class="note" style="margin-top:0">Habilidade mais fraca: <b>${SKILL_NAMES[weakest]}</b>.</p>${weak.length?`<ul class="lt-weak">${weak.map(([t,c])=>`<li><span><b>${esc(t)}</b> · ${c} ${c===1?'erro':'erros'} na prova</span><button class="btn ghost" type="button" data-act="practice" data-topic="${esc(t)}">Practise</button></li>`).join('')}</ul>`:'<p class="note">Nenhum erro de gramática ligado a um tópico dos exercícios.</p>'}</section>`;
 const review=`<section class="box lt-full"><h3>🔎 Revisão das respostas</h3><details><summary>Mostrar todas (${att.answers.length})</summary>${att.answers.map(a=>{const u=UNITS.get(a.id);return `<div class="lt-review"><span class="st ${a.ok?'ok':'bad'}">${a.ok?'✓':'✗'}</span> <b>${SKILL_NAMES[u.skill]} · ${u.level}</b><div>${esc(u.q)}</div><div class="note">${a.ok?'':`Sua resposta: ${a.chosen>=0?esc(u.options[a.chosen]):'(em branco)'} · `}Correta: ${esc(u.options[u.answer])}</div><div class="note">${esc(u.explain)}</div></div>`}).join('')}</details></section>`;
 root.innerHTML=`<div class="lt-grid">${head}${skills}${next}${review}</div><div class="lt-actions"><button class="btn" type="button" data-act="home">Voltar</button><button class="btn ghost" type="button" data-act="again">Refazer a prova</button></div>`;
}
function render(){
 const root=rootEl(); if(!root)return;
 if(!root.dataset.ready){root.dataset.ready='1';bind(root)}
 if(run)renderRun(root);
 else if(view.mode==='result')renderResult(root);
 else renderHome(root);
}

/* ---------- eventos ---------- */
function bind(root){
 root.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]'); if(!b)return;
  const act=b.dataset.act;
  if(act==='mode'){ui.mode=b.dataset.mode;render()}
  else if(act==='start')start(ui.mode,ui.writing);
  else if(act==='resume')resume();
  else if(act==='discard'){if(confirm('Descartar a prova salva?')){S().progress=null;persist();ui.notice='Prova salva descartada.';render()}}
  else if(act==='opt'&&run){run.sel=Number(b.dataset.i);render()}
  else if(act==='next'&&run&&run.sel>=0)answer(run.sel);
  else if(act==='skip'&&run)answer(-1);
  else if(act==='save')saveAndExit();
  else if(act==='exit')exitTest();
  else if(act==='play'&&run){const u=UNITS.get(run.queue[run.answers.length]);if(u&&u.group&&(run.plays[u.group.id]||0)<MAX_PLAYS){run.plays[u.group.id]=(run.plays[u.group.id]||0)+1;speak(u.group);render()}}
  else if(act==='finishWriting'&&run)finish();
  else if(act==='open'){view={mode:'result',id:b.dataset.id};render()}
  else if(act==='home'||act==='back'){view={mode:'home',id:null};render()}
  else if(act==='again'){view={mode:'home',id:null};ui.notice='';render();start(ui.mode,ui.writing)}
  else if(act==='reset'){if(confirm('Apagar todo o histórico de provas deste aparelho?')){S().attempts=[];persist();view={mode:'home',id:null};render()}}
  else if(act==='practice'){
   const t=b.dataset.topic; location.hash='#practice';
   setTimeout(()=>{if(typeof showPracticeTab==='function')showPracticeTab('exercises');if(typeof focusPractice==='function')focusPractice(t)},80);
  }
 });
 root.addEventListener('change',e=>{
  const b=e.target.closest('[data-act]'); if(!b)return;
  if(b.dataset.act==='writing'){ui.writing=b.checked}
  else if(b.dataset.act==='wcheck'&&run){run.writing.checks[Number(b.dataset.i)]=b.checked}
 });
 root.addEventListener('input',e=>{
  if(e.target.id==='ltWrite'&&run){
   run.writing.text=e.target.value;
   const w=(run.writing.text.trim().match(/\S+/g)||[]).length, el=document.getElementById('ltWords');
   if(el)el.textContent=w+' palavras';
  }
 });
}

/* ---------- API pública usada pelo app ---------- */
return {
 render,
 summary,
 estimate,
 exportState:()=>S(),
 clean,
 setState:s=>{state=clean(s);persist();run=null;stopTimer();view={mode:'home',id:null}},
 _t:{summarize,skillIdx,buildQueue,band,UNITS,CODES,get run(){return run},get state(){return S()}}
};
})();
