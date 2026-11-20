(()=>{'use strict';
const el=id=>document.getElementById(id),dob=el('dob'),test=el('testDate'),method=el('method');
el('year').textContent=new Date().getFullYear();
const localToday=()=>{let d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
test.value=localToday();
function parse(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return null;const [y,m,d]=s.split('-').map(Number),v=new Date(Date.UTC(y,m-1,d));if(v.getUTCFullYear()!==y||v.getUTCMonth()!==m-1||v.getUTCDate()!==d)return null;return {y,m,d,ts:v.getTime()}}
const dayMs=86400000;
function clampDay(y,m,d){return Math.min(d,new Date(Date.UTC(y,m,0)).getUTCDate())}
function calendarAge(b,t){let months=(t.y-b.y)*12+(t.m-b.m);function anniversary(n){let total=b.y*12+(b.m-1)+n,y=Math.floor(total/12),m=total%12+1;return Date.UTC(y,m-1,clampDay(y,m,b.d))}if(anniversary(months)>t.ts)months--;return {y:Math.floor(months/12),m:months%12,d:Math.round((t.ts-anniversary(months))/dayMs)}}
function thirtyAge(b,t){let y=t.y-b.y,m=t.m-b.m,d=t.d-b.d;if(d<0){d+=30;m--}if(m<0){m+=12;y--}return {y,m,d}}
let current=null;
function recalc(){el('copied').textContent='';const b=parse(dob.value),t=parse(test.value);current=null;el('error').textContent='';if(b&&t){if(t.ts<b.ts)el('error').textContent='The assessment date cannot be before the date of birth.';else{current=(method.value==='thirty'?thirtyAge:calendarAge)(b,t);if(current.y<0||current.m<0||current.d<0||(current.d>=30&&method.value==='thirty')){el('error').textContent='The selected 30-day borrowing convention cannot represent these dates reliably. Use calendar age or follow the assessment manual.';current=null}}}for(const key of ['years','months','days'])el(key).textContent=current?current[{years:'y',months:'m',days:'d'}[key]]:'—';el('resultDetails').textContent=current?`${current.y};${String(current.m).padStart(2,'0')};${String(current.d).padStart(2,'0')} (years;months;days)`:'Select both dates to calculate';el('copy').disabled=!current;el('methodHelp').textContent=method.value==='thirty'?'When borrowing from the month column, the borrowed month is treated as 30 days. Check your assessment manual.':'Counts complete calendar months, then remaining days. Birthday on day 29–31 is adjusted to the last day of shorter months for month anniversaries.'}
dob.addEventListener('input',recalc);test.addEventListener('input',recalc);method.addEventListener('change',recalc);
el('today').addEventListener('click',()=>{test.value=localToday();recalc()});el('clear').addEventListener('click',()=>{dob.value='';test.value='';recalc();dob.focus()});
el('copy').addEventListener('click',async()=>{if(!current)return;const s=`Chronological age on assessment date: ${current.y} years, ${current.m} months, ${current.d} days (${current.y};${String(current.m).padStart(2,'0')};${String(current.d).padStart(2,'0')}). Calculation: ${method.value==='thirty'?'30-day month borrowing':'calendar months'}.`;try{await navigator.clipboard.writeText(s);el('copied').textContent='Copied to clipboard.'}catch(e){el('copied').textContent='Copy unavailable in this browser.'}});
recalc();})();
