const $=(s,r=document)=>r.querySelector(s);
const page=document.body.dataset.page;
const user=()=>ld('sa_user',null);
const prog=()=>ld('sa_progress',{1:60,2:30,5:80,3:100});
const wish=()=>ld('sa_wish',[]);
const param=k=>new URLSearchParams(location.search).get(k);
const catIdx=n=>Math.max(0,CATS0.findIndex(k=>k.n===n));

function buildNav(){
 const u=user();
 const links=[['courses.html','Courses'],['categories.html','Categories'],['my-learning.html','My Learning']];
 const simple=page==='index';
 $('#nav').innerHTML=`<header class="nav"><a class="brand" href="index.html">SKILL ARENA</a>
 <button class="burger" id="burger" aria-label="Open menu">☰</button>
 <nav id="menu">${simple?'<a href="index.html" class="on">Home</a>':links.map(([h,t])=>`<a href="${h}" class="${location.pathname.endsWith(h)||(page==='category-courses'&&h==='categories.html')?'on':''}">${t}</a>`).join('')}
 <div class="who"><button id="who">● ${u?u.name.split(' ')[0]:'Account'} ▾</button>
 <div id="drop"><a href="index.html">${u?'Switch account':'Login / Sign up'}</a>${u?'<a href="#" id="out">Logout</a>':''}<a href="admin/login.html">Admin panel</a></div></div></nav></header>`;
 $('#foot').innerHTML='<footer>© 2026 Skill Arena. All rights reserved.</footer>';
 $('#burger').onclick=()=>$('#menu').classList.toggle('open');
 $('#who').onclick=()=>$('#drop').classList.toggle('open');
 const o=$('#out');if(o)o.onclick=e=>{e.preventDefault();localStorage.removeItem('sa_user');location.href='index.html'};
}

function card(c){
 const w=wish().includes(c.id);
 return `<article class="card"><a href="course-details.html?id=${c.id}" class="thumb t${catIdx(c.c)}" aria-label="${c.t}">${icon(c.c)}</a>
 <button class="heart ${w?'on':''}" data-w="${c.id}" aria-label="Save to wishlist">♥</button>
 <div class="cb"><h3><a href="course-details.html?id=${c.id}" style="color:inherit;text-decoration:none">${c.t}</a></h3><p>${c.i}</p>
 <p class="meta"><span>★ ${c.r}</span><span>${c.l}</span></p><p class="price">${price(c.p)}</p></div></article>`;
}
document.addEventListener('click',e=>{
 const h=e.target.closest('[data-w]');if(!h)return;
 const id=+h.dataset.w;let w=wish();
 w=w.includes(id)?w.filter(x=>x!==id):[...w,id];sv('sa_wish',w);
 h.classList.toggle('on');toast(w.includes(id)?'Added to wishlist':'Removed from wishlist');
 if(page==='my-learning')P['my-learning'].draw();
});
const published=()=>ld('sa_courses',COURSES).filter(c=>c.status!=='Draft');

function listing(base,useLevel){
 const draw=()=>{
  const s=$('#q').value.toLowerCase(),lv=useLevel?$('#lv').value:'';
  const l=base.filter(c=>(c.t+c.i).toLowerCase().includes(s)&&(!lv||c.l===lv));
  $('#grid').innerHTML=l.map(card).join('')||'<p class="empty">No courses match your search. Try a different keyword.</p>';
 };
 $('#q').oninput=draw;if(useLevel)$('#lv').onchange=draw;draw();
}

