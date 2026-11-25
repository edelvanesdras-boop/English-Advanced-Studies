/* Relevant Topics — V8.1 isolated module.
   It does not duplicate the original topic data or render the app itself.
   It receives explicit references from the original app through window.__EAS_RELEVANT_TOPICS__. */
(function(){
  'use strict';
  const app=window.__EAS_RELEVANT_TOPICS__;
  if(!app){ console.warn('Relevant Topics: app bridge unavailable.'); return; }
  const RT_KEY='englishStudiesTopicProgress';
  const RESOURCE_KEYS=['ted','read','news'];
  const RESOURCE_LABELS={ted:'TED / TED-Ed',read:'TEXT / ARTICLE',news:'NEWS / VIDEO PODCAST'};
  const RESOURCE_ICONS={ted:'🎥',read:'📖',news:'📰'};
  const RT=window.EnglishAdvancedStudiesRelevantTopics={};

  function getProgress(){
    try{const raw=JSON.parse(localStorage.getItem(RT_KEY));return raw&&typeof raw==='object'?raw:{}}
    catch(e){return {}}
  }
  function saveProgress(p){try{localStorage.setItem(RT_KEY,JSON.stringify(p))}catch(e){}}
  function normalizeTopic(p,id){
    const out=p[String(id)]&&typeof p[String(id)]==='object'?p[String(id)]:{};
    return {ted:!!out.ted,read:!!out.read,news:!!out.news};
  }
  function isComplete(p,id){const x=normalizeTopic(p,id);return RESOURCE_KEYS.every(k=>x[k]);}

  function migrate(){
    const p=getProgress(); let changed=false;
    for(const t of app.topics){
      const key=String(t.n);
      if(!p[key]){
        // Preserve the user's existing topic-level completion when upgrading.
        p[key]=app.done.has(t.n)?{ted:true,read:true,news:true}:{ted:false,read:false,news:false};
        changed=true;
      }else{
        const n=normalizeTopic(p,t.n);
        if(JSON.stringify(n)!==JSON.stringify(p[key])){p[key]=n;changed=true;}
      }
    }
    for(const t of app.topics){
      const complete=isComplete(p,t.n);
      if(complete&&!app.done.has(t.n)){app.done.add(t.n);changed=true;}
      if(!complete&&app.done.has(t.n)){app.done.delete(t.n);changed=true;}
    }
    if(changed){saveProgress(p);app.store.set(app.KEYS.done,[...app.done]);app.updateProgress();}
    return p;
  }

  function youtubeId(link){
    try{
      const u=new URL(link); const h=u.hostname.replace(/^www\./,'');
      if(h==='youtu.be')return u.pathname.slice(1).split('/')[0]||null;
      if(/(^|\.)youtube\.com$/.test(h)){
        if(u.pathname==='/watch')return u.searchParams.get('v');
        const m=u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{6,15})/); return m?m[1]:null;
      }
    }catch(e){}
    return null;
  }
  function embedFor(key,url){
    if(key==='ted'){
      try{const u=new URL(url),m=u.pathname.match(/^\/talks\/([^/?#]+)/);if(/(^|\.)ted\.com$/.test(u.hostname)&&m)return 'https://embed.ted.com/talks/'+m[1];}catch(e){}
    }
    const id=youtubeId(url); if(id)return 'https://www.youtube.com/embed/'+encodeURIComponent(id)+'?rel=0';
    return key==='read'?url:null;
  }
  function resourceButton(key,url){
    if(key==='read')return '<button class="btn ghost rt-open" type="button" data-rt-open="read">Ler aqui</button>';
    if(embedFor(key,url))return '<button class="btn ghost rt-open" type="button" data-rt-open="'+key+'">Assistir aqui</button>';
    return '';
  }
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function escapeAttr(s){return escapeHtml(s);}

  function setTopicResource(topicId,key,value){
    const p=getProgress(); p[String(topicId)]=normalizeTopic(p,topicId); p[String(topicId)][key]=!!value; saveProgress(p);
    const complete=isComplete(p,topicId);
    if(complete)app.done.add(Number(topicId));else app.done.delete(Number(topicId));
    app.store.set(app.KEYS.done,[...app.done]); app.updateProgress();
    updateMiniProgress(topicId,p); updateCardState(topicId,p);
  }
  function updateMiniProgress(id,p){
    const card=app.root.querySelector('.card[data-id="'+id+'"]');if(!card)return;
    const x=normalizeTopic(p,id),n=RESOURCE_KEYS.filter(k=>x[k]).length;
    const text=card.querySelector('.rt-mini-text');if(text)text.textContent=n+'/3';
    const bar=card.querySelector('.rt-progress-bar span');if(bar){bar.style.width=(n/3*100)+'%';bar.parentElement.setAttribute('aria-valuenow',String(n));}
  }
  function updateCardState(id,p){
    const card=app.root.querySelector('.card[data-id="'+id+'"]');if(!card)return;
    const complete=isComplete(p,id);card.classList.toggle('done',complete);
    const legacy=card.querySelector('.donebox');if(legacy)legacy.checked=complete;
    const x=normalizeTopic(p,id);
    card.querySelectorAll('.rt-check input').forEach(cb=>{cb.checked=!!x[cb.dataset.rtKey];});
    card.querySelectorAll('.rt-check span').forEach(s=>{s.classList.toggle('rt-done',!!x[s.dataset.rtKey]);});
  }

  function buildEmbed(card,key,url){
    const area=card.querySelector('.rt-embed');if(!area)return;
    const current=area.dataset.loadedKey;if(current===key){area.hidden=false;return;}
    area.dataset.loadedKey=key;area.hidden=false;
    const emb=embedFor(key,url);
    const external='<div class="rt-open-external"><a href="'+escapeAttr(url)+'" target="_blank" rel="noopener noreferrer">Abrir externamente ↗</a></div>';
    if(!emb){area.innerHTML='<div class="rt-embed-note">Este conteúdo não pode ser incorporado automaticamente aqui. Use o link externo.</div>'+external;return;}
    const isArticle=key==='read';area.className='rt-embed'+(isArticle?' article':'');
    area.innerHTML='<div class="rt-embed-note">O conteúdo só é carregado depois que você escolhe abrir aqui. Se o site bloquear a incorporação, use o link externo.</div><iframe src="'+escapeAttr(emb)+'" title="Conteúdo" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'+external;
  }

  function enhanceCard(card,p){
    if(!card||card.dataset.rtEnhanced==='1')return;
    const id=Number(card.dataset.id),topic=app.topics.find(t=>t.n===id);if(!topic)return;
    const progress=normalizeTopic(p,id),count=RESOURCE_KEYS.filter(k=>progress[k]).length;
    const legacy=card.querySelector('.check');if(legacy)legacy.classList.add('rt-hidden-legacy');
    const links=card.querySelector('.links');if(!links)return;
    const resources=document.createElement('div');resources.className='rt-resources';
    resources.innerHTML=RESOURCE_KEYS.map(key=>{
      const data=topic[key],checked=progress[key];
      return '<div class="rt-resource" data-rt-resource="'+key+'"><div class="rt-resource-head"><div class="rt-resource-main"><div class="rt-resource-title"><span>'+RESOURCE_ICONS[key]+'</span><span class="rt-type">'+RESOURCE_LABELS[key]+'</span></div><a class="rt-resource-name" href="'+escapeAttr(data[1])+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(data[0])+' ↗</a><div class="rt-actions">'+resourceButton(key,data[1])+'</div></div><label class="rt-check"><input type="checkbox" data-rt-key="'+key+'" '+(checked?'checked':'')+'><span data-rt-key="'+key+'" class="'+(checked?'rt-done':'')+'">'+(checked?'✓ Concluído':'Marcar como concluído')+'</span></label></div></div>';
    }).join('')+'<div class="rt-embed" hidden></div>';
    links.replaceWith(resources);
    const mini=document.createElement('div');mini.className='rt-progress-mini';mini.innerHTML='<strong>Progresso do tema</strong><span class="rt-mini-text">'+count+'/3</span><div class="rt-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="3" aria-valuenow="'+count+'" aria-label="Progresso do tema"><span style="width:'+(count/3*100)+'%"></span></div>';
    card.querySelector('.cardhead').insertAdjacentElement('afterend',mini);card.dataset.rtEnhanced='1';
  }

  function enhanceAll(){
    if(location.hash!=='#topics')return;
    const p=migrate();app.root.querySelectorAll('.card[data-id]').forEach(c=>enhanceCard(c,p));app.root.querySelectorAll('.card[data-id]').forEach(c=>updateCardState(Number(c.dataset.id),p));
  }

  app.root.addEventListener('change',function(e){
    const cb=e.target.closest&&e.target.closest('.rt-check input');if(!cb)return;
    setTopicResource(Number(cb.closest('.card').dataset.id),cb.dataset.rtKey,cb.checked);
    const span=cb.parentElement.querySelector('span[data-rt-key="'+cb.dataset.rtKey+'"]');if(span){span.textContent=cb.checked?'✓ Concluído':'Marcar como concluído';span.classList.toggle('rt-done',cb.checked);}
  });
  app.root.addEventListener('click',function(e){
    const btn=e.target.closest&&e.target.closest('.rt-open');if(!btn)return;
    const card=btn.closest('.card'),id=Number(card.dataset.id),key=btn.dataset.rtOpen,topic=app.topics.find(t=>t.n===id);if(topic)buildEmbed(card,key,topic[key][1]);
  });
  const observer=new MutationObserver(()=>enhanceAll());observer.observe(app.root,{childList:true});
  window.addEventListener('hashchange',()=>setTimeout(enhanceAll,0));
  RT.refresh=enhanceAll;RT.getProgress=getProgress;RT.setResource=setTopicResource;
  setTimeout(enhanceAll,0);
})();
