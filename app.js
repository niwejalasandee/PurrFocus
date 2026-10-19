import { createClient } from 'https://cdn.jsdelivr.net/npm/@insforge/sdk/+esm';

/* ---- InsForge setup: paste your values from the InsForge dashboard ---- */
const INSFORGE_URL = 'https://g5j3cm92.ap-southeast.insforge.app';
const INSFORGE_ANON_KEY = 'anon_6c8aa7e5f4d2c9a01a31f85d9d6c68545e8791bc9dec0187b09db0cd55a6ef05';
const insforge = createClient({ baseUrl: INSFORGE_URL, anonKey: INSFORGE_ANON_KEY });

/* Saves one row into an InsForge table. Returns true on success. */
async function saveToInsForge(table, row) {
  try {
    const { error } = await insforge.database.from(table).insert([row]);
    if (error) { console.error('InsForge save failed:', error); toast('Saved on this device only. Cloud save failed.'); return false; }
    toast('Saved to the cloud');
    return true;
  } catch (e) {
    console.error('InsForge error:', e);
    toast('Cloud save failed. Check the console.');
    return false;
  }
}

const $=s=>document.querySelector(s);
const CATS={Study:'📚',Work:'💼',Creative:'🎨',Reading:'📖',Fitness:'🏃'};
const TABS=[['home','🏠','Home'],['focus','⏱️','Focus'],['tasks','✅','Tasks'],['stats','📊','Stats'],['shop','🛍️','Shop'],['goals','🎯','Goals']];
const day=(o=0)=>{const d=new Date();d.setDate(d.getDate()+o);return d.toLocaleDateString('en-CA')};
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
function load(){try{const j=JSON.parse(localStorage.getItem('pf2')||'null');if(j)return j}catch(e){}
 return{name:'Mochi',coins:20,streak:0,last:'',hunger:80,happy:80,hs:Date.now(),tasks:[],goals:[{c:'Study',t:60},{c:'Work',t:90}],logs:[],bow:false,dgoal:120,auto:true}}