const P={
 index(){
  const lf=$('#loginForm'),sf=$('#signForm');
  lf.onsubmit=e=>{
   e.preventDefault();
   const id=lf.elements.id,pw=lf.elements.password;
   let ok=setErr(id,id.value.trim()?'':'Enter your email or username');
   ok=setErr(pw,pw.value?'':'Enter your password')&&ok;
   if(!ok)return;
   const reg=ld('sa_account',null);
   const good=(id.value.trim()==='student@skillarena.com'&&pw.value==='Student@123')||(reg&&id.value.trim()===reg.email&&pw.value===reg.password);
   if(!good)return setErr(pw,'Invalid email or password. Try the demo account shown below.');
   sv('sa_user',reg&&id.value.trim()===reg.email?reg:{name:'Demo Student',email:'student@skillarena.com'});
   location.href='my-learning.html';
  };
  sf.onsubmit=e=>{
   e.preventDefault();
   if(!checkForm(sf,false))return;
   const a={name:sf.elements.name.value.trim(),email:sf.elements.email.value.trim(),phone:sf.elements.phone.value.trim(),password:sf.elements.password.value};
   sv('sa_account',a);sv('sa_user',a);sv('sa_progress',{});
   toast('Account created. Taking you to your dashboard…');
   setTimeout(()=>location.href='my-learning.html',900);
  };
  $('#google').onclick=()=>{sv('sa_user',{name:'Demo Student',email:'student@skillarena.com'});location.href='my-learning.html'};
  $('#forgot').onclick=e=>{e.preventDefault();toast('Password reset link sent (demo).')};
  $('#toSign').onclick=e=>{e.preventDefault();sf.elements.name.focus()};
  $('#toLogin').onclick=e=>{e.preventDefault();lf.elements.id.focus()};
 },
 courses(){listing(published(),true)},
 categories(){
  const cs=ld('sa_courses',COURSES),cats=ld('sa_cats',CATS0).filter(c=>c.st==='Active');
  $('#cats').innerHTML=cats.map(k=>`<a class="cat" href="category-courses.html?c=${encodeURIComponent(k.n)}"><b>${k.ic}</b><span>${k.n}</span><small>${cs.filter(c=>c.c===k.n).length} courses</small></a>`).join('');
 },
 'category-courses'(){
  const n=param('c')||'Development';
  $('#cname').textContent=n;$('#ctitle').textContent=n;
  const k=CATS0.find(x=>x.n===n);if(k)$('#cdesc').textContent=k.d;
  listing(published().filter(c=>c.c===n),false);
 },
 'course-details'(){
  const c=published().find(x=>x.id===+param('id'))||published()[0];
  const p=prog(),enrolled=c.id in p;
  document.title=c.t+' | Skill Arena';
  $('#cat').textContent=c.c;$('#cat').href='category-courses.html?c='+encodeURIComponent(c.c);
  $('#ctitle').textContent=$('#ct2').textContent=c.t;
  $('#inst').textContent='Instructor: '+c.i;
  $('#rate').textContent=`★ ${c.r} (${c.s} students)`;
  $('#cdesc').textContent=`${c.t} is a ${c.l.toLowerCase()} course taught by ${c.i}. Learn step by step with short lessons, practice tasks and a certificate when you finish. Price: ${price(c.p)}.`;
  $('#learn').innerHTML=[`Core concepts of ${c.t}`,'Hands-on projects and exercises','Quizzes and a completion certificate'].map(x=>`<li>${x}</li>`).join('');
  const b=$('#start');b.textContent=enrolled?'Continue course':'Start course';
  b.onclick=()=>{if(!enrolled){p[c.id]=0;sv('sa_progress',p)}location.href='my-learning.html'};
  $('#play').onclick=()=>toast('Preview video is available after you start the course.');
 },
 'my-learning'(){
  const u=user();$('#welcome').textContent=`Welcome back, ${u?u.name.split(' ')[0]:'learner'}`;
  let tab='prog';
  const all=()=>ld('sa_courses',COURSES);
  const row=(c,right,p)=>`<div class="lrow"><a class="thumb t${catIdx(c.c)}" href="course-details.html?id=${c.id}">${icon(c.c)}</a><div><h3>${c.t}</h3><p style="margin:0">${c.i}</p>${p==null?'':`<div class="bar2"><i style="width:${p}%"></i></div>`}</div><div>${p==null?'':`<b>${p}%</b> `}${right}</div></div>`;
  P['my-learning'].draw=()=>{
   const p=prog(),w=wish(),list=all();
   $$('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
   let h='';
   if(tab==='prog')h=list.filter(c=>c.id in p&&p[c.id]<100).map(c=>row(c,`<button class="btn-ghost" data-go="${c.id}">Continue</button>`,p[c.id])).join('')||'<p class="empty">No courses in progress. <a href="courses.html">Browse courses</a> to start learning.</p>';
   if(tab==='done')h=list.filter(c=>p[c.id]>=100).map(c=>row(c,'<span class="btn-ghost">Completed ✓</span>',100)).join('')||'<p class="empty">Finish a course to see it here.</p>';
   if(tab==='wish')h=list.filter(c=>w.includes(c.id)).map(c=>row(c,`<button class="btn-ghost" data-w="${c.id}">Remove</button>`,null)).join('')||'<p class="empty">Tap the heart on any course to save it here.</p>';
   $('#list').innerHTML=h;
  };
  const $$=s=>[...document.querySelectorAll(s)];
  $('#tabs').onclick=e=>{if(e.target.dataset.t){tab=e.target.dataset.t;P['my-learning'].draw()}};
  $('#list').onclick=e=>{const g=e.target.dataset.go;if(!g)return;const p=prog();p[g]=Math.min(100,p[g]+10);sv('sa_progress',p);toast(p[g]>=100?'Course completed. Well done!':'Progress saved: '+p[g]+'%');P['my-learning'].draw()};
  P['my-learning'].draw();
 }
};
buildNav();P[page]();
