const ld=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const sv=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const CATS0=[
{id:1,n:'Development',ic:'</>',d:'Build websites, apps and software.',st:'Active'},
{id:2,n:'Data Science',ic:'📊',d:'Work with data, statistics and models.',st:'Active'},
{id:3,n:'Design',ic:'🎨',d:'Learn UI/UX and graphic design.',st:'Active'},
{id:4,n:'Marketing',ic:'📣',d:'Grow audiences and brands online.',st:'Active'},
{id:5,n:'IT & Software',ic:'🖥️',d:'Programming basics and IT skills.',st:'Active'},
{id:6,n:'More',ic:'⋯',d:'Other topics to explore.',st:'Active'}];
const COURSES=[
{id:1,t:'Web Development Bootcamp',i:'John Smith',c:'Development',r:4.8,l:'Beginner',p:0,s:120,status:'Published'},
{id:2,t:'Data Science Fundamentals',i:'Anna Lee',c:'Data Science',r:4.6,l:'Intermediate',p:49.99,s:98,status:'Published'},
{id:3,t:'UI/UX Design Introduction',i:'Mike Johnson',c:'Design',r:4.7,l:'Beginner',p:39.99,s:86,status:'Published'},
{id:4,t:'Digital Marketing Basics',i:'Sara Wilson',c:'Marketing',r:4.4,l:'Beginner',p:0,s:64,status:'Draft'},
{id:5,t:'Python for Beginners',i:'David Brown',c:'IT & Software',r:4.9,l:'Beginner',p:29.99,s:210,status:'Published'},
{id:6,t:'JavaScript Essentials',i:'John Smith',c:'Development',r:4.5,l:'Intermediate',p:24.99,s:132,status:'Published'},
{id:7,t:'Machine Learning Intro',i:'Anna Lee',c:'Data Science',r:4.6,l:'Advanced',p:59.99,s:75,status:'Published'},
{id:8,t:'Graphic Design Basics',i:'Mike Johnson',c:'Design',r:4.3,l:'Beginner',p:0,s:58,status:'Published'}];
const USERS0=[
{id:1,name:'John Doe',email:'john@example.com',phone:'9876543210',role:'Student',status:'Active'},
{id:2,name:'Alice Smith',email:'alice@example.com',phone:'9876500011',role:'Student',status:'Active'},
{id:3,name:'Robert Brown',email:'robert@example.com',phone:'9812345678',role:'Student',status:'Inactive'},
{id:4,name:'Emma Wilson',email:'emma@example.com',phone:'9898989898',role:'Instructor',status:'Active'},
{id:5,name:'Mike Johnson',email:'mike@example.com',phone:'9765432101',role:'Instructor',status:'Active'}];
const ENR0=[
{id:1,u:'John Doe',c:'Web Development Bootcamp',d:'20 May 2026',p:60},
{id:2,u:'Alice Smith',c:'Data Science Fundamentals',d:'19 May 2026',p:80},
{id:3,u:'Robert Brown',c:'UI/UX Design Introduction',d:'18 May 2026',p:100},
{id:4,u:'Emma Wilson',c:'Digital Marketing Basics',d:'18 May 2026',p:30},
{id:5,u:'Mike Johnson',c:'Python for Beginners',d:'17 May 2026',p:50},
{id:6,u:'Sara Wilson',c:'JavaScript Essentials',d:'16 May 2026',p:70}];
const icon=n=>(CATS0.find(k=>k.n===n)||CATS0[5]).ic;
const price=p=>p?'$'+p.toFixed(2):'Free';