let S=load(),cur='home',tid=0;
function save(){try{localStorage.setItem('pf2',JSON.stringify(S))}catch(e){}}
function decay(){const h=(Date.now()-S.hs)/36e5;S.hunger=clamp(S.hunger-h*4);S.happy=clamp(S.happy-h*2);S.hs=Date.now();save()}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.k);toast.k=setTimeout(()=>t.classList.remove('on'),2400)}
function beep(){try{const a=new (window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=660;g.gain.setValueAtTime(.2,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.8);o.start();o.stop(a.currentTime+.8)}catch(e){}}
function addLog(c,s){s=Math.round(s);if(s<1)return;S.logs.push({d:day(),c,s});const t=day();
 if(S.last!==t){S.streak=S.last===day(-1)?S.streak+1:1;S.last=t}save()}
const tot=(d,c)=>S.logs.filter(l=>l.d===d&&(!c||l.c===c)).reduce((a,l)=>a+l.s,0);
const fmt=s=>{s=Math.round(s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?`${h}h ${m}m`:`${m}m`};
const clock=s=>{const m=Math.floor(s/60),x=s%60;return String(m).padStart(2,'0')+':'+String(x).padStart(2,'0')};
const hms=s=>{s=Math.floor(s);return Math.floor(s/3600)+':'+clock(s%3600)};

function cat(){const sad=S.hunger<30||S.happy<30;
 return `<svg viewBox="0 0 200 200" class="cat" role="img" aria-label="${S.name} the cat"><path class="tail" d="M146 156c40-4 48-48 22-66" stroke="#F0974A" stroke-width="16" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="152" rx="46" ry="38" fill="#F4A259"/><ellipse cx="100" cy="160" rx="27" ry="26" fill="#FFE8CC"/><ellipse cx="80" cy="188" rx="15" ry="8" fill="#FFE8CC"/><ellipse cx="120" cy="188" rx="15" ry="8" fill="#FFE8CC"/><path d="M46 82L54 28L92 56zM154 82L146 28L108 56z" fill="#F4A259"/><path d="M57 70L61 42L82 58zM143 70L139 42L118 58z" fill="#FFB5C0"/><ellipse cx="100" cy="95" rx="58" ry="48" fill="#F4A259"/><path d="M100 49v14M86 52l4 12M114 52l-4 12" stroke="#D9803A" stroke-width="5" stroke-linecap="round"/><ellipse cx="100" cy="110" rx="25" ry="17" fill="#FFE8CC"/><g class="eyes"><ellipse cx="74" cy="92" rx="12" ry="${sad?10:14}" fill="#1B2150"/><ellipse cx="126" cy="92" rx="12" ry="${sad?10:14}" fill="#1B2150"/><circle cx="70" cy="${sad?89:86}" r="4.5" fill="#fff"/><circle cx="122" cy="${sad?89:86}" r="4.5" fill="#fff"/><circle cx="78" cy="98" r="2" fill="#fff"/><circle cx="130" cy="98" r="2" fill="#fff"/></g><circle cx="56" cy="110" r="7" fill="#FF9DB0" opacity=".6"/><circle cx="144" cy="110" r="7" fill="#FF9DB0" opacity=".6"/><path d="M95 103h10l-5 6z" fill="#FF7A93"/><path d="${sad?'M92 118q8-6 16 0':'M90 112q5 8 10 0q5 8 10 0'}" stroke="#7a3b1d" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M38 100l-20-4M38 108l-20 4M162 100l20-4M162 108l20 4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>${S.bow?'<path d="M100 140l-18-10v20zM100 140l18-10v20z" fill="#e8476a"/><circle cx="100" cy="140" r="5" fill="#c92f52"/>':''}</svg>`}
function msg(){if(T.active&&T.mode==='focus')return 'Shh… we’re in the zone!';if(S.hunger<30)return 'I’m hungry. Feed me in the shop!';if(S.happy<30)return 'I’m a bit lonely. Let’s focus together!';return 'I’m ready to focus! Let’s set up a timer!'}
function bars(){return `<div class="stats"><div>🐟 Hunger<b>${Math.round(S.hunger)}%</b></div><div>❤️ Happiness<b>${Math.round(S.happy)}%</b></div></div>`}
function prog(l,v,t){return `<div class="row"><b>${l}</b><span class="mut">${fmt(v)} / ${fmt(t)}</span></div><div class="bar"><i style="width:${clamp(v/t*100)}%"></i></div>`}

/* timer */
let T={mins:25,cat:'Work',active:false,run:false,mode:'focus',total:0,left:0,end:0};
function startT(mode,mins){T.mode=mode;T.total=mins*60;T.left=T.total;T.end=Date.now()+T.total*1000;T.active=true;T.run=true;render()}
function leftNow(){return T.run?Math.max(0,Math.round((T.end-Date.now())/1000)):T.left}
function finish(early){const el=T.total-leftNow();
 if(T.mode==='focus'){addLog(T.cat,el);const c=Math.max(early?0:1,Math.round(el/60));S.coins+=c;S.happy=clamp(S.happy+(early?1:6));save();
  if(!early){beep();toast(`Session done! +${c} coins`);if(S.auto){startT('break',5);return}}else toast(`Logged ${fmt(el)}. +${c} coins`)}
 else{beep();toast('Break over. Ready for another round?')}
 T.active=false;T.run=false;document.title='Purrfocus';render()}
function tick(){
 if(T.active&&T.run){const l=leftNow();document.title=clock(l)+' · Purrfocus';
  const t=$('#tm');if(t){t.textContent=clock(l);const r=$('#rg');if(r)r.style.strokeDashoffset=(1-l/T.total)*691}
  if(l<=0)finish(false)}
 document.querySelectorAll('[data-tt]').forEach(e=>{const k=S.tasks.find(x=>x.id==e.dataset.tt);if(k)e.textContent=hms(k.sec+(k.on?(Date.now()-k.on)/1000:0))})}
setInterval(tick,250);setInterval(()=>{decay();if(cur==='home')render()},60000);

/* views */
const V={
home(){const h=new Date().getHours(),d=day(),open=S.tasks.filter(t=>!t.done).slice(0,3);
 return `<div class="grid"><section class="card"><div class="row"><div><b>Good ${h<12?'morning':h<18?'afternoon':'evening'}</b><div class="mut">${new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'})}</div></div><span class="pill" title="Day streak">🔥 ${S.streak}</span></div>
 <div class="stage"><input class="nm" id="nm" value="${S.name}" maxlength="12" aria-label="Cat name"><div class="bubble">${msg()}</div>${cat()}</div>${bars()}
 <button class="btn" data-go="focus">${T.active?'Back to your session':'Start focus session'}</button><p class="mut" style="text-align:center;margin:10px 0 0">${T.mins} min · customizable</p></section>
 <section class="card"><div class="row"><h2>Today’s focus</h2><button class="chip" data-go="goals">View all</button></div>
 ${prog('Daily goal',tot(d),S.dgoal*60)}${S.goals.map(g=>prog(CATS[g.c]+' '+g.c,tot(d,g.c),g.t*60)).join('')}
 <h3>Up next</h3>${open.length?open.map(t=>`<div class="item"><span>${CATS[t.c]}</span><div class="g"><b>${esc(t.n)}</b></div><button class="ic" data-a="done" data-i="${t.id}" aria-label="Mark done">✓</button></div>`).join(''):'<p class="mut">No open tasks. Add one in Tasks.</p>'}
 <button class="btn alt" data-go="tasks" style="margin-top:10px">Manage tasks</button></section></div>`},
focus(){
 if(T.active){const l=leftNow();return `<section class="card" style="max-width:520px;margin:auto;text-align:center"><h2>${T.mode==='focus'?CATS[T.cat]+' '+T.cat+' session':'Break time'}</h2><p class="mut">${T.mode==='focus'?S.name+' is focusing with you!':'Stretch, drink water, rest your eyes.'}</p><div class="stage" style="padding-bottom:0">${cat()}</div>
 <div class="ring"><svg viewBox="0 0 240 240"><circle cx="120" cy="120" r="110" fill="none" stroke="var(--soft)" stroke-width="12"/><circle id="rg" cx="120" cy="120" r="110" fill="none" stroke="var(--pri)" stroke-width="12" stroke-linecap="round" stroke-dasharray="691" stroke-dashoffset="${(1-l/T.total)*691}"/></svg><div class="t"><span id="tm">${clock(l)}</span><small>${T.run?'remaining':'paused'}</small></div></div>
 <div class="two"><button class="btn alt" data-a="pause">${T.run?'Pause':'Resume'}</button><button class="btn" data-a="end">${T.mode==='focus'?'End & log time':'Skip break'}</button></div></section>`}
 return `<div class="grid"><section class="card"><h2>Focus session</h2><p class="mut">${S.name} is ready to focus with you!</p><div class="stage" style="padding-bottom:0">${cat()}</div>
 <h3>What are you focusing on?</h3><div class="chips">${Object.keys(CATS).map(c=>`<button class="chip ${T.cat===c?'on':''}" data-a="cat" data-v="${c}">${CATS[c]} ${c}</button>`).join('')}</div></section>
 <section class="card"><h2 style="text-align:center">Focus time</h2><div class="step"><button data-a="min" data-v="-5" aria-label="Less time">−</button><div class="n">${T.mins}<div class="mut" style="font-size:13px;font-weight:600">minutes</div></div><button data-a="min" data-v="5" aria-label="More time">+</button></div>
 <div class="chips" style="justify-content:center">${[5,10,15,25,30,45,60].map(m=>`<button class="chip ${T.mins===m?'on':''}" data-a="set" data-v="${m}">${m}m</button>`).join('')}</div>
 <h3>Break time</h3><label class="mut" style="display:flex;gap:8px;align-items:center;margin-bottom:16px"><input type="checkbox" id="auto" ${S.auto?'checked':''}> Pomodoro: start a 5 min break after each session</label>
 <button class="btn" data-a="start">Start focus session</button><p class="mut" style="text-align:center">Earn 1 coin for every focused minute.</p></section></div>`},
tasks(){const run=S.tasks.find(t=>t.on);
 return `<section class="card" style="max-width:700px;margin:auto"><h2>Tasks & time tracker</h2><p class="mut">Press play on a task to track the time you spend on it.</p>
 <div class="add"><input id="tn" placeholder="What do you need to do?" maxlength="80" aria-label="Task name"><select id="tc" aria-label="Category">${Object.keys(CATS).map(c=>`<option>${c}</option>`).join('')}</select><button class="btn sm" data-a="addt">Add task</button></div>
 ${S.tasks.length?S.tasks.map(t=>`<div class="item ${t.done?'done':''}"><button class="ic" data-a="done" data-i="${t.id}" aria-label="${t.done?'Reopen':'Complete'}">${t.done?'↺':'✓'}</button><div class="g"><b>${esc(t.n)}</b><span class="mut">${CATS[t.c]} ${t.c}</span></div><span class="mut" data-tt="${t.id}" style="font-variant-numeric:tabular-nums">${hms(t.sec+(t.on?(Date.now()-t.on)/1000:0))}</span>${t.done?'':`<button class="ic ${t.on?'live':''}" data-a="trk" data-i="${t.id}" aria-label="${t.on?'Pause tracking':'Start tracking'}">${t.on?'⏸':'▶'}</button>`}<button class="ic" data-a="del" data-i="${t.id}" aria-label="Delete task">🗑</button></div>`).join(''):'<p class="mut">No tasks yet. Add your first one above.</p>'}</section>`},
stats(){const d=[...Array(7)].map((_,i)=>day(i-6)),vals=d.map(x=>tot(x)),mx=Math.max(...vals,1),wk=vals.reduce((a,b)=>a+b,0),
 n=S.logs.filter(l=>d.includes(l.d)).length;
 return `<div class="kpi"><div class="mut">Today<b>${fmt(tot(day()))}</b></div><div class="mut">This week<b>${fmt(wk)}</b></div><div class="mut">Day streak<b>🔥 ${S.streak}</b></div><div class="mut">Entries (7d)<b>${n}</b></div></div>
 <div class="grid"><section class="card"><h2>Last 7 days</h2><div class="chart">${d.map((x,i)=>`<div><span>${vals[i]?fmt(vals[i]):''}</span><i style="height:${vals[i]/mx*80}%"></i><span>${new Date(x+'T12:00').toLocaleDateString('en',{weekday:'short'})}</span></div>`).join('')}</div></section>
 <section class="card"><h2>Where your time goes</h2>${Object.keys(CATS).map(c=>{const v=S.logs.filter(l=>d.includes(l.d)&&l.c===c).reduce((a,l)=>a+l.s,0);return `<div class="row"><b>${CATS[c]} ${c}</b><span class="mut">${fmt(v)}</span></div><div class="bar"><i style="width:${wk?v/wk*100:0}%"></i></div>`}).join('')}</section></div>`},
shop(){const it=[['🐟','Tuna snack',8,'Restores 25% hunger','feed'],['🐭','Toy mouse',12,'Adds 20% happiness','toy'],['🎀','Red bow',40,S.bow?'Owned – tap to unequip':'Style '+S.name+' with a bow','bow']];
 return `<p style="color:#fff;font-weight:700;margin:0 0 12px">Spend the coins you earn from focus time to look after ${S.name}.</p><div class="shop">${it.map(i=>`<section class="card"><div class="e">${i[0]}</div><h2>${i[1]}</h2><p class="mut">${i[3]}</p><button class="btn" data-a="buy" data-v="${i[4]}" data-p="${i[2]}">${i[4]==='bow'&&S.bow?'Unequip':'Buy for '+i[2]+' 🪙'}</button></section>`).join('')}</div><div class="grid" style="margin-top:18px"><section class="card"><div class="stage">${cat()}</div>${bars()}</section></div>`},
goals(){return `<div class="grid"><section class="card"><h2>Daily focus goal</h2><div class="step"><button data-a="dg" data-v="-15" aria-label="Lower goal">−</button><div class="n">${S.dgoal}<div class="mut" style="font-size:13px;font-weight:600">minutes a day</div></div><button data-a="dg" data-v="15" aria-label="Raise goal">+</button></div>${prog('Today',tot(day()),S.dgoal*60)}</section>
 <section class="card"><h2>Category goals</h2><div class="add"><select id="gc" aria-label="Category">${Object.keys(CATS).map(c=>`<option>${c}</option>`).join('')}</select><input id="gt" type="number" min="5" max="480" value="30" aria-label="Minutes per day"><button class="btn sm" data-a="addg">Add goal</button></div>
 ${S.goals.length?S.goals.map((g,i)=>`<div class="item"><div class="g">${prog(CATS[g.c]+' '+g.c,tot(day(),g.c),g.t*60)}</div><button class="ic" data-a="delg" data-i="${i}" aria-label="Remove goal">🗑</button></div>`).join(''):'<p class="mut">No category goals yet. Add one above.</p>'}</section></div>`}};
function esc(s){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function render(){decay();$('#coins').textContent='🪙 '+S.coins;$('#v').innerHTML=V[cur]();
 $('#nav').innerHTML=TABS.map(t=>`<button data-go="${t[0]}" class="${cur===t[0]?'on':''}">${t[2]}</button>`).join('');
 $('#bn').innerHTML=TABS.map(t=>`<button data-go="${t[0]}" class="${cur===t[0]?'on':''}"><span>${t[1]}</span>${t[2]}</button>`).join('')}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){cur=g.dataset.go;render();scrollTo(0,0);return}
 const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,v=b.dataset.v,i=+b.dataset.i;
 if(a==='cat')T.cat=v;
 else if(a==='min')T.mins=clamp(T.mins+ +v,5,180);
 else if(a==='set')T.mins=+v;
 else if(a==='start'){startT('focus',T.mins);return}
 else if(a==='pause'){if(T.run){T.left=leftNow();T.run=false}else{T.end=Date.now()+T.left*1000;T.run=true}}
 else if(a==='end'){finish(true);return}
 else if(a==='addt'){const n=$('#tn').value.trim();if(!n){toast('Type a task name first');return}const c=$('#tc').value;S.tasks.unshift({id:++tid+Date.now(),n,c,done:false,sec:0,on:0});saveToInsForge('tasks',{name:n,category:c,done:false,seconds:0})}
 else if(a==='trk'){const t=S.tasks.find(x=>x.id===i);S.tasks.forEach(k=>{if(k.on){const s=(Date.now()-k.on)/1000;k.sec+=s;addLog(k.c,s);k.on=0}});if(!t.on&&!(b.classList.contains('live')))t.on=Date.now()}
 else if(a==='done'){const t=S.tasks.find(x=>x.id===i);if(t.on){const s=(Date.now()-t.on)/1000;t.sec+=s;addLog(t.c,s);t.on=0}t.done=!t.done;if(t.done){S.coins+=5;S.happy=clamp(S.happy+3);toast('Task done! +5 coins')}}
 else if(a==='del')S.tasks=S.tasks.filter(x=>x.id!==i);
 else if(a==='buy'){const p=+b.dataset.p;if(v==='bow'&&S.bow)S.bow=false;else if(S.coins<p){toast('Not enough coins yet. Keep focusing!');return}else{S.coins-=p;if(v==='feed')S.hunger=clamp(S.hunger+25);if(v==='toy')S.happy=clamp(S.happy+20);if(v==='bow')S.bow=true;toast(S.name+' loves it!')}}
 else if(a==='dg')S.dgoal=clamp(S.dgoal+ +v,15,600);
 else if(a==='addg'){const t=clamp(+$('#gt').value||30,5,480);S.goals.push({c:$('#gc').value,t})}
 else if(a==='delg')S.goals.splice(i,1);
 save();render()});
document.addEventListener('change',e=>{if(e.target.id==='nm'){S.name=e.target.value.trim()||'Mochi';save();render()}if(e.target.id==='auto'){S.auto=e.target.checked;save()}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='tn')document.querySelector('[data-a=addt]').click()});
render();