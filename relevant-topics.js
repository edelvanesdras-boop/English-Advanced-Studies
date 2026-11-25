/* Relevant Topics — V8
   The module below owns only the Relevant Topics view. It intentionally uses
   the app's existing localStorage store, flashcards and global navigation.
*/
const topics = [
 {n:1,icon:"🌍",title:"Climate Change & Global Warming",cat:"science",ted:["TED – Climate change and global warming","https://www.ted.com/search?q=climate%20change%20global%20warming"],read:["Our World in Data – CO₂ and greenhouse gas emissions","https://ourworldindata.org/co2-and-greenhouse-gas-emissions"],news:["BBC – Climate change and global warming","https://www.youtube.com/results?search_query=BBC+The+Climate+Question+climate+change+global+warming"]},
 {n:2,icon:"🤖",title:"AI & Future of Work",cat:"work",ted:["TED – AI and the future of work","https://www.ted.com/search?q=AI%20future%20of%20work"],read:["World Economic Forum – Future of Jobs Report 2025","https://www.weforum.org/reports/the-future-of-jobs-report-2025/"],news:["BBC – AI and the job market","https://www.youtube.com/results?search_query=BBC+AI+future+of+work+jobs+podcast"]},
 {n:3,icon:"💰",title:"Income Inequality & Social Mobility",cat:"society",ted:["TED – Inequality and social mobility","https://www.ted.com/search?q=income%20inequality%20social%20mobility"],read:["Our World in Data – Economic inequality","https://ourworldindata.org/economic-inequality"],news:["DW News – Income inequality and social mobility","https://www.youtube.com/results?search_query=DW+News+income+inequality+social+mobility"]},
 {n:4,icon:"🏠",title:"Future of Remote Work",cat:"work",ted:["TED – Remote work and the future of work","https://www.ted.com/search?q=remote%20work%20future%20of%20work"],read:["OECD – Teleworking","https://www.oecd.org/en/topics/sub-issues/teleworking.html"],news:["BBC News – Remote and hybrid work","https://www.youtube.com/results?search_query=BBC+News+future+of+remote+work+hybrid+work"]},
 {n:5,icon:"🧑‍💼",title:"Leadership & Organisational Culture",cat:"work",ted:["TED – Leadership and organisational culture","https://www.ted.com/search?q=leadership%20organisational%20culture"],read:["Harvard Business Review – Organisational culture","https://hbr.org/topic/organizational-culture"],news:["Financial Times – Leadership and workplace culture","https://www.youtube.com/results?search_query=Financial+Times+leadership+workplace+culture+podcast"]},
 {n:6,icon:"📉",title:"Economic Crises & Employment",cat:"work",ted:["TED – Economic crises and recessions","https://www.ted.com/search?q=economic%20crisis%20recession"],read:["IMF – Finance & Development","https://www.imf.org/en/Publications/fandd"],news:["BBC News – Recession and unemployment","https://www.youtube.com/results?search_query=BBC+News+economic+crisis+recession+unemployment"]},
 {n:7,icon:"🌐",title:"Globalisation & Its Impact on Workers",cat:"work",ted:["TED – Globalisation and global trade","https://www.ted.com/search?q=globalization%20global%20trade"],read:["OECD – Globalisation","https://www.oecd.org/en/topics/globalisation.html"],news:["DW News – Globalisation, trade and workers","https://www.youtube.com/results?search_query=DW+News+globalisation+global+trade+workers"]},
 {n:8,icon:"🧳",title:"Immigration & Cultural Integration",cat:"society",ted:["TED – Immigration and cultural integration","https://www.ted.com/search?q=immigration%20cultural%20integration"],read:["UNHCR – Livelihoods and economic inclusion","https://www.unhcr.org/what-we-do/build-better-futures/livelihoods-and-economic-inclusion"],news:["BBC News – Immigration and integration debate","https://www.youtube.com/results?search_query=BBC+News+immigration+integration+debate"]},
 {n:9,icon:"🔐",title:"Technology & Privacy",cat:"science",ted:["Jen Golbeck – How surveillance tech erodes your privacy","https://www.ted.com/talks/jen_golbeck_how_surveillance_tech_erodes_your_privacy"],read:["Electronic Frontier Foundation – Privacy","https://www.eff.org/issues/privacy"],news:["BBC / technology – Privacy and surveillance","https://www.youtube.com/results?search_query=BBC+technology+privacy+surveillance+podcast"]},
 {n:10,icon:"🎓",title:"Education & Social Inequality",cat:"society",ted:["TED – Education and inequality","https://www.ted.com/search?q=education%20inequality"],read:["OECD – Education","https://www.oecd.org/en/topics/education.html"],news:["BBC News – Education inequality","https://www.youtube.com/results?search_query=BBC+News+education+inequality+schools"]},
 {n:11,icon:"🏛️",title:"Government Regulation & Companies",cat:"society",ted:["TED – Government regulation and business","https://www.ted.com/search?q=government%20regulation%20business"],read:["The Economist – Finance and economics","https://www.economist.com/finance-and-economics/"],news:["Financial Times – Regulation and business","https://www.youtube.com/results?search_query=Financial+Times+government+regulation+business+podcast"]},
 {n:12,icon:"⚖️",title:"Work-Life Balance",cat:"work",ted:["TED – Work-life balance","https://www.ted.com/search?q=work%20life%20balance"],read:["WHO – Mental health at work","https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work"],news:["BBC – Work, wellbeing and burnout","https://www.youtube.com/results?search_query=BBC+worklife+balance+burnout+podcast"]},
 {n:13,icon:"📅",title:"The Four-Day Workweek",cat:"work",ted:["Juliet Schor – The case for a 4-day work week","https://www.ted.com/talks/juliet_schor_the_case_for_a_4_day_work_week"],read:["4 Day Week Global – Research","https://www.4dayweek.com/research"],news:["BBC News – Four-day working week","https://www.youtube.com/results?search_query=BBC+News+four+day+working+week+trial"]},
 {n:14,icon:"🏆",title:"Meritocracy vs. Inequality",cat:"society",ted:["TED – Meritocracy and inequality","https://www.ted.com/search?q=meritocracy%20inequality"],read:["Our World in Data – Social mobility","https://ourworldindata.org/social-mobility"],news:["BBC Ideas – Meritocracy and social mobility","https://www.youtube.com/results?search_query=BBC+Ideas+meritocracy+social+mobility+debate"]},
 {n:15,icon:"⚙️",title:"Automation & Unemployment",cat:"science",ted:["TED – Automation and jobs","https://www.ted.com/search?q=automation%20jobs"],read:["World Economic Forum – Future of Jobs Report 2025","https://www.weforum.org/reports/the-future-of-jobs-report-2025/"],news:["DW News – Automation and employment","https://www.youtube.com/results?search_query=DW+News+automation+robots+unemployment+jobs"]}
];

