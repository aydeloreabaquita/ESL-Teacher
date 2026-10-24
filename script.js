const classes=[{time:'08:00',student:'Mei Lin',course:'General English · B1',status:'Completed'},{time:'09:00',student:'Arun Patel',course:'Business English · B2',status:'Completed'},{time:'10:30',student:'Lucas Pereira',course:'Conversation · A2',status:'Scheduled'},{time:'13:00',student:'Hana Kim',course:'IELTS Speaking · B2',status:'Scheduled'},{time:'15:30',student:'Luis Garcia',course:'General English · A2',status:'Scheduled'},{time:'18:00',student:'Yuki Tanaka',course:'Conversation · B1',status:'Scheduled'}];
const initials=n=>n.split(' ').map(x=>x[0]).join('');
function card(c,track=false,i=0){return `<div class="class-item"><span class="class-time">${c.time}</span><span class="person"><span class="avatar">${initials(c.student)}</span><span><b>${c.student}</b><small>${c.course}</small></span></span>${track?`<span class="status-actions" data-class="${i}">${['Completed','Student missed','Teacher absent','Reschedule'].map(s=>`<button class="${c.status===s?'selected':''}" data-status="${s}">${s}</button>`).join('')}</span>`:`<span class="pill ${c.status==='Completed'?'green':'gold'}">${c.status}</span>`}</div>`}
document.querySelector('#todayList').innerHTML=classes.slice(0,4).map(c=>card(c)).join('');document.querySelector('#trackerList').innerHTML=classes.map((c,i)=>card(c,true,i)).join('');
function updatePay(){const completed=40+classes.filter(c=>c.status==='Completed'||c.status==='Student missed').length;document.querySelectorAll('#completedStat,#earnClasses').forEach(x=>x.textContent=completed);document.querySelectorAll('#balanceStat,#earnBalance').forEach(x=>x.textContent='$'+completed*10)}
document.querySelector('#trackerList').onclick=e=>{if(!e.target.dataset.status)return;const wrap=e.target.closest('[data-class]'),i=+wrap.dataset.class;classes[i].status=e.target.dataset.status;wrap.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b===e.target));updatePay()};
const days=['Mon 24','Tue 25','Wed 26','Thu 27','Fri 28','Sat 29','Sun 30'],times=['08:00','09:00','10:00','14:00','15:00','18:00'];document.querySelector('#availabilityGrid').innerHTML=days.map((d,di)=>`<div class="avail-day"><h3>${d}</h3>${times.map((t,i)=>`<button class="slot ${(i+di)%3?'open':''}">${t}</button>`).join('')}</div>`).join('');
document.querySelector('#availabilityGrid').onclick=e=>{if(!e.target.classList.contains('slot'))return;e.target.classList.toggle('open');document.querySelector('#openStat').textContent=document.querySelectorAll('.slot.open').length};document.querySelector('#saveAvailability').onclick=e=>{e.target.textContent='✓ Availability saved';setTimeout(()=>e.target.textContent='Save availability',1600)};
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-view]').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.querySelector('#'+b.dataset.view).classList.add('active')});document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>document.querySelector(`[data-view="${b.dataset.go}"]`).click());


/* Adapt the PillNav glide to both the vertical and mobile navigation. */
(() => {
  const nav = document.querySelector('.nav');
  const buttons = [...nav.querySelectorAll('[data-view]')];
  const glide = document.createElement('span');
  glide.className = 'nav-glide';
  glide.setAttribute('aria-hidden', 'true');
  nav.prepend(glide);
  let hovered = null;
  function sync() {
    buttons.forEach(button => {
      if (button.classList.contains('active')) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    const target = hovered || (nav.contains(document.activeElement) && buttons.includes(document.activeElement) ? document.activeElement : null) || buttons.find(button => button.classList.contains('active'));
    if (!target) { glide.style.opacity = '0'; return; }
    glide.style.width = target.offsetWidth + 'px';
    glide.style.height = target.offsetHeight + 'px';
    glide.style.transform = 'translate(' + target.offsetLeft + 'px,' + target.offsetTop + 'px)';
    glide.style.opacity = '1';
  }
  buttons.forEach(button => {
    button.addEventListener('pointerenter', () => { hovered = button; sync(); });
    button.addEventListener('focus', sync);
    button.addEventListener('click', sync);
  });
  nav.addEventListener('pointerleave', () => { hovered = null; sync(); });
  nav.addEventListener('focusout', () => requestAnimationFrame(sync));
  new ResizeObserver(sync).observe(nav);
  document.fonts.ready.then(sync);
  sync();
})();

(() => {
  const app = document.querySelector('.app');
  const toggle = document.querySelector('.sidebar-toggle');
  const compact = window.matchMedia('(max-width:950px)');
  let preference = null;
  try { const saved = localStorage.getItem('esl-sidebar-expanded'); if (saved !== null) preference = saved === 'true'; } catch {}
  function apply() {
    const expanded = preference === null ? !compact.matches : preference;
    app.classList.toggle('sidebar-collapsed', !expanded);
    app.classList.toggle('sidebar-expanded', expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'Collapse sidebar' : 'Expand sidebar');
    toggle.textContent = expanded ? '‹' : '›';
  }
  document.querySelectorAll('.nav [data-view]').forEach(button => {
    const label = button.querySelector('span').textContent;
    button.setAttribute('aria-label', label);
    button.querySelector('i').setAttribute('aria-hidden', 'true');
    const tip = document.createElement('span');
    tip.className = 'nav-tooltip';
    tip.setAttribute('aria-hidden', 'true');
    tip.textContent = label;
    button.append(tip);
  });
  toggle.addEventListener('click', () => {
    preference = toggle.getAttribute('aria-expanded') !== 'true';
    try { localStorage.setItem('esl-sidebar-expanded', String(preference)); } catch {}
    apply();
  });
  compact.addEventListener('change', apply);
  apply();
})();
