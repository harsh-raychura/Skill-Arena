/* JavaScript validation (used by Student Sign Up form and Admin Add User form) */
const V={
 email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
 phone:v=>/^\d{10}$/.test(v),
 pass:v=>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(v)
};
function setErr(el,msg){
 el.classList.toggle('is-invalid',!!msg);
 let f=el.parentElement.querySelector('.err');
 if(!f){f=document.createElement('div');f.className='err';el.parentElement.appendChild(f)}
 f.textContent=msg||'';
 return !msg;
}
function checkForm(form,confirm){
 let ok=true;
 const t=(n,fn)=>{const e=form.elements[n];if(!e)return;const v=(n==='password'||n==='confirm')?e.value:e.value.trim();ok=setErr(e,fn(v))&&ok};
 t('name',v=>!v?'Full name is required':v.length<3?'Name must be at least 3 characters':'');
 t('email',v=>!v?'Email is required':!V.email(v)?'Enter a valid email, for example name@example.com':'');
 t('phone',v=>!v?'Phone number is required':!V.phone(v)?'Phone number must be exactly 10 digits':'');
 t('password',v=>!v?'Password is required':v.length<8?'Password must be at least 8 characters':!V.pass(v)?'Use an uppercase letter, a lowercase letter, a digit and a special character':'');
 if(confirm)t('confirm',v=>!v?'Confirm your password':v!==form.elements.password.value?'Passwords do not match':'');
 return ok;
}
function requireAll(form){
 let ok=true;
 [...form.elements].forEach(e=>{if(e.name&&e.tagName!=='BUTTON')ok=setErr(e,e.value.trim()?'':'This field is required')&&ok});
 return ok;
}
function toast(m){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}t.textContent=m;t.className='show';clearTimeout(t.h);t.h=setTimeout(()=>t.className='',2600)}
document.addEventListener('change',e=>{if(e.target.dataset.show){e.target.closest('form').querySelectorAll('input[type=password],input[data-pw]').forEach(i=>{i.type=e.target.checked?'text':'password';i.dataset.pw=1})}});