const labels=[["🎥 VIDEO","ted"],["📖 READING","read"],["📰 NEWS / VIDEO PODCAST","news"]];
const KEYS={done:'englishStudiesDone',notes:'englishStudiesNotes',cards:'englishStudiesCards',streak:'englishStudiesStreak',theme:'englishStudiesTheme',backup:'englishStudiesLastBackup'};
const RESOURCE_KEY='englishStudiesTopicResourcesV8';
const DAY=864e5, INTERVALS=[0,1,2,4,8,16];
const store={
 get(k,fb){try{const v=JSON.parse(localStorage.getItem(k));return v==null?fb:v}catch(e){return fb}},
 set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let done=new Set(store.get(KEYS.done,[]).map(Number));
let notes=store.get(KEYS.notes,{});
let cards=store.get(KEYS.cards,[]);
const openPanels=new Set();
const resourceOpen=new Set();
const root=document.getElementById('cards');
const topicById=id=>topics.find(t=>t.n===Number(id));
const cardsOf=id=>cards.filter(c=>c.topic===Number(id));
const dueCards=()=>cards.filter(c=>c.due<=Date.now());

function blankResources(){
 const o={}; topics.forEach(t=>o[t.n]={ted:false,read:false,news:false});
 return o;
}
let resourceDone=store.get(RESOURCE_KEY,null);
if(!resourceDone||typeof resourceDone!=='object'){
 resourceDone=blankResources();
 // Preserve the previous V7/V8 meaning: a previously completed topic becomes 3/3.
 done.forEach(id=>{if(resourceDone[id])resourceDone[id]={ted:true,read:true,news:true}});
 store.set(RESOURCE_KEY,resourceDone);
}else{
 topics.forEach(t=>{
  const r=resourceDone[t.n];
  if(!r||typeof r!=='object')resourceDone[t.n]={ted:false,read:false,news:false};
  else resourceDone[t.n]={ted:!!r.ted,read:!!r.read,news:!!r.news};
 });
 store.set(RESOURCE_KEY,resourceDone);
}

function topicChecks(t){const r=resourceDone[t.n]||{};return labels.map(([,k])=>!!r[k]);}
function topicDoneCount(t){return topicChecks(t).filter(Boolean).length}
function isTopicDone(t){return topicDoneCount(t)===3}
function syncLegacyDone(){
 const next=new Set(topics.filter(isTopicDone).map(t=>t.n));
 done=next;
 store.set(KEYS.done,[...done]);
}
syncLegacyDone();

function updateProgress(){
 const total=topics.length, n=topics.filter(isTopicDone).length;
 const checks=topics.reduce((sum,t)=>sum+topicDoneCount(t),0), max=total*3;
 const pct=Math.round(n/total*100);
 document.getElementById('ptext').textContent=`${n} de ${total} temas concluídos · ${checks}/${max} atividades`;
 document.getElementById('pfill').style.width=pct+'%';
 document.getElementById('pbar').setAttribute('aria-valuenow',pct);
 const b=document.getElementById('reviewBtn'), due=dueCards().length;
 b.disabled=cards.length===0;
 b.textContent=cards.length?`🗂️ Revisar flashcards (${due} para hoje · ${cards.length} no total)`:'🗂️ Revisar flashcards (nenhum ainda)';
}

function ytId(link){
 try{const u=new URL(link); if(u.hostname==='youtu.be')return u.pathname.slice(1).split('/')[0]||''; if(/(^|\.)youtube\.com$/.test(u.hostname)){if(u.pathname==='/watch')return u.searchParams.get('v')||''; const m=u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/); return m?m[1]:''}}catch(e){} return '';
}
function tedEmbed(link){
 try{const u=new URL(link); if(!/(^|\.)ted\.com$/.test(u.hostname))return ''; const m=u.pathname.match(/^\/talks\/([^/?#]+)/); return m?m[1]:'';
 }catch(e){return ''}
}
function videoEmbed(t,key){
 const link=t[key]?.[1]||'';
 const y=ytId(link); if(y)return {src:`https://www.youtube.com/embed/${encodeURIComponent(y)}?rel=0`,type:'youtube'};
 if(key==='ted'){const slug=tedEmbed(link); if(slug)return {src:`https://embed.ted.com/talks/${encodeURIComponent(slug)}`,type:'ted'};}
 return null;
}
function sourceKind(t,key){
 const link=t[key]?.[1]||'';
 if(ytId(link))return 'YouTube';
 if(tedEmbed(link))return 'TED';
 return 'site externo';
}

function resourceHTML(t,key,label){
 const link=t[key][1], title=t[key][0], checked=!!resourceDone[t.n]?.[key], open=resourceOpen.has(`${t.n}-${key}`);
 const video=key!=='read'?videoEmbed(t,key):null;
 const isReading=key==='read';
 const actionText=video?'▶ Assistir aqui':isReading?'📖 Ler aqui':'↗ Abrir conteúdo';
 let viewer='';
 if(open&&video){viewer=`<div class="rt-viewer rt-video"><iframe src="${esc(video.src)}" title="${esc(title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`}
 else if(open&&isReading){viewer=`<div class="rt-viewer rt-reading"><iframe src="${esc(link)}" title="${esc(title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe><p class="rt-fallback">Se esta página não puder ser incorporada, use <a href="${esc(link)}" target="_blank" rel="noopener noreferrer">Abrir externamente ↗</a>.</p></div>`}
 return `<div class="rt-resource ${checked?'is-checked':''}" data-topic="${t.n}" data-resource="${key}">
  <div class="rt-resource-head">
   <div class="rt-resource-icon" aria-hidden="true">${key==='ted'?'🎥':key==='read'?'📖':'📰'}</div>
   <div class="rt-resource-main"><span class="rt-resource-label">${label}</span><strong>${esc(title)}</strong><small>${video?`Conteúdo incorporável · ${sourceKind(t,key)}`:isReading?'Leitura dentro do app quando o site permitir': 'Pesquisa externa — escolha o episódio que preferir'}</small></div>
   <label class="rt-check"><input type="checkbox" class="resourcebox" data-topic="${t.n}" data-resource="${key}" ${checked?'checked':''}><span>${checked?'Concluído':'Concluir'}</span></label>
  </div>
  <div class="rt-actions"><button type="button" class="btn ghost rt-open" data-topic="${t.n}" data-resource="${key}">${actionText}</button><a class="rt-external" href="${esc(link)}" target="_blank" rel="noopener noreferrer">Abrir externamente ↗</a></div>
  ${viewer}
 </div>`;
}

function cardHTML(t){
 const mine=cardsOf(t.n), nOpen=openPanels.has('notes-'+t.n), cOpen=openPanels.has('cards-'+t.n), completed=topicDoneCount(t);
 return `<article class="card rt-card ${isTopicDone(t)?'done':''}" data-id="${t.n}">
  <div class="cardhead"><div class="num">${t.n}</div><div style="flex:1"><h2>${t.icon} ${esc(t.title)}</h2></div>
   <div class="rt-topic-progress" aria-label="${completed} de 3 etapas concluídas"><strong>${completed}/3</strong><span>${completed===3?'Concluído':completed===0?'Começar':'Em andamento'}</span></div>
  </div>
  <div class="rt-resources">${labels.map(([label,key])=>resourceHTML(t,key,label)).join('')}</div>
  <details class="panel" data-panel="notes-${t.n}" ${nOpen?'open':''}>
   <summary>📝 Anotações${notes[t.n]?' ✓':''}</summary>
   <textarea class="notes" data-id="${t.n}" placeholder="Expressões, argumentos, ideias principais…" aria-label="Anotações do tema ${t.n}">${esc(notes[t.n]||'')}</textarea>
   <p class="note saved"></p>
  </details>
  <details class="panel" data-panel="cards-${t.n}" ${cOpen?'open':''}>
   <summary>🗂️ Flashcards (${mine.length})</summary>
   ${mine.map(c=>`<div class="fc"><span><strong>${esc(c.front)}</strong><small>${esc(c.back)}</small></span><button class="del" type="button" data-del="${c.id}" aria-label="Remover flashcard ${esc(c.front)}">✕</button></div>`).join('')}
   <div class="addfc"><input class="fcfront" placeholder="Palavra ou expressão" aria-label="Frente do flashcard"><input class="fcback" placeholder="Significado ou exemplo" aria-label="Verso do flashcard"><button class="btn addbtn" type="button">Adicionar</button></div>
   ${mine.length?`<div class="fcactions"><button class="btn ghost reviewtopic" type="button" data-id="${t.n}">Revisar este tema</button></div>`:''}
  </details>
 </article>`;
}

function render(){
 const q=document.getElementById('search').value.toLowerCase();
 const f=document.getElementById('filter').value;
 const hay=t=>[t.title,t.ted[0],t.read[0],t.news[0],notes[t.n]||'',...cardsOf(t.n).map(c=>c.front+' '+c.back)].join(' ').toLowerCase();
 const list=topics.filter(t=>(f==='all'||t.cat===f)&&hay(t).includes(q));
 root.innerHTML=list.length?list.map(cardHTML).join(''):'<p class="note">Nenhum tema encontrado.</p>';
 document.getElementById('count').textContent=`${list.length} de ${topics.length} temas`;
 updateProgress();
}

let savedTimer;
root.addEventListener('change',e=>{
 if(e.target.classList.contains('resourcebox')){
  const id=Number(e.target.dataset.topic), key=e.target.dataset.resource;
  if(!resourceDone[id])resourceDone[id]={ted:false,read:false,news:false};
  resourceDone[id][key]=e.target.checked;
  store.set(RESOURCE_KEY,resourceDone); syncLegacyDone();
  const article=e.target.closest('.card');
  if(article){const t=topicById(id);article.classList.toggle('done',isTopicDone(t));const p=article.querySelector('.rt-topic-progress');const n=topicDoneCount(t);p.innerHTML=`<strong>${n}/3</strong><span>${n===3?'Concluído':n===0?'Começar':'Em andamento'}</span>`;}
  updateProgress(); updateHome();
  return;
 }
 if(!e.target.classList.contains('donebox'))return;
});
root.addEventListener('input',e=>{
 if(!e.target.classList.contains('notes'))return;
 const id=e.target.dataset.id, v=e.target.value;
 v.trim()?notes[id]=v:delete notes[id];
 store.set(KEYS.notes,notes);
 const msg=e.target.parentElement.querySelector('.saved'); msg.textContent='Salvo neste dispositivo';
 clearTimeout(savedTimer); savedTimer=setTimeout(()=>msg.textContent='',1500);
});
root.addEventListener('toggle',e=>{const k=e.target.dataset&&e.target.dataset.panel;if(!k)return;e.target.open?openPanels.add(k):openPanels.delete(k)},true);
function addCard(article){
 const id=Number(article.dataset.id), fi=article.querySelector('.fcfront'), bi=article.querySelector('.fcback'), front=fi.value.trim(), back=bi.value.trim();
 if(!front){fi.focus();return} if(!back){bi.focus();return}
 cards.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),topic:id,front,back,box:0,due:0});
 store.set(KEYS.cards,cards); openPanels.add('cards-'+id); render();
 const again=root.querySelector(`.card[data-id="${id}"] .fcfront`); if(again)again.focus();
}
root.addEventListener('click',e=>{
 const article=e.target.closest('.card');
 if(e.target.classList.contains('rt-open')){
  const id=Number(e.target.dataset.topic), key=e.target.dataset.resource, k=`${id}-${key}`;
  resourceOpen.has(k)?resourceOpen.delete(k):resourceOpen.add(k); render();
  const next=root.querySelector(`.rt-resource[data-topic="${id}"][data-resource="${key}"] .rt-open`); if(next)next.focus(); return;
 }
 if(e.target.classList.contains('addbtn'))addCard(article);
 else if(e.target.dataset.del){cards=cards.filter(c=>c.id!==e.target.dataset.del);store.set(KEYS.cards,cards);render()}
 else if(e.target.classList.contains('reviewtopic'))startReview(Number(e.target.dataset.id));
});
root.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.target.classList.contains('fcfront')||e.target.classList.contains('fcback')))addCard(e.target.closest('.card'))});

