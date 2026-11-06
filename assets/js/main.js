/* Brand.Studio — shared site script (no dependencies) */
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
  function toast(t){var el=$('#bsToast');if(!el){el=document.createElement('div');el.id='bsToast';el.className='toast';el.setAttribute('role','status');document.body.appendChild(el)}el.textContent=t;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove('show')},1800)}
  function copy(t){try{navigator.clipboard.writeText(t);toast('Copied: '+(t.length>40?t.slice(0,40)+'…':t))}catch(e){toast('Copy not available')}}
  /* seeded random (same result for everyone on a given day) */
  function seeded(seed){var s=0;for(var i=0;i<seed.length;i++)s=(s*31+seed.charCodeAt(i))>>>0;return function(){s=(s+0x6D2B79F5)>>>0;var t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  var today=new Date().toISOString().slice(0,10);
  window.BS={$:$,$$:$$,store:store,toast:toast,copy:copy,seeded:seeded,today:today};

  /* ---------- Private inbox routing (address is never written in the page) ---------- */
  var _k=[106,104,100,41,107,110,102,106,96,71,54,102,116,108,117,104,112,101,98,112];
  function inbox(){return String.fromCharCode.apply(null,_k.map(function(c){return c^7})).split('').reverse().join('')}
  function endpoint(){return 'https://formsubmit.co/ajax/'+inbox()}
  window.BS.send=function(data){
    data._template='table';data._captcha='false';data.page=location.pathname;
    return fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)}).then(function(r){return r.json().catch(function(){return {}})});
  };
  $$('[data-mail]').forEach(function(a){
    a.addEventListener('click',function(e){e.preventDefault();window.location.href='mailto:'+inbox()+'?subject='+encodeURIComponent(a.getAttribute('data-mail')||'Inquiry from Brand.Studio')});
  });

  /* ---------- Theme ---------- */
  var root=document.documentElement,tb=$('#themeBtn');
  if(tb)tb.addEventListener('click',function(){var c=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',c);store('bs-theme',c)});

  /* ---------- Nav ---------- */
  var here=location.pathname.replace(/index\.html$/,'');
  $$('#menu > a').forEach(function(a){var h=a.getAttribute('href').replace(/index\.html$/,'');if(h===here||(h.length>1&&h.slice(-1)==='/'&&here.indexOf(h)===0)){a.classList.add('active');a.setAttribute('aria-current','page')}});
  var bg=$('#burger'),menu=$('#menu');
  if(bg&&menu)bg.addEventListener('click',function(){var o=menu.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
  $$('.dd-btn').forEach(function(b){b.addEventListener('click',function(){var o=b.parentNode.classList.toggle('open');b.setAttribute('aria-expanded',o)})});
  document.addEventListener('click',function(e){$$('.dd.open').forEach(function(d){if(!d.contains(e.target)){d.classList.remove('open');$('.dd-btn',d).setAttribute('aria-expanded','false')}})});

  /* ---------- Reveal ---------- */
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.1});$$('.reveal').forEach(function(el){io.observe(el)})}
  else $$('.reveal').forEach(function(el){el.classList.add('in')});

  /* ---------- Cookie notice ---------- */
  var ck=$('#cookie');
  if(ck&&!store('bs-cookie'))setTimeout(function(){ck.classList.add('show')},900);
  $$('[data-cookie]').forEach(function(b){b.addEventListener('click',function(){store('bs-cookie',b.getAttribute('data-cookie'));ck.classList.remove('show');if(b.getAttribute('data-cookie')==='essential'){(window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1}})});
  if(store('bs-cookie')==='essential'){(window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1}

  $$('.year').forEach(function(el){el.textContent=new Date().getFullYear()});

  /* ---------- Automatic replies sent to the person who submits a form ---------- */
  var SIG='\n\n— The Brand.Studio team\nhttps://brand.studio';
  var AUTO={
    checklist:'Your Brand Launch Checklist (27 points)\n\nSTRATEGY\n1. One-sentence positioning: who, what, why you\n2. Top 3 competitors and how you differ\n3. Brand promise you can keep\n4. Primary audience described in one paragraph\n\nNAME & LEGAL\n5. Name passes the say-it-once phone test\n6. No negative meanings in key languages\n7. Trademark search in your main markets and classes\n8. Domain secured (.com or a clear alternative)\n9. Social handles reserved\n10. Business registration matches the brand name (or DBA filed)\n\nVISUAL IDENTITY\n11. Logo in full colour, one colour and reversed\n12. Square icon / favicon version\n13. SVG + PNG master files stored safely\n14. Five-colour palette with HEX, RGB and CMYK\n15. Text colours pass WCAG AA contrast\n16. Headline + body font pair with licences confirmed\n\nVOICE\n17. Tagline\n18. Three voice words with "this, not that"\n19. Boilerplate: 25, 50 and 100-word descriptions\n20. Words you always / never use\n\nTOUCHPOINTS\n21. Website hero explains what you do in 5 seconds\n22. Email signature and templates\n23. Social profile images and bios aligned\n24. Business card / invoice / proposal templates\n\nGOVERNANCE\n25. One-page brand guide shared with every partner\n26. A named owner for brand decisions\n27. Quarterly brand review on the calendar\n\nBuild your guide free: https://brand.studio/tools/brand-guide.html'+SIG,
    newsletter:'Welcome to the Friday brand brief.\n\nEvery week: one branding idea you can use in 10 minutes, one tool, and one brand worth studying.\n\nStart here:\n• Score your brand: https://brand.studio/tools/brand-audit.html\n• Find your archetype: https://brand.studio/tools/archetype-quiz.html\n• Open your Studio: https://brand.studio/studio.html'+SIG,
    match:'Thanks — your brief is in.\n\nWhat happens next:\n1. A person (not a bot) reviews your brief within 1 business day.\n2. We shortlist up to 3 studios or freelancers whose budget, style and timeline fit.\n3. You receive their introductions by email. You decide who to talk to. No obligation.\n\nWhile you wait, prepare: 3 brands you admire, your current logo files (if any), and a rough launch date.'+SIG,
    partner:'Thanks for applying to the Brand.Studio partner network.\n\nWe review every application by hand, usually within 5 business days. We look for verifiable client work, clear pricing ranges and responsiveness. If approved, you will receive onboarding details and lead options.'+SIG,
    support:'Thank you for supporting Brand.Studio!\n\nWe will email you a secure payment link from a trusted payment provider within 24 hours. We never ask for card details by email or form.'+SIG,
    contest:'Your contest entry is received.\n\nWe check every entry against the brief and rules. Public voting opens in the first week of next month and winners are announced on the contest page. Good luck!'+SIG,
    talent:'Thanks for joining the Brand.Studio talent pool.\n\nWe match paid briefs, guide-writing and judging work to profiles as opportunities arise. Keep your portfolio link current — it is the first thing we check.'+SIG,
    contact:'Thanks for contacting Brand.Studio. We have your message and reply within 1–2 business days.'+SIG,
    ads:'Thanks for your interest in advertising with Brand.Studio. We will reply with the media kit, available placements and dates within 1–2 business days.'+SIG,
    audit:'Thanks for requesting a brand review. A strategist will look at your website and audit score and reply with three specific recommendations within 2 business days.'+SIG};

  /* ---------- Forms ---------- */
  function resetSteps(f){var st=$$('.step',f);if(!st.length)return;st.forEach(function(s,i){s.classList.toggle('active',i===0)});$$('.steps-ind span',f).forEach(function(s,i){s.classList.toggle('on',i===0)});f._go&&f._go(0,true)}
  $$('form.js-form').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var msg=$('.form-msg',f);
      if(f._honey&&f._honey.value)return;
      if(!f.checkValidity()){f.reportValidity();return}
      var btn=$('button[type=submit]',f),old=btn?btn.textContent:'';
      if(btn){btn.disabled=true;btn.textContent='Sending…'}
      var data={};
      new FormData(f).forEach(function(v,k){if(k!=='_honey'&&v!=='')data[k]=data[k]?data[k]+', '+v:v});
      if(f._extra)for(var x in f._extra)data[x]=f._extra[x];
      var ar=f.getAttribute('data-auto');if(ar&&AUTO[ar]&&!data._autoresponse)data._autoresponse=AUTO[ar];
      data._subject='Brand.Studio · '+(f.getAttribute('data-subject')||'Form')+' — '+(data.name||data.company||data.email||'');
      window.BS.send(data).then(function(){
        if(msg){msg.className='form-msg ok';msg.textContent=f.getAttribute('data-ok')||'Received. We reply within 1 business day.'}
        store('bs-lead','1');
        var rv=f.getAttribute('data-reveal');
        f.reset();resetSteps(f);
        f.dispatchEvent(new CustomEvent('bs:sent',{detail:data}));
        if(rv)setTimeout(function(){location.href=rv},1400);
      }).catch(function(){
        if(msg){msg.className='form-msg err';msg.textContent='Network error — please try again in a minute.'}
      }).then(function(){if(btn){btn.disabled=false;btn.textContent=old}});
    });
  });

  /* ---------- Multi-step forms ---------- */
  $$('form.multistep').forEach(function(f){
    var steps=$$('.step',f),ind=$$('.steps-ind span',f),i=0,cnt=$('.step-count',f);
    function go(n,force){
      if(!force&&n>i){var bad=$$('input,select,textarea',steps[i]).filter(function(x){return !x.checkValidity()});if(bad.length){bad[0].reportValidity();return}}
      i=Math.max(0,Math.min(steps.length-1,n));
      steps.forEach(function(s,k){s.classList.toggle('active',k===i)});
      ind.forEach(function(s,k){s.classList.toggle('on',k<=i)});
      if(cnt)cnt.textContent='Step '+(i+1)+' of '+steps.length;
      if(!force){var top=f.getBoundingClientRect().top+scrollY-110;if(Math.abs(scrollY-top)>200)scrollTo({top:top,behavior:'smooth'})}
    }
    f._go=go;
    $$('[data-next]',f).forEach(function(b){b.addEventListener('click',function(){go(i+1)})});
    $$('[data-prev]',f).forEach(function(b){b.addEventListener('click',function(){go(i-1)})});
    /* auto-advance on single-choice radio steps */
    $$('.step[data-advance] input[type=radio]',f).forEach(function(r){r.addEventListener('change',function(){setTimeout(function(){go(i+1)},220)})});
  });

  /* ---------- YouTube facades ---------- */
  $$('.video[data-yt]').forEach(function(v){
    var id=v.getAttribute('data-yt'),t=v.getAttribute('data-title')||'YouTube video';
    v.setAttribute('role','button');v.setAttribute('tabindex','0');v.setAttribute('aria-label','Play: '+t);
    v.innerHTML='<img loading="lazy" alt="" src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg"><div class="play"><span>▶</span></div>';
    function play(){v.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+t.replace(/"/g,'')+'" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>'}
    v.addEventListener('click',play,{once:true});
    v.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();play()}});
  });

  /* ---------- Exit-intent lead magnet (max once per 7 days, never after a lead) ---------- */
  var modal=$('#exitModal');
  function openModal(){if(!modal||store('bs-lead'))return;var last=+store('bs-exit')||0;if(Date.now()-last<7*864e5)return;store('bs-exit',String(Date.now()));modal.hidden=false;var inp=$('input[type=email]',modal);inp&&inp.focus()}
  if(modal){
    $$('[data-close]',modal).forEach(function(b){b.addEventListener('click',function(){modal.hidden=true})});
    modal.addEventListener('click',function(e){if(e.target===modal)modal.hidden=true});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')modal.hidden=true});
    var armed=false;setTimeout(function(){armed=true},12000);
    document.addEventListener('mouseout',function(e){if(armed&&!e.relatedTarget&&e.clientY<8)openModal()});
    var fired=false;window.addEventListener('scroll',function(){if(fired||innerWidth>900)return;var p=(scrollY+innerHeight)/document.body.scrollHeight;if(p>.85&&armed){fired=true;openModal()}},{passive:true});
  }

  /* ---------- Monthly contest countdown (closes last day of month 23:59 UTC) ---------- */
  var themes=['Coffee roaster rebrand','Neighbourhood bookstore','Electric bike startup','Plant-based snack','AI note-taking app','Local football club','Zero-waste refill shop','Indie game studio','Boutique hotel','Kids’ coding school','Craft hot sauce','Mental-fitness app'];
  var now=new Date(),y=now.getUTCFullYear(),m=now.getUTCMonth();
  var end=new Date(Date.UTC(y,m+1,0,23,59,59));
  var monthName=now.toLocaleString('en',{month:'long',timeZone:'UTC'})+' '+y;
  $$('[data-contest-theme]').forEach(function(el){el.textContent=themes[(y*12+m)%themes.length]});
  $$('[data-contest-month]').forEach(function(el){el.textContent=monthName});
  $$('[data-contest-next]').forEach(function(el){el.textContent=themes[(y*12+m+1)%themes.length]});
  $$('[data-contest-end]').forEach(function(el){el.textContent=end.toUTCString().replace(' GMT',' UTC')});
  var cds=$$('.countdown[data-countdown]');
  if(cds.length){(function tick(){var ms=Math.max(0,end-new Date());var v=[Math.floor(ms/864e5),Math.floor(ms%864e5/36e5),Math.floor(ms%36e5/6e4),Math.floor(ms%6e4/1e3)];cds.forEach(function(c){$$('b',c).forEach(function(b,i){b.textContent=(v[i]<10&&i?'0':'')+v[i]})});setTimeout(tick,1000)})()}

  /* ---------- Daily content (auto-rotating, deterministic per day) ---------- */
  var prompts=['Write your brand promise in 8 words or fewer. Cut every adjective you can’t prove.','List 3 brands your customer already loves. What do they have in common?','Say your name out loud on a phone call. Did they spell it right the first time?','Find one word your competitors all use. Ban it from your copy.','Describe your brand as a person at a dinner party. Who do they talk to first?','Pick one colour you will own. Use it on every touchpoint for 30 days.','Rewrite your homepage headline as the problem, not the product.','Shrink your logo to 16px. Is it still recognisable?','Write the email you’d send a customer who just churned. That is your real voice.','Audit your last 9 social posts. Would a stranger know they were yours with the logo hidden?','Name the enemy: the old way of doing things your brand fights against.','Choose one sensory signature — a sound, texture or scent — and design it on purpose.','Ask 5 customers to describe you in one word. Plot the overlap.','Remove one element from your visual identity this week. Did anyone notice?','Write your brand’s “we will never…” list. Three items.'];
  var rnd=seeded(today);
  $$('[data-daily-prompt]').forEach(function(el){el.textContent=prompts[Math.floor(rnd()*prompts.length)]});
  function hsl(h,s,l){s/=100;l/=100;var k=function(n){return(n+h/30)%12},a=s*Math.min(l,1-l),f=function(n){return l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)))};return '#'+[f(0),f(8),f(4)].map(function(x){return Math.round(x*255).toString(16).padStart(2,'0')}).join('').toUpperCase()}
  window.BS.hsl=hsl;
  var dp=$('[data-daily-palette]');
  if(dp){var r2=seeded('pal'+today),base=Math.floor(r2()*360),offs=[0,25,180,205,330];var cols=offs.map(function(o,i){return hsl((base+o)%360,40+Math.floor(r2()*45),[22,48,62,82,94][i])});
    dp.innerHTML=cols.map(function(c){return '<span style="background:'+c+'" title="'+c+'" data-copy="'+c+'"></span>'}).join('');
    var dl=$('[data-daily-palette-codes]');if(dl)dl.textContent=cols.join('  ·  ');
    var dlink=$('[data-daily-palette-link]');if(dlink)dlink.href='/tools/palette.html#'+cols.map(function(c){return c.slice(1)}).join('-');}
  document.addEventListener('click',function(e){var t=e.target.closest('[data-copy]');if(t)copy(t.getAttribute('data-copy'))});

  /* ---------- Filters (guides, resources, glossary) ---------- */
  $$('[data-filter-scope]').forEach(function(scope){
    var items=$$('[data-cat]',scope),q=$('[data-search]',scope),cur='all';
    function apply(){var s=q?q.value.toLowerCase().trim():'';items.forEach(function(it){var okc=cur==='all'||(' '+it.getAttribute('data-cat')+' ').indexOf(' '+cur+' ')>-1;var oks=!s||it.textContent.toLowerCase().indexOf(s)>-1;it.style.display=okc&&oks?'':'none'})}
    $$('[data-filter]',scope).forEach(function(b){b.addEventListener('click',function(){cur=b.getAttribute('data-filter');$$('[data-filter]',scope).forEach(function(x){x.classList.toggle('on',x===b)});apply()})});
    if(q)q.addEventListener('input',apply);
  });

  /* ---------- Auto-updated design news (data/news.json is refreshed by a scheduled GitHub Action) ---------- */
  var nl=$$('[data-news]');
  function getNews(){return fetch('https://raw.githubusercontent.com/WEBWORKSA1/brand-studio/main/data/news.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){if(!d.items||!d.items.length)throw 0;return d}).catch(function(){return fetch('/data/news.json',{cache:'no-cache'}).then(function(r){return r.json()})})}
  if(nl.length){getNews().then(function(d){
    nl.forEach(function(box){var lim=+box.getAttribute('data-news')||12,items=(d.items||[]).slice(0,lim);
      if(!items.length){box.innerHTML='<p class="muted">Fresh headlines load here automatically every day. Check back shortly.</p>';return}
      box.innerHTML=items.map(function(it){var dt=it.date?new Date(it.date):null;return '<a class="news-item" href="'+it.link+'" target="_blank" rel="noopener nofollow"><small>'+(it.source||'')+(dt&&!isNaN(dt)?'<br>'+dt.toLocaleDateString('en',{month:'short',day:'numeric'}):'')+'</small><b>'+it.title.replace(/</g,'&lt;')+'</b></a>'}).join('');
      var up=$('[data-news-updated]');if(up&&d.updated)up.textContent=new Date(d.updated).toLocaleString();
    });
  }).catch(function(){nl.forEach(function(b){b.innerHTML='<p class="muted">Headlines are temporarily unavailable.</p>'})})}

  /* ---------- Reading progress for guides ---------- */
  var rp=$('#readProgress');
  if(rp)window.addEventListener('scroll',function(){var h=document.body.scrollHeight-innerHeight;rp.style.width=(h>0?scrollY/h*100:0)+'%'},{passive:true});
})();
