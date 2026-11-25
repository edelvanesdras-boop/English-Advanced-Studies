/* Relevant Topics — isolated resource/progress helpers. */
(function(){
  'use strict';
  const KEY='englishStudiesTopicResourcesV1';
  const KEYS=['ted','read','news'];
  const LABELS={ted:'TED / TED-Ed',read:'TEXT / ARTICLE',news:'NEWS / VIDEO PODCAST'};
  const ICONS={ted:'🎥',read:'📖',news:'📰'};
  const api={};
  function load(){try{const v=JSON.parse(localStorage.getItem(KEY));return v&&typeof v==='object'?v:{}}catch(e){return {}}}
  function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}}
  function normalize(v,id){const x=v[String(id)];return {ted:!!(x&&x.ted),read:!!(x&&x.read),news:!!(x&&x.news)}}
  function migrate(topics,done){
    const p=load(); let changed=false;
    topics.forEach(t=>{const k=String(t.n); if(!(k in p)){p[k]=done.has(t.n)?{ted:true,read:true,news:true}:{ted:false,read:false,news:false};changed=true}else{const n=normalize(p,t.n); if(JSON.stringify(n)!==JSON.stringify(p[k])){p[k]=n;changed=true}}});
    if(changed)save(p); return p;
  }
  function count(p,id){const x=normalize(p,id);return KEYS.filter(k=>x[k]).length}
  function complete(p,id){return count(p,id)===3}
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function youtubeId(link){try{const u=new URL(link),h=u.hostname.replace(/^www\./,'');if(h==='youtu.be')return u.pathname.slice(1).split('/')[0]||null;if(/(^|\.)youtube\.com$/.test(h)){if(u.pathname==='/watch')return u.searchParams.get('v');const m=u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{6,15})/);return m?m[1]:null}}catch(e){}return null}
  function embedUrl(key,url){
    if(key==='ted'){try{const u=new URL(url),m=u.pathname.match(/^\/talks\/([^/?#]+)/);if(/(^|\.)ted\.com$/.test(u.hostname)&&m)return 'https://embed.ted.com/talks/'+m[1]}catch(e){}}
    const id=youtubeId(url);return id?'https://www.youtube.com/embed/'+encodeURIComponent(id)+'?rel=0':null;
  }
  function render(t,p){
    const x=normalize(p,t.n), n=count(p,t.n);
    const resourceHtml=KEYS.map(key=>{const item=t[key], can=!!embedUrl(key,item[1]); return `<div class="rt-resource" data-rt-resource="${key}">
      <div class="rt-resource-main"><div class="rt-resource-label"><span class="rt-icon">${ICONS[key]}</span><span>${LABELS[key]}</span></div>
      <a class="rt-resource-name" href="${esc(item[1])}" target="_blank" rel="noopener noreferrer">${esc(item[0])} ↗</a>
      <div class="rt-actions">${can?`<button class="btn ghost rt-open" type="button" data-rt-open="${key}">Abrir aqui</button>`:''}<a class="btn ghost rt-external" href="${esc(item[1])}" target="_blank" rel="noopener noreferrer">Abrir externamente ↗</a></div></div>
      <label class="rt-check"><input type="checkbox" data-rt-check="${key}" ${x[key]?'checked':''}><span>${x[key]?'✓ Concluído':'Marcar como concluído'}</span></label>
    </div>`}).join('');
    return `<div class="rt-progress"><div class="rt-progress-head"><strong>Progresso do tema</strong><span class="rt-count">${n}/3</span></div><div class="rt-bar" role="progressbar" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${n}"><span style="width:${n/3*100}%"></span></div></div><div class="rt-resources">${resourceHtml}</div><div class="rt-embed" hidden></div>`;
  }
  function set(topics,done,store,DONE_KEY,id,key,value){const p=load();p[String(id)]=normalize(p,id);p[String(id)][key]=!!value;save(p);const completeNow=complete(p,id);if(completeNow)done.add(Number(id));else done.delete(Number(id));store.set(DONE_KEY,[...done]);return p}
  function openEmbed(card,key,url){const area=card.querySelector('.rt-embed');if(!area)return;const src=embedUrl(key,url);area.hidden=false;if(!src){area.innerHTML='<div class="rt-embed-note">Este conteúdo não pode ser incorporado automaticamente. Use “Abrir externamente”.</div>';return}area.innerHTML=`<div class="rt-embed-note">Conteúdo incorporado. Se o site bloquear a visualização, use o link externo.</div><iframe src="${esc(src)}" title="Conteúdo de ${LABELS[key]}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><div class="rt-open-external"><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">Abrir externamente ↗</a></div>`}
  api.KEY=KEY;api.KEYS=KEYS;api.migrate=migrate;api.load=load;api.save=save;api.normalize=normalize;api.count=count;api.complete=complete;api.render=render;api.set=set;api.openEmbed=openEmbed;
  window.EASRelevantTopics=api;
})();