/* ---------- Flashcard review ---------- */
const dlg=document.getElementById('review'), rvBody=document.getElementById('rvBody');
let session=null;
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function startReview(topic){const pool=cards.filter(c=>!topic||c.topic===topic);if(!pool.length)return;const due=pool.filter(c=>c.due<=Date.now()),useAll=!due.length,queue=shuffle((useAll?pool:due).map(c=>c.id));session={queue,total:queue.length,firstTry:new Set(),wrong:new Set(),revealed:false,note:useAll?'Nenhum cartão vence hoje, então você está revisando todos.':''};renderReview();if(!dlg.open)dlg.showModal()}
function renderReview(){
 const closeBtn='<button class="btn ghost" type="button" data-rv="close">Fechar</button>';
 if(!session.queue.length){const ok=session.total-session.wrong.size;rvBody.innerHTML=`<div class="rvsum"><h2>Sessão concluída 🎉</h2><p>Você acertou ${ok} de ${session.total} de primeira.</p></div><div class="rvbtns">${closeBtn}</div>`;updateProgress();render();rvBody.querySelector('button').focus();return}
 const c=cards.find(x=>x.id===session.queue[0]),t=topicById(c.topic);
 rvBody.innerHTML=`<div class="rvhead"><span>${session.queue.length} na fila · ${session.total} no total</span><button class="btn ghost" type="button" data-rv="close">Fechar</button></div>${session.note?`<p class="note">${esc(session.note)}</p>`:''}<p class="rvtopic">${t?esc(t.icon+' '+t.title):''}</p><div class="fcard" aria-live="polite">${esc(c.front)}</div>${session.revealed?`<div class="fcard back">${esc(c.back)}</div><div class="rvbtns"><button class="btn bad" type="button" data-rv="wrong">Errei</button><button class="btn ok" type="button" data-rv="right">Acertei</button></div>`:`<div class="rvbtns"><button class="btn" type="button" data-rv="show">Mostrar resposta</button></div>`}`;
 rvBody.querySelector('[data-rv="show"],[data-rv="right"]').focus();
}
function answer(right){const id=session.queue.shift(),c=cards.find(x=>x.id===id);if(c){if(right){c.box=Math.min((c.box||0)+1,INTERVALS.length-1);c.due=Date.now()+INTERVALS[c.box]*DAY}else{c.box=0;c.due=0;session.wrong.add(id);session.queue.push(id)}store.set(KEYS.cards,cards)}session.revealed=false;renderReview()}
rvBody.addEventListener('click',e=>{const a=e.target.dataset.rv;if(!a)return;if(a==='close'){dlg.close();return}if(a==='show'){session.revealed=true;renderReview()}else answer(a==='right')});
dlg.addEventListener('close',()=>{session=null;updateProgress();render()});
document.getElementById('reviewBtn').addEventListener('click',()=>startReview());
document.getElementById('search').addEventListener('input',render);
document.getElementById('filter').addEventListener('change',render);
