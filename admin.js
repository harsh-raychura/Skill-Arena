const $=(s,r=document)=>r.querySelector(s);
const page=document.body.dataset.page;
const esc=s=>String(s??'').replace(/"/g,'&quot;');
const nextId=l=>l.reduce((m,x)=>Math.max(m,x.id),0)+1;
let courses=ld('sa_courses',COURSES),cats=ld('sa_cats',CATS0),users=ld('sa_users',USERS0),enr=ld('sa_enr',ENR0);
const save=()=>{sv('sa_courses',courses);sv('sa_cats',cats);sv('sa_users',users);sv('sa_enr',enr)};
const badge=s=>`<span class="badge ${s==='Active'||s==='Published'?'ok':s==='Inactive'?'off':s==='Draft'?'dr':''}">${s}</span>`;
const acts=(id,edit=true)=>`<button class="ic" data-a="view" data-id="${id}" title="View" aria-label="View">👁</button>${edit?`<button class="ic" data-a="edit" data-id="${id}" title="Edit" aria-label="Edit">✏️</button><button class="ic" data-a="del" data-id="${id}" title="Delete" aria-label="Delete">🗑</button>`:''}`;

function chart(v,l){
 const w=600,h=220,m=34,mx=Math.max(...v)*1.15,pt=v.map((x,i)=>[m+i*(w-2*m)/(v.length-1),h-m-x/mx*(h-2*m)]);
 return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="Enrollment overview chart"><polyline fill="none" stroke="#1f3d2b" stroke-width="3" points="${pt.map(p=>p.join(',')).join(' ')}"/>${pt.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#d9a82e"/><text x="${p[0]}" y="${h-10}" text-anchor="middle" font-size="12">${l[i]}</text><text x="${p[0]}" y="${p[1]-10}" text-anchor="middle" font-size="11">${v[i]}</text>`).join('')}</svg>`;
}
function dlg(title,body,onSubmit,validate,okLabel='Save'){
 const d=document.createElement('dialog');
 d.innerHTML=`<form novalidate><h3>${title}</h3>${body}<div class="end"><button type="button" class="btn-ghost" data-x>${onSubmit?'Cancel':'Close'}</button>${onSubmit?`<button class="btn-main">${okLabel}</button>`:''}</div></form>`;
 document.body.appendChild(d);d.showModal();
 const close=()=>{d.close();d.remove()},fm=d.querySelector('form');
 d.querySelector('[data-x]').onclick=close;
 fm.onsubmit=e=>{e.preventDefault();if(!onSubmit)return close();if(validate&&!validate(fm))return;onSubmit(Object.fromEntries(new FormData(fm)));close()};
}
const fld=(f,v={})=>`<div class="mb-2"><label>${f.l}</label>${f.o?`<select name="${f.n}" class="form-select">${f.o.map(o=>`<option ${v[f.n]==o?'selected':''}>${o}</option>`).join('')}</select>`:`<input name="${f.n}" type="${f.t||'text'}" class="form-control" value="${esc(v[f.n])}">`}</div>`;
const form=(title,fields,v,fn,validate)=>dlg(title,fields.map(f=>fld(f,v)).join(''),fn,validate);
const info=(title,o)=>dlg(title,Object.entries(o).map(([k,v])=>`<p style="margin:.2rem 0"><b>${k}:</b> ${v}</p>`).join(''));

function crud(c){
 let q='',f='',pg=1;
 $('#content').innerHTML=`<div class="top"><h1>${c.title}</h1>${c.add?`<button class="btn-main" id="add">+ ${c.add}</button>`:''}</div>${c.stats||''}
 <div class="bar"><input id="q" class="form-control" type="search" placeholder="${c.ph}" aria-label="Search">${c.filter||''}</div>
 <div class="tw"><table><thead><tr>${c.head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody id="rows"></tbody></table></div><div class="pager" id="pager"></div>`;
 const draw=()=>{
  const all=c.list().filter(x=>c.match(x,q.toLowerCase(),f)),n=Math.max(1,Math.ceil(all.length/5));pg=Math.min(pg,n);
  $('#rows').innerHTML=all.slice((pg-1)*5,pg*5).map(c.row).join('')||`<tr><td colspan="9" style="text-align:center;padding:1.5rem">Nothing found. Try a different search.</td></tr>`;
  $('#pager').innerHTML=Array.from({length:n},(_,i)=>`<button class="pg ${i+1===pg?'on':''}" data-p="${i+1}">${i+1}</button>`).join('');
 };
 $('#q').oninput=e=>{q=e.target.value;pg=1;draw()};
 const sel=$('#flt');if(sel)sel.onchange=e=>{f=e.target.value;pg=1;draw()};
 $('#pager').onclick=e=>{if(e.target.dataset.p){pg=+e.target.dataset.p;draw()}};
 $('#rows').onclick=e=>{const b=e.target.closest('[data-a]');if(b)c.act(b.dataset.a,+b.dataset.id,draw)};
 if(c.add)$('#add').onclick=()=>c.act('add',0,draw);
 draw();
}

const PAGES={
 dashboard(){
  $('#content').innerHTML=`<h1>Dashboard</h1><div class="stats"><div class="stat">Total courses<b>${courses.length}</b></div><div class="stat">Categories<b>${cats.length}</b></div><div class="stat">Users<b>${users.length}</b></div><div class="stat">Enrollments<b>${enr.length}</b></div></div>
  <div class="panel" style="margin-bottom:1rem"><h3>Recent enrollments</h3><div class="tw" style="border:0"><table><thead><tr><th>User name</th><th>Course name</th><th>Date</th></tr></thead><tbody>${enr.slice(0,4).map(e=>`<tr><td>${e.u}</td><td>${e.c}</td><td>${e.d}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="panel"><h3>Enrollment overview (this month)</h3>${chart([240,410,270,390,260,420,470,610],['1 May','4 May','7 May','14 May','17 May','21 May','25 May','28 May'])}</div>`;
 },
 courses(){
  const fields=[{n:'t',l:'Course title'},{n:'c',l:'Category',o:cats.map(k=>k.n)},{n:'i',l:'Instructor'},{n:'p',l:'Price (0 = Free)',t:'number'},{n:'l',l:'Level',o:['Beginner','Intermediate','Advanced']},{n:'status',l:'Status',o:['Published','Draft']}];
  const req=fm=>{let ok=requireAll(fm);const p=fm.elements.p;if(p&&+p.value<0)ok=setErr(p,'Price cannot be negative')&&false;return ok};
  crud({title:'Manage Courses',add:'Add New Course',ph:'Search courses...',head:['Course title','Category','Instructor','Price','Status','Actions'],
  filter:`<select id="flt" class="form-select" aria-label="Category"><option value="">All categories</option>${cats.map(k=>`<option>${k.n}</option>`).join('')}</select>`,
  list:()=>courses,match:(x,q,f)=>x.t.toLowerCase().includes(q)&&(!f||x.c===f),
  row:x=>`<tr><td>${x.t}</td><td>${x.c}</td><td>${x.i}</td><td>${price(x.p)}</td><td>${badge(x.status)}</td><td>${acts(x.id)}</td></tr>`,
  act(a,id,draw){
   const x=courses.find(y=>y.id===id);
   if(a==='view')return info(x.t,{Category:x.c,Instructor:x.i,Level:x.l,Price:price(x.p),Students:x.s,Status:x.status});
   if(a==='del'){if(confirm('Delete "'+x.t+'"?')){courses=courses.filter(y=>y.id!==id);save();draw();toast('Course deleted')}return}
   form(a==='add'?'Add new course':'Edit course',fields,a==='add'?{}:x,v=>{v.p=+v.p;if(a==='add')courses.push({id:nextId(courses),r:4.5,s:0,...v});else Object.assign(x,v);save();draw();toast('Course saved')},req);
  }});
 },
 categories(){
  const fields=[{n:'n',l:'Category name'},{n:'ic',l:'Icon (emoji or symbol)'},{n:'d',l:'Description'},{n:'st',l:'Status',o:['Active','Inactive']}];
  crud({title:'Manage Categories',add:'Add New Category',ph:'Search categories...',head:['Icon','Category name','Courses','Status','Actions'],
  list:()=>cats,match:(x,q)=>x.n.toLowerCase().includes(q),
  row:x=>`<tr><td style="font-size:1.4rem">${x.ic}</td><td>${x.n}</td><td>${courses.filter(c=>c.c===x.n).length}</td><td>${badge(x.st)}</td><td>${acts(x.id)}</td></tr>`,
  act(a,id,draw){
   const x=cats.find(y=>y.id===id);
   if(a==='view')return info(x.n,{Description:x.d,Status:x.st,Courses:courses.filter(c=>c.c===x.n).length});
   if(a==='del'){if(confirm('Delete category "'+x.n+'"?')){cats=cats.filter(y=>y.id!==id);save();draw();toast('Category deleted')}return}
   form(a==='add'?'Add new category':'Edit category',fields,a==='add'?{}:x,v=>{if(a==='add')cats.push({id:nextId(cats),...v});else Object.assign(x,v);save();draw();toast('Category saved')},requireAll);
  }});
 },
 users(){
  /* Form 2: Admin Add User, validated with JavaScript (name, email, password length, confirm match, 10-digit phone) */
  const fields=[{n:'name',l:'Full name'},{n:'email',l:'Email'},{n:'phone',l:'Phone number'},{n:'password',l:'Password',t:'password'},{n:'confirm',l:'Confirm password',t:'password'},{n:'role',l:'Role',o:['Student','Instructor']}];
  crud({title:'Manage Users',add:'Add User',ph:'Search users...',head:['Name','Email','Role','Status','Actions'],
  list:()=>users,match:(x,q)=>(x.name+x.email).toLowerCase().includes(q),
  row:x=>`<tr><td>${x.name}</td><td>${x.email}</td><td>${x.role}</td><td>${badge(x.status)}</td><td>${acts(x.id)}<button class="ic" data-a="toggle" data-id="${x.id}" title="Activate / deactivate" aria-label="Activate or deactivate">⏻</button></td></tr>`,
  act(a,id,draw){
   const x=users.find(y=>y.id===id);
   if(a==='view')return info(x.name,{Email:x.email,Phone:x.phone,Role:x.role,Status:x.status});
   if(a==='toggle'){x.status=x.status==='Active'?'Inactive':'Active';save();draw();return toast(x.name+' is now '+x.status)}
   if(a==='del'){if(confirm('Delete user "'+x.name+'"?')){users=users.filter(y=>y.id!==id);save();draw();toast('User deleted')}return}
   if(a==='edit')return form('Edit user',fields.filter(f=>!/password|confirm/.test(f.n)),x,v=>{Object.assign(x,v);save();draw();toast('User updated')},fm=>checkForm(fm,false));
   form('Add user',fields,{},v=>{delete v.confirm;delete v.password;users.push({id:nextId(users),status:'Active',...v});save();draw();toast('User added')},fm=>checkForm(fm,true));
  }});
 },
 enrollments(){
  const tot=enr.length;
  crud({title:'Manage Enrollments',ph:'Search user or course...',head:['User name','Course name','Enrollment date','Progress','Status','Actions'],
  stats:`<div class="stats"><div class="stat">Total enrollments<b>${tot}</b></div><div class="stat">Completed<b>${enr.filter(e=>e.p>=100).length}</b></div><div class="stat">In progress<b>${enr.filter(e=>e.p<100).length}</b></div></div>`,
  filter:`<select id="flt" class="form-select" aria-label="Course"><option value="">All courses</option>${courses.map(c=>`<option>${c.t}</option>`).join('')}</select>`,
  list:()=>enr,match:(x,q,f)=>(x.u+x.c).toLowerCase().includes(q)&&(!f||x.c===f),
  row:x=>`<tr><td>${x.u}</td><td>${x.c}</td><td>${x.d}</td><td>${x.p}%</td><td>${badge(x.p>=100?'Completed':'In Progress')}</td><td>${acts(x.id,false)}</td></tr>`,
  act(a,id){const x=enr.find(y=>y.id===id);info('Enrollment #'+x.id,{Student:x.u,Course:x.c,Date:x.d,Progress:x.p+'%'})}});
 },
 reports(){
  const sets={'This month':[[240,410,270,390,260,420,470,610],['1 May','4 May','7 May','14 May','17 May','21 May','25 May','28 May']],'Last month':[[180,260,300,280,340,330,390,420],['1 Apr','4 Apr','7 Apr','14 Apr','17 Apr','21 Apr','25 Apr','28 Apr']],'This year':[[320,410,520,480,600,720],['Jan','Feb','Mar','Apr','May','Jun']]};
  const rev=enr.reduce((s,e)=>s+((courses.find(c=>c.t===e.c)||{}).p||0),0);
  $('#content').innerHTML=`<div class="top"><h1>Reports</h1><div><select id="rg" class="form-select" aria-label="Date range">${Object.keys(sets).map(k=>`<option>${k}</option>`).join('')}</select></div></div>
  <div class="stats"><div class="stat">Total users<b>${users.length}</b></div><div class="stat">Total courses<b>${courses.length}</b></div><div class="stat">Total enrollments<b>${enr.length}</b></div><div class="stat">Total revenue<b>$${rev.toFixed(2)}</b></div></div>
  <div class="panel"><h3>Enrollment overview</h3><div id="ch"></div></div><div class="end"><button class="btn-ghost" id="csv">Download CSV</button><button class="btn-main" id="pdf">Print / save as PDF</button></div>`;
  const dr=()=>{const s=sets[$('#rg').value];$('#ch').innerHTML=chart(...s)};
  $('#rg').onchange=dr;dr();
  $('#csv').onclick=()=>{const r=[['User','Course','Date','Progress']].concat(enr.map(e=>[e.u,e.c,e.d,e.p+'%'])).map(x=>x.map(v=>`"${v}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([r],{type:'text/csv'}));a.download='skill-arena-enrollments.csv';a.click()};
  $('#pdf').onclick=()=>print();
 },
 settings(){
  const s=ld('sa_settings',{name:'Skill Arena',tag:'Learn Skills. Build Your Future.',lang:'English',reg:1,rev:1,cert:1,maint:0});
  $('#content').innerHTML=`<h1>Settings</h1><p>Manage platform and preferences settings.</p><div class="tabs" id="tb"><button class="on" data-t="g">General</button><button data-t="p">Profile</button><button data-t="s">Security</button></div>
  <div class="panel" id="pane"></div>`;
  const ck=(n,l)=>`<label style="font-weight:400"><input type="checkbox" name="${n}" ${s[n]?'checked':''}> ${l}</label>`;
  const panes={
   g:`<form id="gf" novalidate><div class="mb-2"><label>Platform name</label><input name="name" class="form-control" value="${esc(s.name)}"></div><div class="mb-2"><label>Platform tagline</label><input name="tag" class="form-control" value="${esc(s.tag)}"></div><div class="mb-2"><label>Default language</label><select name="lang" class="form-select"><option>English</option><option>Hindi</option><option>Gujarati</option></select></div>${ck('reg','Allow new user registration')}<br>${ck('rev','Enable course review')}<br>${ck('cert','Enable certificates')}<br>${ck('maint','Maintenance mode')}<div class="end" style="justify-content:flex-start"><button class="btn-main">Save changes</button></div></form>`,
   p:`<form id="pf" novalidate><div class="mb-2"><label>Admin name</label><input name="name" class="form-control" value="Admin"></div><div class="mb-2"><label>Admin email</label><input name="email" class="form-control" value="admin@skillarena.com"></div><div class="mb-2"><label>Phone number</label><input name="phone" class="form-control" value="9999999999"></div><button class="btn-main">Save changes</button></form>`,
   s:`<form id="sf" novalidate><div class="mb-2"><label>New password</label><input name="password" type="password" class="form-control"></div><div class="mb-2"><label>Confirm new password</label><input name="confirm" type="password" class="form-control"></div><button class="btn-main">Change password</button></form>`};
  const show=t=>{
   [...document.querySelectorAll('#tb button')].forEach(b=>b.classList.toggle('on',b.dataset.t===t));$('#pane').innerHTML=panes[t];
   const f=$('#pane form');
   f.onsubmit=e=>{e.preventDefault();
    if(t==='g'){let ok=setErr(f.elements.name,f.elements.name.value.trim()?'':'Platform name is required');ok=setErr(f.elements.tag,f.elements.tag.value.trim()?'':'Tagline is required')&&ok;if(!ok)return;['reg','rev','cert','maint'].forEach(k=>s[k]=f.elements[k].checked?1:0);s.name=f.elements.name.value;s.tag=f.elements.tag.value;s.lang=f.elements.lang.value;sv('sa_settings',s)}
    if(t==='p'&&!checkForm(f,false))return;
    if(t==='s'&&!checkForm(f,true))return;
    toast('Changes saved')};
  };
  $('#tb').onclick=e=>{if(e.target.dataset.t)show(e.target.dataset.t)};show('g');
 }
};

function shell(){
 const items=[['dashboard','Dashboard','🏠'],['courses','Courses','📚'],['categories','Categories','🗂'],['users','Users','👥'],['enrollments','Enrollments','🎓'],['reports','Reports','📈'],['settings','Settings','⚙️']];
 document.body.innerHTML=`<div class="topbar"><button id="ham" aria-label="Menu">☰</button><span class="brand">SKILL ARENA Admin</span><span>Admin</span></div>
 <aside class="side" id="side">${items.map(([k,t,i])=>`<a href="${k}.html" class="${k===page?'on':''}">${i} ${t}</a>`).join('')}<a href="#" id="out">🚪 Logout</a></aside><main id="content"></main>`;
 $('#ham').onclick=()=>$('#side').classList.toggle('open');
 $('#out').onclick=e=>{e.preventDefault();sessionStorage.removeItem('sa_admin');location.href='login.html'};
}

if(page==='login'){
 const f=$('#af');
 f.onsubmit=e=>{
  e.preventDefault();
  const u=f.elements.username,p=f.elements.password;
  let ok=setErr(u,u.value.trim()?'':'Username is required');
  ok=setErr(p,p.value?'':'Password is required')&&ok;
  if(!ok)return;
  if(u.value.trim()==='admin'&&p.value==='Admin@123'){sessionStorage.setItem('sa_admin','1');location.href='dashboard.html'}
  else setErr(p,'Invalid username or password.');
 };
}else{
 if(!sessionStorage.getItem('sa_admin'))location.replace('login.html');
 else{shell();PAGES[page]()}
}
