/* Brand.Studio — browser tools. Everything runs locally; the brand kit lives in localStorage. */
(function(){
  'use strict';
  var BS=window.BS||{},$=BS.$,$$=BS.$$,store=BS.store,toast=BS.toast,copy=BS.copy;
  if(!$)return;
  var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var pick=function(a){return a[Math.floor(Math.random()*a.length)]};
  var cap=function(s){return s.charAt(0).toUpperCase()+s.slice(1)};
  var clean=function(s){return String(s||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean)};
  var qs=new URLSearchParams(location.search);

  /* ---------- Brand kit (shared across tools) ---------- */
  var KIT_KEY='bs-kit';
  function getKit(){try{return JSON.parse(store(KIT_KEY)||'{}')}catch(e){return {}}}
  function setKit(patch,msg){var k=getKit();for(var p in patch)k[p]=patch[p];k.updated=new Date().toISOString();store(KIT_KEY,JSON.stringify(k));if(msg!==false)toast(msg||'Saved to your brand kit');return k}
  BS.getKit=getKit;BS.setKit=setKit;

  /* ---------- Colour helpers ---------- */
  function hexToRgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c}).join('');var n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255]}
  function rgbToHex(r,g,b){return '#'+[r,g,b].map(function(x){return Math.round(Math.max(0,Math.min(255,x))).toString(16).padStart(2,'0')}).join('').toUpperCase()}
  function hexToHsl(h){var c=hexToRgb(h).map(function(x){return x/255}),r=c[0],g=c[1],b=c[2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),H=0,S=0,L=(mx+mn)/2;if(mx!==mn){var d=mx-mn;S=L>.5?d/(2-mx-mn):d/(mx+mn);H=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;H*=60}return [H,S*100,L*100]}
  var hsl=BS.hsl;
  function lum(h){var c=hexToRgb(h).map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
  function contrast(a,b){var x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
  function onColor(h){return contrast(h,'#FFFFFF')>=contrast(h,'#111111')?'#FFFFFF':'#111111'}
  function isHex(s){return /^#?[0-9a-f]{6}$/i.test(s)}
  BS.contrast=contrast;BS.onColor=onColor;

  /* ---------- Fonts ---------- */
  var PAIRS=[
    {h:'Playfair Display',b:'Source Sans 3',mood:'Editorial',tags:'serif elegant'},
    {h:'Montserrat',b:'Merriweather',mood:'Corporate',tags:'sans trustworthy'},
    {h:'Space Grotesk',b:'Inter',mood:'Tech',tags:'sans modern tech'},
    {h:'DM Serif Display',b:'DM Sans',mood:'Premium',tags:'serif elegant'},
    {h:'Syne',b:'Inter',mood:'Creative',tags:'display bold'},
    {h:'Archivo Black',b:'Archivo',mood:'Bold',tags:'sans bold'},
    {h:'Cormorant Garamond',b:'Proza Libre',mood:'Luxury',tags:'serif elegant'},
    {h:'Poppins',b:'Lora',mood:'Friendly',tags:'sans friendly'},
    {h:'Bebas Neue',b:'Open Sans',mood:'Sport',tags:'display bold'},
    {h:'Josefin Sans',b:'Libre Baskerville',mood:'Vintage',tags:'sans classic'},
    {h:'Rubik',b:'Karla',mood:'Playful',tags:'sans friendly'},
    {h:'Sora',b:'Nunito Sans',mood:'Startup',tags:'sans modern tech'},
    {h:'Libre Caslon Text',b:'Work Sans',mood:'Classic',tags:'serif classic trustworthy'},
    {h:'Unbounded',b:'Figtree',mood:'Futuristic',tags:'display modern tech'},
    {h:'Fraunces',b:'Manrope',mood:'Warm editorial',tags:'serif friendly'},
    {h:'Oswald',b:'Roboto',mood:'Industrial',tags:'sans bold'},
    {h:'Abril Fatface',b:'Lato',mood:'Fashion',tags:'display elegant'},
    {h:'Raleway',b:'Roboto Slab',mood:'Clean',tags:'sans trustworthy'},
    {h:'Outfit',b:'Literata',mood:'Modern',tags:'sans modern'},
    {h:'Bricolage Grotesque',b:'Instrument Sans',mood:'Indie',tags:'display friendly'},
    {h:'Chivo',b:'Spectral',mood:'Journal',tags:'sans classic'},
    {h:'Lexend',b:'Source Serif 4',mood:'Readable',tags:'sans trustworthy'},
    {h:'Pacifico',b:'Quicksand',mood:'Fun',tags:'display friendly'},
    {h:'Cinzel',b:'Fauna One',mood:'Heritage',tags:'serif classic elegant'}
  ];
  var SINGLE={'DM Serif Display':1,'Archivo Black':1,'Bebas Neue':1,'Abril Fatface':1,'Pacifico':1,'Fauna One':1};
  var loaded={};
  function loadFont(f){if(!f||loaded[f])return;loaded[f]=1;var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+f.replace(/ /g,'+')+(SINGLE[f]?'':':wght@400;700')+'&display=swap';document.head.appendChild(l)}
  function fstack(f,serif){return "'"+f+"',"+(serif?'Georgia,serif':'system-ui,sans-serif')}
  BS.loadFont=loadFont;BS.PAIRS=PAIRS;

  /* ---------- Hero mini-studio ---------- */
  var hero=$('#heroStudio');
  if(hero){
    var hn=$('#heroName'),hw=$('#heroWm'),hp=$('#heroPreview'),hs=$('#heroSw'),ht=$('#heroTl');
    var lines=['Made with care, built to last.','Small team. Big ideas.','The better way to get it done.','Clarity, delivered.','Crafted for people who notice.','Bold by design.'];
    function shuffle(){
      var p=pick(PAIRS);loadFont(p.h);loadFont(p.b);
      var base=Math.floor(Math.random()*360),cols=[hsl(base,70,45),hsl((base+30)%360,55,60),hsl((base+180)%360,60,50),hsl(base,30,92),hsl(base,30,12)];
      var bgc=Math.random()<.5?cols[3]:cols[0];
      hp.style.background=bgc;hp.style.color=bgc===cols[3]?cols[4]:onColor(bgc);
      hw.style.fontFamily=fstack(p.h,/serif/.test(p.tags));hw.style.fontWeight=SINGLE[p.h]?400:700;
      ht.style.fontFamily=fstack(p.b);ht.textContent=pick(lines);
      hs.innerHTML=cols.map(function(c){return '<span style="background:'+c+'" data-copy="'+c+'" title="'+c+'"></span>'}).join('');
      hero._state={pair:p,cols:cols};
    }
    hn.addEventListener('input',function(){hw.textContent=hn.value||'Your brand'});
    $('#heroShuffle').addEventListener('click',shuffle);
    $('#heroOpen').addEventListener('click',function(){var s=hero._state;setKit({name:hn.value||'Your brand',colors:s.cols,fontH:s.pair.h,fontB:s.pair.b,tagline:ht.textContent},false)});
    shuffle();
  }

  /* ---------- Name generator ---------- */
  var nt=$('#nameTool');
  if(nt){
    var SUF=['ly','ify','io','ora','eon','ix','sy','able','ster','va','wise','ful','ium','era','zy','o','a','os'];
    var PRE=['Go','Up','Neo','Re','Pro','Get','Try','Hey','Omni','Via','True','All','Max','Bright','Ever'];
    var NOUN=['Labs','Works','Co','House','Supply','Collective','Hub','Forge','Field','Craft','Bureau','Guild','Club','Lane','Yard'];
    var META={nature:['Cedar','Juniper','Fern','Harbor','Summit','Quarry','Meadow','Tide','Ember','Willow','Aspen','Coral','Moss','Ridge'],
      motion:['Kite','Orbit','Sprint','Drift','Glide','Arc','Pulse','Vector','Rally','Swift','Momentum','Relay','Launch'],
      light:['Lumen','Halo','Prism','Glow','Flare','Aurora','Beacon','Lantern','Spark','Radiant','Dawn','Nova'],
      myth:['Atlas','Fable','Oracle','Odyssey','Titan','Phoenix','Muse','Sage','Rune','Echo','Valor','Meridian','Sable']};
    var C='bcdfghjklmnprstvz',V='aeiou',ENDS=['a','o','i','en','ar','ix','on','um','el','ia'];
    function abstract(){var p=pick(['cvcv','cvccv','vcv','cvcvc','cvcvv']),o='';for(var i=0;i<p.length;i++)o+=p[i]==='c'?pick(C.split('')):pick(V.split(''));if(Math.random()<.4)o=o.slice(0,-1)+pick(ENDS);return cap(o)}
    function misspell(w){return w.replace(/c(?=[aou])/,'k').replace(/ph/,'f').replace(/er$/,'r').replace(/s$/,'z').replace(/y$/,'i').replace(/([a-z])\1/,'$1')}
    function blend(a,b){var x=a.slice(0,Math.ceil(a.length*.6)),y=b.slice(Math.floor(b.length*.4));if(V.indexOf(x.slice(-1))>-1&&V.indexOf(y[0])>-1)y=y.slice(1);return cap(x+y)}
    function score(n){
      var s=100,l=n.length,low=n.toLowerCase();
      if(l>8)s-=(l-8)*6;if(l<4)s-=12;
      var vow=(low.match(/[aeiouy]/g)||[]).length/l;if(vow<.25||vow>.65)s-=15;
      if(/[bcdfghjklmnpqrstvwxz]{3,}/.test(low))s-=18;
      if(/(.)\1\1/.test(low))s-=20;
      if(/[qxz]/.test(low))s+=3;
      if(/^[aeiou]/.test(low))s-=4;
      if(/ /.test(n))s-=10;
      return Math.max(5,Math.min(99,Math.round(s)))}
    var favs=[];try{favs=JSON.parse(store('bs-names')||'[]')}catch(e){}
    function renderFavs(){var f=$('#nameFavs');if(!f)return;$('#favCount').textContent=favs.length;f.innerHTML=favs.length?favs.map(function(n){return '<span class="tag" style="font-size:.82rem;padding:8px 10px">'+esc(n)+' <a href="#" data-unfav="'+esc(n)+'" aria-label="Remove '+esc(n)+'" style="text-decoration:none;color:var(--red)">×</a></span>'}).join(' '):'<span class="muted tiny">Tap ♡ on a name to shortlist it.</span>'}
    nt.addEventListener('click',function(e){var u=e.target.closest('[data-unfav]');if(u){e.preventDefault();favs=favs.filter(function(x){return x!==u.getAttribute('data-unfav')});store('bs-names',JSON.stringify(favs));renderFavs()}});
    function gen(){
      var kws=clean($('#nKw').value);if(!kws.length)kws=['brand'];
      var styles=$$('input[name=nStyle]:checked',nt).map(function(x){return x.value});if(!styles.length)styles=['compound','blend','suffix','metaphor','abstract'];
      var maxL=+$('#nLen').value||12,tld=$('#nTld').value,vibe=$('#nVibe').value,out={},tries=0;
      while(Object.keys(out).length<24&&tries<600){
        tries++;var st=pick(styles),k=pick(kws),n='',w=META[vibe==='any'?pick(Object.keys(META)):vibe];
        if(st==='compound')n=Math.random()<.5?cap(k)+pick(w):pick(w)+cap(k);
        else if(st==='blend')n=blend(k,kws.length>1&&Math.random()<.6?pick(kws.filter(function(x){return x!==k}))||pick(w).toLowerCase():pick(w).toLowerCase());
        else if(st==='suffix')n=cap(k.replace(/[aeiouy]$/,''))+pick(SUF);
        else if(st==='prefix')n=pick(PRE)+cap(k);
        else if(st==='metaphor')n=pick(w);
        else if(st==='abstract')n=abstract();
        else if(st==='misspell')n=cap(misspell(k+pick(['er','ly','s','y','o'])));
        else if(st==='phrase')n=cap(k)+' '+pick(NOUN);
        if(!n||n.length>maxL||n.length<3||out[n])continue;
        out[n]=score(n);
      }
      var list=Object.keys(out).sort(function(a,b){return out[b]-out[a]});
      $('#nOut').innerHTML=list.map(function(n){
        var slug=n.toLowerCase().replace(/[^a-z0-9]/g,''),on=favs.indexOf(n)>-1;
        return '<div class="name-card"><div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><b>'+esc(n)+'</b><span class="score">'+out[n]+'/100</span></div><span class="tiny mono">'+slug+tld+'</span><div class="acts"><button type="button" data-fav="'+esc(n)+'" class="'+(on?'saved':'')+'">'+(on?'♥ Saved':'♡ Save')+'</button><button type="button" data-copy="'+esc(n)+'">Copy</button><a href="https://www.namecheap.com/domains/registration/results/?domain='+slug+tld+'" target="_blank" rel="noopener nofollow">Domain ↗</a><a href="/tools/trademark-check.html?q='+encodeURIComponent(n)+'">™ Check</a><button type="button" data-kit="'+esc(n)+'">Use</button></div></div>'}).join('');
    }
    nt.addEventListener('click',function(e){
      var f=e.target.closest('[data-fav]');if(f){var n=f.getAttribute('data-fav'),i=favs.indexOf(n);if(i>-1)favs.splice(i,1);else favs.unshift(n);store('bs-names',JSON.stringify(favs.slice(0,60)));f.classList.toggle('saved',i<0);f.textContent=i<0?'♥ Saved':'♡ Save';renderFavs()}
      var k=e.target.closest('[data-kit]');if(k)setKit({name:k.getAttribute('data-kit')},'“'+k.getAttribute('data-kit')+'” set as your brand name');
    });
    $('#nGo').addEventListener('click',gen);
    $('#nKw').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();gen()}});
    var cf=$('#copyFavs');if(cf)cf.addEventListener('click',function(){copy(favs.join('\n'))});
    if(qs.get('q'))$('#nKw').value=qs.get('q');
    renderFavs();gen();
  }

  /* ---------- Palette builder ---------- */
  var pt=$('#palTool');
  if(pt){
    var cols=[],locks=[false,false,false,false,false];
    function genPal(){
      var mode=$('#pMode').value,base=$('#pBase').value,h=hexToHsl(base),H=h[0],S=Math.max(35,h[1]);
      if($('#pRandom').checked){H=Math.random()*360;S=45+Math.random()*45}
      var sets={
        analogous:[[0,S,45],[-28,S*.9,58],[28,S*.85,52],[0,S*.25,93],[0,S*.35,12]],
        complementary:[[0,S,46],[0,S*.7,64],[180,S*.9,50],[0,S*.2,94],[0,S*.3,11]],
        triadic:[[0,S,48],[120,S*.8,52],[240,S*.8,55],[0,S*.15,95],[0,S*.3,12]],
        split:[[0,S,47],[150,S*.75,55],[210,S*.75,52],[0,S*.18,94],[0,S*.3,12]],
        mono:[[0,S,20],[0,S,38],[0,S*.95,55],[0,S*.7,75],[0,S*.35,93]],
        earthy:[[0,S*.45,38],[25,S*.4,55],[-20,S*.35,30],[30,S*.3,88],[0,S*.2,14]]};
      var set=sets[mode]||sets.analogous;
      cols=set.map(function(t,i){return locks[i]&&cols[i]?cols[i]:hsl((H+t[0]+360)%360,Math.min(95,t[1]),t[2])});
      renderPal();
    }
    function renderPal(){
      var names=['Primary','Secondary','Accent','Light','Dark'];
      $('#pOut').innerHTML=cols.map(function(c,i){var oc=onColor(c);return '<div style="background:'+c+';color:'+oc+'"><button type="button" data-lock="'+i+'" aria-label="Lock colour '+(i+1)+'">'+(locks[i]?'🔒':'🔓')+'</button><input type="color" value="'+c.toLowerCase()+'" data-edit="'+i+'" aria-label="Edit '+names[i]+'"><span style="font-size:.7rem;opacity:.8">'+names[i]+'</span><span data-copy="'+c+'" style="cursor:pointer;position:relative;z-index:2">'+c+'</span></div>'}).join('');
      var pairs=[[4,3,'Dark on light'],[3,4,'Light on dark'],[0,3,'Primary on light'],[3,0,'Light on primary'],[2,4,'Accent on dark'],[4,1,'Dark on secondary']];
      $('#pContrast').innerHTML='<tr><th>Pairing</th><th>Ratio</th><th>Body text (AA 4.5)</th><th>Large text (AA 3)</th></tr>'+pairs.map(function(p){var r=contrast(cols[p[0]],cols[p[1]]);return '<tr><td><span style="display:inline-block;padding:4px 10px;border-radius:6px;background:'+cols[p[1]]+';color:'+cols[p[0]]+';font-weight:700">Aa</span> '+p[2]+'</td><td class="mono">'+r.toFixed(2)+':1</td><td class="'+(r>=4.5?'pass':'fail')+'">'+(r>=4.5?'Pass':'Fail')+'</td><td class="'+(r>=3?'pass':'fail')+'">'+(r>=3?'Pass':'Fail')+'</td></tr>'}).join('');
      $('#pCss').value=':root{\n'+cols.map(function(c,i){return '  --brand-'+names[i].toLowerCase()+': '+c+';'}).join('\n')+'\n}';
      history.replaceState(null,'','#'+cols.map(function(c){return c.slice(1)}).join('-'));
    }
    pt.addEventListener('click',function(e){var l=e.target.closest('[data-lock]');if(l){var i=+l.getAttribute('data-lock');locks[i]=!locks[i];renderPal()}});
    pt.addEventListener('input',function(e){var ed=e.target.closest('[data-edit]');if(ed){cols[+ed.getAttribute('data-edit')]=ed.value.toUpperCase();locks[+ed.getAttribute('data-edit')]=true;renderPal()}});
    $('#pGo').addEventListener('click',genPal);
    ['pMode','pBase'].forEach(function(id){$('#'+id).addEventListener('change',function(){$('#pRandom').checked=false;genPal()})});
    document.addEventListener('keydown',function(e){if(e.code==='Space'&&!/INPUT|TEXTAREA|SELECT|BUTTON/.test(document.activeElement.tagName)){e.preventDefault();genPal()}});
    $('#pSave').addEventListener('click',function(){setKit({colors:cols.slice()})});
    $('#pCopy').addEventListener('click',function(){copy($('#pCss').value)});
    var hh=location.hash.slice(1).split('-');
    if(hh.length===5&&hh.every(function(x){return isHex(x)})){cols=hh.map(function(x){return '#'+x.toUpperCase()});locks=[true,true,true,true,true];renderPal();locks=[false,false,false,false,false];$('#pBase').value=cols[0].toLowerCase()}
    else{var kc=getKit().colors;if(kc&&kc.length===5){cols=kc;renderPal()}else{$('#pRandom').checked=true;genPal();$('#pRandom').checked=false}}
  }

  /* ---------- Font pairing ---------- */
  var ft=$('#fontTool');
  if(ft){
    function renderFonts(){
      var hT=$('#fH').value||'Make something people remember',bT=$('#fB').value||'Good typography is invisible until it isn’t. Pair a confident headline face with a calm, readable body face.',cat=$('#fCat').value;
      var list=PAIRS.filter(function(p){return cat==='all'||p.tags.indexOf(cat)>-1});
      list.forEach(function(p){loadFont(p.h);loadFont(p.b)});
      $('#fOut').innerHTML=list.map(function(p){return '<div class="font-pair"><div class="h" style="font-family:'+fstack(p.h,/serif/.test(p.tags))+';font-weight:'+(SINGLE[p.h]?400:700)+'">'+esc(hT)+'</div><div class="b" style="font-family:'+fstack(p.b)+'">'+esc(bT)+'</div><div class="meta"><span>'+p.h+' + '+p.b+' · '+p.mood+'</span><span><button class="btn btn-sm btn-ghost" type="button" data-pair="'+PAIRS.indexOf(p)+'">Use pair</button> <a class="btn btn-sm btn-ghost" href="https://fonts.google.com/specimen/'+p.h.replace(/ /g,'+')+'" target="_blank" rel="noopener">Get fonts ↗</a></span></div></div>'}).join('');
    }
    ['fH','fB'].forEach(function(id){$('#'+id).addEventListener('input',renderFonts)});
    $('#fCat').addEventListener('change',renderFonts);
    ft.addEventListener('click',function(e){var b=e.target.closest('[data-pair]');if(b){var p=PAIRS[+b.getAttribute('data-pair')];setKit({fontH:p.h,fontB:p.b},'Fonts saved: '+p.h+' + '+p.b)}});
    var kk=getKit();if(kk.name)$('#fH').value=kk.name+(kk.tagline?' — '+kk.tagline:'');
    renderFonts();
  }

  /* ---------- Wordmark / logo maker ---------- */
  var lt=$('#logoTool');
  if(lt){
    var SYM={none:'',circle:'<circle cx="0" cy="0" r="1" />',ring:'<circle cx="0" cy="0" r=".82" fill="none" stroke-width=".36"/>',square:'<rect x="-.9" y="-.9" width="1.8" height="1.8" rx=".35"/>',diamond:'<path d="M0-1 1 0 0 1-1 0z"/>',triangle:'<path d="M0-1 1 .8H-1z"/>',arch:'<path d="M-1 1V0a1 1 0 0 1 2 0v1z"/>',spark:'<path d="M0-1C.1-.2.2-.1 1 0 .2.1.1.2 0 1-.1.2-.2.1-1 0-.2-.1-.1-.2 0-1z"/>',half:'<path d="M-1 0a1 1 0 0 1 2 0z"/><path d="M-1 .25h2v.75h-2z" opacity=".55"/>',slash:'<path d="M.35-1h.65L-.35 1H-1z"/>',dot:'<circle cx="0" cy="0" r=".5"/>'};
    var fs=$('#lFont');fs.innerHTML=PAIRS.map(function(p){return '<option>'+p.h+'</option>'}).join('')+PAIRS.map(function(p){return '<option>'+p.b+'</option>'}).join('');
    var lk=getKit();
    if(lk.name)$('#lText').value=lk.name;if(lk.tagline)$('#lTag').value=lk.tagline;if(lk.fontH)fs.value=lk.fontH;
    if(lk.colors&&lk.colors.length===5){$('#lFg').value=lk.colors[4].toLowerCase();$('#lBg').value=lk.colors[3].toLowerCase();$('#lSym').value=lk.colors[0].toLowerCase()}
    function params(){return {t:$('#lText').value||'Brand',tag:$('#lTag').value,f:fs.value,w:SINGLE[fs.value]?400:+$('#lWeight').value,ls:+$('#lSpace').value,cs:$('#lCase').value,sym:$('#lShape').value,lay:$('#lLayout').value,fg:$('#lFg').value,bg:$('#lBg').value,sc:$('#lSym').value,size:+$('#lSize').value}}
    function txt(p){return p.cs==='upper'?p.t.toUpperCase():p.cs==='lower'?p.t.toLowerCase():p.t}
    function measure(p){var c=document.createElement('canvas').getContext('2d');c.font=p.w+' '+p.size+'px '+fstack(p.f);var t=txt(p),w=c.measureText(t).width+Math.max(0,t.length-1)*p.ls;c.font='500 '+Math.round(p.size*.28)+'px '+fstack(p.f);return {w:w,tw:p.tag?c.measureText(p.tag).width:0}}
    function layout(p){var m=measure(p),s=p.sym!=='none'?p.size*.95:0,gap=s?p.size*.35:0,W,H,sx,sy,tx,ty,tgy,anchor;
      if(p.lay==='stack'){W=Math.max(m.w,m.tw,s)+p.size*1.2;H=s+gap+p.size+(p.tag?p.size*.55:0)+p.size*1.1;sx=W/2;sy=p.size*.55+s/2;tx=W/2;ty=p.size*.55+s+gap+p.size*.78;tgy=ty+p.size*.5;anchor='middle'}
      else{W=s+gap+Math.max(m.w,m.tw)+p.size*1.2;H=p.size*(p.tag?2:1.6);sx=p.size*.6+s/2;sy=H/2;tx=p.size*.6+s+gap;ty=H/2+p.size*(p.tag?.12:.34);tgy=ty+p.size*.42;anchor='start'}
      return {W:Math.ceil(W),H:Math.ceil(H),s:s,sx:sx,sy:sy,tx:tx,ty:ty,tgy:tgy,anchor:anchor}}
    function svg(p,forExport){var L=layout(p),t=esc(txt(p));
      var fontCss=forExport?'<style>@import url(\'https://fonts.googleapis.com/css2?family='+p.f.replace(/ /g,'+')+(SINGLE[p.f]?'':':wght@400;700')+'&amp;display=swap\');</style>':'';
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+L.W+' '+L.H+'" width="'+L.W+'" height="'+L.H+'">'+fontCss+(p.bg&&!$('#lTransparent').checked?'<rect width="100%" height="100%" fill="'+p.bg+'"/>':'')+
        (L.s?'<g transform="translate('+L.sx+' '+L.sy+') scale('+(L.s/2)+')" fill="'+p.sc+'" stroke="'+p.sc+'">'+SYM[p.sym]+'</g>':'')+
        '<text x="'+L.tx+'" y="'+L.ty+'" text-anchor="'+L.anchor+'" font-family="'+esc(fstack(p.f))+'" font-weight="'+p.w+'" font-size="'+p.size+'" letter-spacing="'+p.ls+'" fill="'+p.fg+'">'+t+'</text>'+
        (p.tag?'<text x="'+L.tx+'" y="'+L.tgy+'" text-anchor="'+L.anchor+'" font-family="'+esc(fstack(p.f))+'" font-weight="500" font-size="'+Math.round(p.size*.28)+'" letter-spacing="'+Math.max(1,p.ls/2+1)+'" fill="'+p.fg+'" opacity=".75">'+esc(p.tag)+'</text>':'')+'</svg>'}
    function draw(){var p=params();loadFont(p.f);$('#lCanvas').innerHTML=svg(p,false);
      var fav=$('#lFav');if(fav){var L=layout(p);fav.innerHTML='<svg viewBox="0 0 64 64" width="48" height="48"><rect width="64" height="64" rx="14" fill="'+p.sc+'"/><text x="32" y="44" text-anchor="middle" font-family="'+esc(fstack(p.f))+'" font-weight="'+p.w+'" font-size="34" fill="'+onColor(p.sc)+'">'+esc(txt(p).charAt(0))+'</text></svg>'}}
    $$('input,select',lt).forEach(function(el){el.addEventListener('input',draw);el.addEventListener('change',draw)});
    if(document.fonts)document.fonts.addEventListener('loadingdone',draw);
    function dl(name,href){var a=document.createElement('a');a.download=name;a.href=href;document.body.appendChild(a);a.click();a.remove()}
    $('#lSvg').addEventListener('click',function(){var p=params();dl((p.t||'logo').replace(/\W+/g,'-').toLowerCase()+'-wordmark.svg','data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg(p,true)))});
    $('#lPng').addEventListener('click',function(){
      var p=params(),L=layout(p),k=3,c=document.createElement('canvas');c.width=L.W*k;c.height=L.H*k;var x=c.getContext('2d');x.scale(k,k);
      var go=function(){
        if(!$('#lTransparent').checked){x.fillStyle=p.bg;x.fillRect(0,0,L.W,L.H)}
        if(L.s){var img=new Image();img.onload=function(){x.drawImage(img,L.sx-L.s/2,L.sy-L.s/2,L.s,L.s);txtDraw()};img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 2 2" width="200" height="200"><g fill="'+p.sc+'" stroke="'+p.sc+'">'+SYM[p.sym]+'</g></svg>')}else txtDraw();
        function txtDraw(){x.fillStyle=p.fg;x.textBaseline='alphabetic';x.textAlign=L.anchor==='middle'?'center':'left';
          var t=txt(p);x.font=p.w+' '+p.size+'px '+fstack(p.f);
          if('letterSpacing' in x){x.letterSpacing=p.ls+'px';x.fillText(t,L.tx,L.ty)}else x.fillText(t,L.tx,L.ty);
          if(p.tag){x.globalAlpha=.75;x.font='500 '+Math.round(p.size*.28)+'px '+fstack(p.f);if('letterSpacing' in x)x.letterSpacing=Math.max(1,p.ls/2+1)+'px';x.fillText(p.tag,L.tx,L.tgy);x.globalAlpha=1}
          dl((p.t||'logo').replace(/\W+/g,'-').toLowerCase()+'-wordmark.png',c.toDataURL('image/png'))}
      };
      (document.fonts&&document.fonts.load?document.fonts.load(p.w+' '+p.size+'px "'+p.f+'"'):Promise.resolve()).then(go,go);
    });
    $('#lSave').addEventListener('click',function(){var p=params();setKit({name:p.t,tagline:p.tag,fontH:p.f,logo:{shape:p.sym,layout:p.lay,fg:p.fg,bg:p.bg,sc:p.sc,cs:p.cs,ls:p.ls,w:p.w}})});
    draw();setTimeout(draw,800);
  }

  /* ---------- Slogan generator ---------- */
  var sg=$('#sloganTool');
  if(sg){
    var T={
      bold:['{N}. No compromises.','Built for {A} who refuse to settle.','{V} harder. {V} smarter. {N}.','The new standard in {B}.','Stop waiting. Start {Vg}.','{B}, without the excuses.','Own your {B}.','Made to {V}. Made to last.'],
      warm:['{B}, made with heart.','Here for every {A}.','Good {B}, close to home.','Because {A} deserve better.','Feel the difference of real {B}.','{N} — {B} that feels like you.','A little {B} goes a long way.','Where {A} feel at home.'],
      premium:['{B}, refined.','Crafted for the discerning.','The art of {B}.','{N}. Quietly exceptional.','Precision in every detail.','Elevated {B} for {A}.','Rare by design.','Nothing ordinary.'],
      playful:['{B}? Nailed it.','Seriously good {B}.','Your new favourite {B}.','Less fuss. More {B}.','{B} that makes you grin.','Go on, {V} a little.','Happy {A}, happy everything.','Yes, it’s that easy.'],
      tech:['{B}, automated.','The smarter way to {V}.','{V} at the speed of thought.','{B} infrastructure for {A}.','From idea to {B} in minutes.','Data-driven {B}.','Ship better {B}.','{N}: {B}, simplified.']};
    function gs(){
      var N=$('#sName').value||'Your brand',B=($('#sBen').value||'quality').toLowerCase(),A=($('#sAud').value||'people').toLowerCase(),Vb=($('#sVerb').value||'grow').toLowerCase(),tone=$('#sTone').value;
      var tones=tone==='all'?Object.keys(T):[tone],res=[];
      tones.forEach(function(t){T[t].forEach(function(x){res.push({t:t,s:x.replace(/\{N\}/g,N).replace(/\{B\}/g,B).replace(/\{A\}/g,A).replace(/\{Vg\}/g,Vb.replace(/e$/,'')+'ing').replace(/\{V\}/g,Vb)})})});
      res=res.map(function(r){r.s=r.s.charAt(0).toUpperCase()+r.s.slice(1);return r}).sort(function(){return Math.random()-.5}).slice(0,tone==='all'?20:8);
      $('#sOut').innerHTML=res.map(function(r){return '<div class="name-card"><span class="tag">'+r.t+'</span><b style="font-size:1.1rem">'+esc(r.s)+'</b><div class="acts"><button type="button" data-copy="'+esc(r.s)+'">Copy</button><button type="button" data-tagline="'+esc(r.s)+'">Use</button></div></div>'}).join('');
    }
    sg.addEventListener('click',function(e){var b=e.target.closest('[data-tagline]');if(b)setKit({tagline:b.getAttribute('data-tagline')},'Tagline saved')});
    $('#sGo').addEventListener('click',gs);$('#sTone').addEventListener('change',gs);
    var sk=getKit();if(sk.name)$('#sName').value=sk.name;
    gs();
  }

  /* ---------- Archetype quiz ---------- */
  var qz=$('#quizTool');
  if(qz){
    var AR={
      hero:{n:'The Hero',d:'Courageous, determined, built to win. You exist to help customers overcome a hard challenge.',v:'Direct, energetic, motivating. Short sentences. Action verbs.',w:['Bold','Proven','Unstoppable'],c:['#C1121F','#0B1D51','#F4F4F4'],e:'performance sportswear, fitness apps, emergency services'},
      sage:{n:'The Sage',d:'Wise, analytical, trusted. You help people understand the world and make better decisions.',v:'Calm, precise, evidence-led. Explain, don’t hype.',w:['Insightful','Clear','Credible'],c:['#1D3557','#A8DADC','#F1FAEE'],e:'research firms, universities, data tools, news'},
      explorer:{n:'The Explorer',d:'Independent and adventurous. You help people discover, roam and break routine.',v:'Vivid, open, free-spirited. Invite people out.',w:['Wild','Curious','Free'],c:['#2D6A4F','#D4A373','#FEFAE0'],e:'outdoor gear, travel, off-road vehicles'},
      creator:{n:'The Creator',d:'Imaginative and expressive. You give people the means to make something original.',v:'Inspiring, crafted, detail-loving. Show the process.',w:['Original','Crafted','Visionary'],c:['#7209B7','#F72585','#FFF3E6'],e:'design software, art supplies, building blocks'},
      caregiver:{n:'The Caregiver',d:'Compassionate and protective. You make customers feel safe, supported and looked after.',v:'Warm, reassuring, plain-spoken. Lead with empathy.',w:['Caring','Reliable','Gentle'],c:['#457B9D','#F4A261','#FFF8F0'],e:'healthcare, baby care, insurance, charities'},
      ruler:{n:'The Ruler',d:'Confident, organised, premium. You offer control, stability and leadership.',v:'Authoritative, polished, measured. Few words, high certainty.',w:['Commanding','Exclusive','Stable'],c:['#111111','#B08D57','#F5F1E8'],e:'luxury watches, private banking, enterprise software'},
      magician:{n:'The Magician',d:'Transformative and visionary. You make the seemingly impossible feel effortless.',v:'Evocative, imaginative, a little mysterious.',w:['Transformative','Visionary','Effortless'],c:['#3A0CA3','#4CC9F0','#F8F7FF'],e:'theme parks, consumer tech, wellness'},
      rebel:{n:'The Outlaw',d:'Disruptive and unapologetic. You challenge the status quo and the incumbents.',v:'Edgy, provocative, rule-breaking. Name the enemy.',w:['Defiant','Raw','Radical'],c:['#000000','#E63946','#F1F1F1'],e:'motorcycles, challenger banks, streetwear'},
      lover:{n:'The Lover',d:'Sensual, intimate, passionate. You help people feel desired and indulge their senses.',v:'Sensory, elegant, emotive. Every word felt.',w:['Indulgent','Intimate','Beautiful'],c:['#9D0208','#F48C06','#FFF0F3'],e:'fragrance, chocolate, fashion, hospitality'},
      jester:{n:'The Jester',d:'Fun, irreverent, joyful. You bring lightness and make people smile.',v:'Witty, playful, self-aware. Jokes that land.',w:['Cheeky','Fun','Bright'],c:['#FFBE0B','#FB5607','#3A86FF'],e:'snacks, games, social apps, entertainment'},
      everyman:{n:'The Everyday Friend',d:'Down-to-earth and inclusive. You belong to everyone and make life simpler.',v:'Friendly, honest, no jargon. Talk like a neighbour.',w:['Honest','Practical','Welcoming'],c:['#264653','#E9C46A','#F7F7F2'],e:'supermarkets, budget airlines, denim'},
      innocent:{n:'The Innocent',d:'Optimistic, pure, simple. You promise goodness, safety and a fresh start.',v:'Light, positive, simple. Short and sunny.',w:['Pure','Simple','Hopeful'],c:['#90BE6D','#F9F7F3','#4D908E'],e:'natural foods, skincare, juice'}};
    var Q=[
      ['Your customer comes to you because they want to…',[['win or overcome something','hero'],['understand something','sage'],['feel free to explore','explorer'],['make something new','creator']]],
      ['At your best, people describe you as…',[['caring','caregiver'],['in control','ruler'],['magical','magician'],['rebellious','rebel']]],
      ['Pick the feeling you want to leave behind',[['desire','lover'],['joy','jester'],['belonging','everyman'],['optimism','innocent']]],
      ['Your ideal tone of voice',[['Rallying and direct','hero'],['Calm and precise','sage'],['Warm and reassuring','caregiver'],['Witty and playful','jester']]],
      ['Your brand enemy is…',[['mediocrity','hero'],['the status quo','rebel'],['confusion','sage'],['chaos','ruler']]],
      ['Which setting fits your brand?',[['A mountain trail','explorer'],['A design studio','creator'],['A candle-lit dinner','lover'],['A neighbourhood café','everyman']]],
      ['What do you promise?',[['Transformation','magician'],['Safety','caregiver'],['Simplicity','innocent'],['Status','ruler']]],
      ['Your marketing would never be…',[['boring','jester'],['exclusive','everyman'],['cold','lover'],['predictable','rebel']]],
      ['Customers share you because you are…',[['inspiring','creator'],['trustworthy','sage'],['adventurous','explorer'],['refreshingly honest','innocent']]],
      ['Pick a colour mood',[['Deep red and navy','hero'],['Black and gold','ruler'],['Violet and electric blue','magician'],['Sunny and bright','jester']]],
      ['Your price position',[['Premium','ruler'],['Fair for everyone','everyman'],['Worth the splurge','lover'],['Best value for results','hero']]],
      ['The headline you’d love written about you',[['“They changed the industry”','rebel'],['“They made it feel effortless”','magician'],['“They really care”','caregiver'],['“They helped me find my own path”','explorer']]]];
    var qi=0,sc={};
    var box=$('#quizQs');
    box.innerHTML=Q.map(function(q,i){return '<div class="quiz-q" data-q="'+i+'"><p class="tiny mono">Question '+(i+1)+' of '+Q.length+'</p><h3 style="font-size:1.5rem">'+q[0]+'</h3><div class="choice-grid" style="grid-template-columns:1fr 1fr">'+q[1].map(function(o){return '<label class="choice"><input type="radio" name="q'+i+'" value="'+o[1]+'"><span>'+o[0]+'</span></label>'}).join('')+'</div></div>'}).join('');
    function showQ(){$$('.quiz-q',box).forEach(function(el,i){el.classList.toggle('active',i===qi)});$('#quizBar').style.width=(qi/Q.length*100)+'%';$('#quizBack').style.visibility=qi?'visible':'hidden'}
    box.addEventListener('change',function(){setTimeout(function(){qi++;if(qi>=Q.length)finish();else showQ()},200)});
    $('#quizBack').addEventListener('click',function(){if(qi>0){qi--;showQ()}});
    function finish(){
      sc={};$$('input:checked',box).forEach(function(r){sc[r.value]=(sc[r.value]||0)+1});
      var ranked=Object.keys(sc).sort(function(a,b){return sc[b]-sc[a]}),top=AR[ranked[0]],sec=ranked[1]?AR[ranked[1]]:null;
      $('#quizBar').style.width='100%';box.style.display='none';$('#quizBack').style.display='none';
      var r=$('#quizResult');r.hidden=false;
      $('#qrName').textContent=top.n;$('#qrDesc').textContent=top.d;$('#qrVoice').textContent=top.v;$('#qrWords').textContent=top.w.join(' · ');$('#qrEx').textContent=top.e;
      $('#qrSec').textContent=sec?sec.n:'—';
      $('#qrCols').innerHTML=top.c.map(function(c){return '<span style="background:'+c+'" data-copy="'+c+'" title="'+c+'"></span>'}).join('');
      var form=$('#quizLead');if(form)form._extra={archetype:top.n,secondary:sec?sec.n:'',
        _autoresponse:'Your Brand.Studio archetype report\n\nPRIMARY ARCHETYPE: '+top.n+'\n'+top.d+'\n\nSECONDARY INFLUENCE: '+(sec?sec.n+' — '+sec.d:'none')+'\n\nVOICE: '+top.v+'\nYOUR THREE WORDS: '+top.w.join(', ')+'\nCOLOUR DIRECTION: '+top.c.join(', ')+'\nCATEGORIES WHERE THIS ARCHETYPE IS COMMON: '+top.e+'\n\nPUT IT TO WORK\n1. Write a voice chart: for each of your three words, add "this, not that" (e.g. '+top.w[0].toLowerCase()+', not overbearing).\n2. Rewrite your homepage headline so it sounds like '+top.n+'.\n3. Brief anyone designing for you with your primary and secondary archetype.\n4. Build your palette: https://brand.studio/tools/palette.html\n5. Turn it into a one-page guide: https://brand.studio/tools/brand-guide.html\n\nWant professionals to build it? Get matched free: https://brand.studio/get-matched.html\n\n— Brand.Studio'};
      setKit({archetype:top.n,voice:top.w},false);
      r.scrollIntoView({behavior:'smooth',block:'start'});
    }
    $('#quizRetry').addEventListener('click',function(){qi=0;$$('input',box).forEach(function(i){i.checked=false});box.style.display='';$('#quizBack').style.display='';$('#quizResult').hidden=true;showQ()});
    showQ();
  }

  /* ---------- Brand audit ---------- */
  var au=$('#auditTool');
  if(au){
    var P=[
      ['Positioning',['I can state who we serve and why we’re different in one sentence.','Our team would all give the same answer to “what do we do?”','We know our top three competitors and how we differ.']],
      ['Name & legal',['Our name is easy to say, spell and remember.','We’ve searched trademarks in our main markets.','We own the matching .com (or main TLD) and core social handles.']],
      ['Visual identity',['We have a logo that works in one colour and at small sizes.','We use a defined palette with exact colour codes.','We use the same fonts everywhere.']],
      ['Voice & message',['We have a tagline or one-line promise we actually use.','Our copy sounds the same across website, email and social.','We have a short list of words we always / never use.']],
      ['Website',['Our homepage explains what we do in under 5 seconds.','It works and looks good on mobile.','It has one clear call-to-action per page.']],
      ['Consistency',['A stranger could recognise our content with the logo hidden.','We have a written brand guide, even one page.','Partners and freelancers receive our brand files.']],
      ['Customer experience',['Our service, packaging and support feel like the same brand.','We collect reviews or testimonials regularly.','We know why customers choose us (we’ve asked them).']],
      ['Growth & measurement',['We track brand searches, direct traffic or referrals.','We review brand performance at least quarterly.','We have a budget line for brand (not just ads).']]];
    var html='',n=0;
    P.forEach(function(p,pi){html+='<fieldset class="card" style="margin-bottom:14px"><legend class="tag hot" style="padding:7px 10px">'+(pi+1)+'. '+p[0]+'</legend>';p[1].forEach(function(q){html+='<div style="padding:10px 0;border-bottom:1px dashed var(--line)"><p style="margin:0 0 8px;font-weight:600">'+q+'</p><div class="choice-grid" style="grid-template-columns:repeat(3,1fr);margin:0">'+[['No',0],['Partly',1],['Yes',2]].map(function(o){return '<label class="choice"><input type="radio" required name="a'+n+'" value="'+o[1]+'" data-p="'+pi+'"><span>'+o[0]+'</span></label>'}).join('')+'</div></div>';n++});html+='</fieldset>'});
    $('#auditQs').innerHTML=html;
    function compute(){var per=P.map(function(){return 0}),ans=0;$$('input:checked',au).forEach(function(r){per[+r.getAttribute('data-p')]+=+r.value;ans++});var total=Math.round(per.reduce(function(a,b){return a+b},0)/(P.length*6)*100);$('#auPct').textContent=total;$('#auAns').textContent=ans+' / '+n+' answered';$('#auMeter').style.width=total+'%';return {per:per,total:total,ans:ans}}
    au.addEventListener('change',compute);
    $('#auGo').addEventListener('click',function(){
      var r=compute();if(r.ans<n){var first=$$('input[type=radio]',au).filter(function(x){return !$('input[name='+x.name+']:checked',au)})[0];if(first){first.scrollIntoView({behavior:'smooth',block:'center'});toast('Answer all '+n+' questions for an accurate score')}return}
      var label=r.total>=80?'Strong brand':r.total>=55?'Solid foundations, clear gaps':r.total>=30?'Emerging brand':'Brand at risk';
      var weak=r.per.map(function(v,i){return {i:i,v:v}}).sort(function(a,b){return a.v-b.v}).slice(0,3);
      var fixes={0:'Write a one-sentence positioning statement and test it on 5 customers.',1:'Run trademark and domain checks now — renaming later costs far more.',2:'Lock a palette and font pair; export logo files in SVG, PNG and one-colour.',3:'Pick a tagline and 3 voice words; rewrite your homepage hero with them.',4:'Rewrite the homepage headline as the problem you solve; add one CTA.',5:'Build a one-page brand guide and send it to everyone who touches your brand.',6:'Ask 10 recent customers why they chose you; turn answers into testimonials.',7:'Set a quarterly brand review and track branded search volume.'};
      var links={0:'/guides/how-to-build-a-brand.html',1:'/tools/trademark-check.html',2:'/tools/palette.html',3:'/tools/slogan.html',4:'/guides/how-to-build-a-brand.html',5:'/tools/brand-guide.html',6:'/guides/brand-strategy-template.html',7:'/guides/when-to-rebrand.html'};
      var res=$('#auResult');res.hidden=false;
      $('#auLabel').textContent=label+' — '+r.total+'/100';
      $('#auBars').innerHTML=P.map(function(p,i){var pc=Math.round(r.per[i]/6*100);return '<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:.88rem;font-weight:700"><span>'+p[0]+'</span><span class="mono">'+pc+'%</span></div><div class="meter"><i style="width:'+pc+'%"></i></div></div>'}).join('');
      $('#auFixes').innerHTML=weak.map(function(w){return '<li><b>'+P[w.i][0]+':</b> '+fixes[w.i]+' <a href="'+links[w.i]+'">Fix it →</a></li>'}).join('');
      var lf=$('#auditLead');if(lf)lf._extra={audit_score:r.total+'/100',audit_label:label,weakest:weak.map(function(w){return P[w.i][0]}).join(', ')};
      setKit({auditScore:r.total},false);
      res.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  /* ---------- Brand guide builder ---------- */
  var bg=$('#guideTool');
  if(bg){
    var k=getKit(),F=['gName','gTag','gMission','gAud','gArch','gVoice','gDo','gDont'];
    var defs={gName:k.name||'Northwind',gTag:k.tagline||'Made with care, built to last.',gMission:k.mission||'We help small teams look as good as they are.',gAud:k.audience||'Founders and small business owners who value craft.',gArch:k.archetype||'The Creator',gVoice:(k.voice||['Clear','Warm','Confident']).join(', '),gDo:k.dos||'Use short sentences. Lead with the benefit. Show real work.',gDont:k.donts||'No jargon. No stock-photo clichés. Never stretch the logo.'};
    F.forEach(function(id){$('#'+id).value=defs[id]});
    var gc=k.colors&&k.colors.length===5?k.colors:['#1F3A5F','#3E7CB1','#F2A541','#F4F0E8','#15130F'];
    $$('[data-gc]').forEach(function(inp,i){inp.value=gc[i].toLowerCase()});
    var gsel=$('#gPair');gsel.innerHTML=PAIRS.map(function(p,i){return '<option value="'+i+'">'+p.h+' + '+p.b+'</option>'}).join('');
    var pi=PAIRS.findIndex?PAIRS.findIndex(function(p){return p.h===k.fontH}):-1;gsel.value=pi>-1?pi:14;
    function render(){
      var c=$$('[data-gc]').map(function(i){return i.value.toUpperCase()}),p=PAIRS[+gsel.value];loadFont(p.h);loadFont(p.b);
      var v=function(id){return esc($('#'+id).value)},hf=fstack(p.h,/serif/.test(p.tags)),bf=fstack(p.b),names=['Primary','Secondary','Accent','Light','Dark'];
      $('#gOut').innerHTML='<div style="background:'+c[3]+';color:'+c[4]+';border-radius:20px;overflow:hidden;font-family:'+bf+'">'+
        '<div style="background:'+c[0]+';color:'+onColor(c[0])+';padding:42px 36px"><div style="font:700 .72rem var(--mono);letter-spacing:.14em;text-transform:uppercase;opacity:.8">Brand guidelines · v1 · '+new Date().toLocaleDateString('en',{month:'short',year:'numeric'})+'</div><div style="font-family:'+hf+';font-weight:'+(SINGLE[p.h]?400:700)+';font-size:clamp(2.2rem,6vw,3.6rem);line-height:1.05;margin:12px 0 8px">'+v('gName')+'</div><div style="font-size:1.15rem;opacity:.9">'+v('gTag')+'</div></div>'+
        '<div style="padding:30px 36px;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px">'+
        '<div><h4 style="font-family:'+hf+';margin:0 0 6px">Mission</h4><p>'+v('gMission')+'</p></div><div><h4 style="font-family:'+hf+';margin:0 0 6px">Audience</h4><p>'+v('gAud')+'</p></div><div><h4 style="font-family:'+hf+';margin:0 0 6px">Personality</h4><p><b>'+v('gArch')+'</b><br>'+v('gVoice')+'</p></div></div>'+
        '<div style="padding:0 36px 26px"><h4 style="font-family:'+hf+';margin:0 0 10px">Colour</h4><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px">'+c.map(function(x,i){return '<div style="background:'+x+';color:'+onColor(x)+';border-radius:12px;padding:44px 10px 10px;font:600 .72rem var(--mono);border:1px solid rgba(0,0,0,.08)">'+names[i]+'<br>'+x+'<br>rgb('+hexToRgb(x).join(',')+')</div>'}).join('')+'</div></div>'+
        '<div style="padding:0 36px 26px;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px"><div><h4 style="font-family:'+hf+';margin:0 0 6px">Typography</h4><div style="font-family:'+hf+';font-size:2rem;font-weight:'+(SINGLE[p.h]?400:700)+'">Aa — '+p.h+'</div><div style="font-size:1.05rem">Aa — '+p.b+' for body text, UI and long reading.</div></div>'+
        '<div><h4 style="font-family:'+hf+';margin:0 0 6px">Logo</h4><div style="background:'+c[3]+';border:1px dashed '+c[4]+'55;border-radius:12px;padding:18px;text-align:center;font-family:'+hf+';font-weight:'+(SINGLE[p.h]?400:700)+';font-size:1.8rem;color:'+c[0]+'">'+v('gName')+'</div><p style="font-size:.85rem;margin-top:8px">Keep clear space equal to the cap-height. Minimum width 80px. Never stretch, recolour outside the palette or add effects.</p></div></div>'+
        '<div style="padding:0 36px 36px;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px"><div style="background:#13A37A18;border-radius:12px;padding:16px"><h4 style="margin:0 0 6px;color:#13A37A">Do</h4><p style="margin:0">'+v('gDo')+'</p></div><div style="background:#D7263D18;border-radius:12px;padding:16px"><h4 style="margin:0 0 6px;color:#D7263D">Don’t</h4><p style="margin:0">'+v('gDont')+'</p></div></div></div>';
    }
    $$('input,select,textarea',$('#gForm')).forEach(function(el){el.addEventListener('input',render);el.addEventListener('change',render)});
    $('#gPrint').addEventListener('click',function(){window.print()});
    $('#gSave').addEventListener('click',function(){var p=PAIRS[+gsel.value];setKit({name:$('#gName').value,tagline:$('#gTag').value,mission:$('#gMission').value,audience:$('#gAud').value,archetype:$('#gArch').value,voice:$('#gVoice').value.split(',').map(function(s){return s.trim()}).filter(Boolean),dos:$('#gDo').value,donts:$('#gDont').value,colors:$$('[data-gc]').map(function(i){return i.value.toUpperCase()}),fontH:p.h,fontB:p.b})});
    $('#gJson').addEventListener('click',function(){var a=document.createElement('a');a.download='brand-kit.json';a.href='data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(getKit(),null,2));document.body.appendChild(a);a.click();a.remove()});
    render();
  }

  /* ---------- Trademark & availability launcher ---------- */
  var tm=$('#tmTool');
  if(tm){
    var SRC=[
      ['Official trademark offices',[
        ['United States — USPTO Trademark Search','https://tmsearch.uspto.gov/search/search-information'],
        ['Canada — CIPO Trademarks Database','https://ised-isde.canada.ca/cipo/trademark-search/srch'],
        ['European Union — EUIPO eSearch','https://euipo.europa.eu/eSearch/#basic/1+1+1+1/100+100+100+100/{q}'],
        ['United Kingdom — UKIPO trade mark search','https://trademarks.ipo.gov.uk/ipo-tmtext'],
        ['International — WIPO Global Brand Database','https://branddb.wipo.int/en/quicksearch?by=brandName&v={q}'],
        ['Australia — IP Australia Search','https://search.ipaustralia.gov.au/trademarks/search/quick'],
        ['India — IP India public search','https://tmrsearch.ipindia.gov.in/estatus']]],
      ['Domains',[
        ['.com and more — Namecheap','https://www.namecheap.com/domains/registration/results/?domain={q}.com'],
        ['Instant Domain Search','https://instantdomainsearch.com/?q={q}'],
        ['WHOIS lookup — ICANN','https://lookup.icann.org/en/lookup?name={q}.com']]],
      ['Social handles',[
        ['Instagram','https://www.instagram.com/{q}/'],['X','https://x.com/{q}'],['TikTok','https://www.tiktok.com/@{q}'],['YouTube','https://www.youtube.com/@{q}'],['LinkedIn company','https://www.linkedin.com/company/{q}/'],['GitHub','https://github.com/{q}']]],
      ['The open web',[
        ['Exact-match Google search','https://www.google.com/search?q=%22{raw}%22'],['Google — “{raw} company”','https://www.google.com/search?q=%22{raw}%22+company'],['App stores (via Google)','https://www.google.com/search?q=%22{raw}%22+site%3Aapps.apple.com+OR+site%3Aplay.google.com']]]];
    function build(){
      var raw=($('#tmName').value||'').trim(),q=raw.toLowerCase().replace(/[^a-z0-9]/g,'');
      if(!raw){$('#tmOut').innerHTML='<p class="muted">Type a name to generate your search links.</p>';return}
      $('#tmOut').innerHTML=SRC.map(function(g){return '<h3 style="margin-top:22px">'+g[0]+'</h3><div class="res-list">'+g[1].map(function(s){var u=s[1].replace(/\{q\}/g,encodeURIComponent(q)).replace(/\{raw\}/g,encodeURIComponent(raw));return '<a class="res" href="'+u+'" target="_blank" rel="noopener nofollow" data-tmcopy><b>'+esc(s[0].replace('{raw}',raw))+' ↗</b><small>'+esc(u.replace(/^https?:\/\//,'').slice(0,46))+'…</small></a>'}).join('')+'</div>'}).join('');
      var ck=$('#tmChecklist');if(ck)ck.hidden=false;
    }
    tm.addEventListener('click',function(e){if(e.target.closest('[data-tmcopy]')){try{navigator.clipboard.writeText($('#tmName').value)}catch(err){}}});
    $('#tmName').addEventListener('input',build);
    var kn=qs.get('q')||getKit().name;if(kn)$('#tmName').value=kn;
    build();
  }

  /* ---------- Studio dashboard ---------- */
  var sd=$('#studioDash');
  if(sd){
    function paint(){
      var k=getKit(),c=k.colors&&k.colors.length===5?k.colors:null,done=0,checks=[['name','Name','/tools/name-generator.html'],['colors','Palette','/tools/palette.html'],['fontH','Fonts','/tools/fonts.html'],['tagline','Tagline','/tools/slogan.html'],['archetype','Archetype','/tools/archetype-quiz.html'],['logo','Wordmark','/tools/logo-maker.html'],['auditScore','Audit','/tools/brand-audit.html'],['mission','Guide','/tools/brand-guide.html']];
      $('#sdChecks').innerHTML=checks.map(function(x){var ok=k[x[0]]!==undefined&&k[x[0]]!=='';if(ok)done++;return '<a class="res" href="'+x[2]+'" style="display:flex;justify-content:space-between;align-items:center"><b>'+x[1]+'</b><span class="'+(ok?'pass':'muted')+'">'+(ok?'✓ Done':'Start →')+'</span></a>'}).join('');
      var pct=Math.round(done/checks.length*100);$('#sdPct').textContent=pct+'%';$('#sdBar').style.width=pct+'%';
      if(k.fontH){loadFont(k.fontH)}if(k.fontB){loadFont(k.fontB)}
      var b=$('#sdBoard'),bgc=c?c[0]:'#15130F',fg=onColor(bgc);
      b.style.background=bgc;b.style.color=fg;
      $('#sdName').textContent=k.name||'Your brand';$('#sdName').style.fontFamily=k.fontH?fstack(k.fontH):'';
      $('#sdTag').textContent=k.tagline||'Add a tagline in the slogan generator';$('#sdTag').style.fontFamily=k.fontB?fstack(k.fontB):'';
      $('#sdMeta').textContent=[k.archetype,k.fontH&&(k.fontH+' + '+k.fontB),k.auditScore!==undefined&&('Audit '+k.auditScore+'/100')].filter(Boolean).join(' · ')||'Your choices appear here as you save them.';
      $('#sdCols').innerHTML=(c||['#333','#555','#777','#999','#BBB']).map(function(x){return '<span style="background:'+x+';border:1px solid rgba(255,255,255,.2)" data-copy="'+x+'" title="'+x+'"></span>'}).join('');
      $('#sdQuickName').value=k.name||'';
    }
    $('#sdQuickSave').addEventListener('click',function(){var v=$('#sdQuickName').value.trim();if(v){setKit({name:v});paint()}});
    $('#sdReset').addEventListener('click',function(){if(confirm('Clear your saved brand kit from this browser?')){store(KIT_KEY,'{}');paint()}});
    $('#sdImport').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{store(KIT_KEY,JSON.stringify(JSON.parse(r.result)));toast('Kit imported');paint()}catch(err){toast('That file is not a valid brand kit')}};r.readAsText(f)});
    $('#sdExport').addEventListener('click',function(){var a=document.createElement('a');a.download='brand-kit.json';a.href='data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(getKit(),null,2));document.body.appendChild(a);a.click();a.remove()});
    paint();
  }

  /* ---------- Prefill forms from URL (?service=…) ---------- */
  qs.forEach(function(v,key){$$('form [name="'+key+'"]').forEach(function(el){if(el.type==='radio'||el.type==='checkbox'){if(el.value===v)el.checked=true}else if(!el.value)el.value=v})});
  $$('form.multistep').forEach(function(f){var s=$('.step.active',f);if(s&&$('input[type=radio]:checked',s)&&f._go)f._go(1,true)});
})();
