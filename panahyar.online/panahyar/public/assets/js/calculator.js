/* ============================================================
   پناه‌یار | ماشین‌حساب مهاجرت
   کاملاً سمت کلاینت — هیچ داده‌ای به سرور ارسال یا ذخیره نمی‌شود.
   ============================================================ */
(function () {
  'use strict';

  const app = document.getElementById('calc-app');
  if (!app) return;

  const stepsEl  = document.getElementById('calc-steps');
  const barEl    = document.getElementById('calc-bar');
  const prevBtn  = document.getElementById('calc-prev');
  const nextBtn  = document.getElementById('calc-next');
  const resultEl = document.getElementById('calc-result');

  // وضعیت در حافظه (نه localStorage، نه کوکی)
  const S = {
    age: 30, marital: '', spouseApplicant: '', childrenU18: 0, childrenO18: 0,
    children: [], parents: { father: '', mother: '' }, siblings: 0,
    edu: '', langEn: 0, langOther: 0, hasLangCert: '',
    prevTravel: '', validVisa: '', special: [], budget: '',
    familyIllness: '', familyRejected: ''
  };

  let step = 0;

  const radio = (name, opts) => opts.map(o =>
    `<label class="opt"><input type="radio" name="${name}" value="${o.v}"> ${o.t}</label>`
  ).join('');

  const checks = (name, opts) => opts.map(o =>
    `<label class="opt"><input type="checkbox" name="${name}" value="${o.v}"> ${o.t}</label>`
  ).join('');

  const STEPS = [
    { // 0 — پایه
      title: 'اطلاعات پایه',
      html: () => `
        <div class="field">
          <label>سن: <b id="age-val">${S.age}</b> سال</label>
          <input type="range" min="16" max="80" value="${S.age}" id="age-slide">
        </div>
        <div class="field"><label>سطح تحصیلات</label>
          <div class="opts">${radio('edu',[
            {v:'under',t:'زیر دیپلم'},{v:'diploma',t:'دیپلم'},
            {v:'bachelor',t:'لیسانس'},{v:'master',t:'فوق‌لیسانس'},{v:'phd',t:'دکترا'}])}</div>
        </div>`,
      bind: () => {
        const sl = document.getElementById('age-slide');
        sl.addEventListener('input', () => {
          S.age = +sl.value; document.getElementById('age-val').textContent = sl.value;
        });
        bindRadio('edu', v => S.edu = v);
      }
    },
    { // 1 — تأهل و خانواده
      title: 'وضعیت تأهل و خانواده',
      html: () => `
        <div class="field"><label>وضعیت تأهل</label>
          <div class="opts">${radio('marital',[
            {v:'single',t:'مجرد'},{v:'married',t:'متأهل'},
            {v:'divorced',t:'مطلقه'},{v:'widowed',t:'همسر فوت‌شده'}])}</div>
        </div>
        <div id="family-zone"></div>`,
      bind: () => {
        bindRadio('marital', v => { S.marital = v; renderFamily(); });
        renderFamily();
      }
    },
    { // 2 — زبان
      title: 'توانایی زبانی',
      html: () => `
        <div class="field">
          <label>زبان انگلیسی: <b id="en-val">${S.langEn}</b> از ۱۰۰</label>
          <input type="range" min="0" max="100" value="${S.langEn}" id="en-slide">
          <small style="color:var(--muted)">آیا می‌توانید مصاحبه پناهندگی را بدون مترجم انجام دهید؟</small>
        </div>
        <div class="field">
          <label>یک زبان دیگر (آلمانی/فرانسوی/...): <b id="ot-val">${S.langOther}</b> از ۱۰۰</label>
          <input type="range" min="0" max="100" value="${S.langOther}" id="ot-slide">
        </div>
        <div class="field"><label>مدرک زبان رسمی دارید؟ (IELTS، Goethe، DELF...)</label>
          <div class="opts">${radio('cert',[{v:'yes',t:'بله'},{v:'no',t:'خیر'}])}</div>
        </div>`,
      bind: () => {
        const en = document.getElementById('en-slide'), ot = document.getElementById('ot-slide');
        en.addEventListener('input', () => { S.langEn=+en.value; document.getElementById('en-val').textContent=en.value; });
        ot.addEventListener('input', () => { S.langOther=+ot.value; document.getElementById('ot-val').textContent=ot.value; });
        bindRadio('cert', v => S.hasLangCert = v);
      }
    },
    { // 3 — سابقه سفر
      title: 'سابقه سفر و مدارک',
      html: () => `
        <div class="field"><label>سفر قبلی به اروپا/کانادا/استرالیا؟</label>
          <div class="opts">${radio('travel',[
            {v:'with',t:'بله، با ویزا'},{v:'without',t:'بله، بدون ویزا'},{v:'no',t:'خیر'}])}</div>
        </div>
        <div class="field"><label>ویزای معتبر شینگن/کانادا/بریتانیا دارید؟</label>
          <div class="opts">${radio('visa',[{v:'yes',t:'بله'},{v:'no',t:'خیر'}])}</div>
        </div>`,
      bind: () => { bindRadio('travel', v=>S.prevTravel=v); bindRadio('visa', v=>S.validVisa=v); }
    },
    { // 4 — وضعیت ویژه
      title: 'وضعیت ویژه (اختیاری و محرمانه)',
      html: () => `
        <p style="color:var(--muted);font-size:.9rem;margin-bottom:1rem">
          این موارد اختیاری است و ذخیره نمی‌شود. صرفاً برای دقت ارزیابی.</p>
        <div class="field"><label>کدام موارد درباره شما صدق می‌کند؟</label>
          <div class="opts">${checks('special',[
            {v:'religion',t:'تغییر دین'},{v:'political',t:'فعالیت سیاسی/اجتماعی'},
            {v:'gender',t:'خطر به دلیل جنسیت/گرایش جنسی'},
            {v:'prison',t:'سابقه زندان یا شکنجه در ایران'}])}</div>
        </div>
        <div class="field"><label>عضو خانواده با بیماری خاص نیازمند درمان فوری؟</label>
          <div class="opts">${radio('illness',[{v:'yes',t:'بله'},{v:'no',t:'خیر'}])}</div>
        </div>
        <div class="field"><label>آیا شما یا همسر/فرزند قبلاً درخواست پناهندگی رد شده دارید؟</label>
          <div class="opts">${radio('rejected',[{v:'yes',t:'بله'},{v:'no',t:'خیر'}])}</div>
        </div>`,
      bind: () => {
        bindChecks('special', arr => S.special = arr);
        bindRadio('illness', v=>S.familyIllness=v);
        bindRadio('rejected', v=>S.familyRejected=v);
      }
    },
    { // 5 — بودجه
      title: 'بودجه تقریبی مهاجرت',
      html: () => `
        <div class="field"><label>بودجه تقریبی شما</label>
          <div class="opts">${radio('budget',[
            {v:'low',t:'کمتر از ۳۰۰۰ دلار'},
            {v:'mid',t:'۳۰۰۰ تا ۱۰۰۰۰ دلار'},
            {v:'high',t:'بیشتر از ۱۰۰۰۰ دلار'}])}</div>
        </div>`,
      bind: () => bindRadio('budget', v=>S.budget=v)
    }
  ];

  function bindRadio(name, cb){
    document.querySelectorAll(`input[name="${name}"]`).forEach(r=>{
      if (r.value === S[mapKey(name)]) r.checked = true;
      r.addEventListener('change',()=>cb(r.value));
    });
  }
  function bindChecks(name, cb){
    const boxes = document.querySelectorAll(`input[name="${name}"]`);
    boxes.forEach(b=>{
      if (S.special.includes(b.value)) b.checked = true;
      b.addEventListener('change',()=>{
        cb([...boxes].filter(x=>x.checked).map(x=>x.value));
      });
    });
  }
  function mapKey(name){
    return {marital:'marital',edu:'edu',cert:'hasLangCert',travel:'prevTravel',
      visa:'validVisa',illness:'familyIllness',rejected:'familyRejected',budget:'budget'}[name]||name;
  }

  /* بخش خانواده پویا */
  function renderFamily(){
    const zone = document.getElementById('family-zone');
    if (!zone) return;
    if (S.marital !== 'married'){ zone.innerHTML=''; return; }
    zone.innerHTML = `
      <div class="family-block">
        <h4>اطلاعات خانواده <small>(فقط رنج سنی — بدون نام واقعی)</small></h4>
        <div class="field"><label>آیا همسر نیز متقاضی پناهندگی است؟</label>
          <div class="opts">${radio('spouseApp',[
            {v:'yes_with',t:'بله، همراه من'},{v:'yes_sep',t:'بله، جداگانه'},{v:'no',t:'خیر'}])}</div>
        </div>
        <div class="field"><label>تعداد فرزندان زیر ۱۸ سال</label>
          <select id="cu18">${numOpts(0,10,S.childrenU18)}</select>
        </div>
        <div class="field"><label>تعداد فرزندان بالای ۱۸ سال</label>
          <select id="co18">${numOpts(0,5,S.childrenO18)}</select>
        </div>
        <div class="field"><label>پدر و مادر تحت تکفل شما در ایران؟</label>
          <div class="opts">${checks('parents',[
            {v:'father',t:'پدر (وابسته مالی)'},{v:'mother',t:'مادر (وابسته مالی)'}])}</div>
        </div>
        <div class="field"><label>تعداد خواهر/برادر مجرد وابسته</label>
          <select id="sib">${numOpts(0,8,S.siblings)}</select>
        </div>
      </div>`;
    bindRadio('spouseApp', v=>S.spouseApplicant=v);
    document.getElementById('cu18').addEventListener('change',e=>S.childrenU18=+e.target.value);
    document.getElementById('co18').addEventListener('change',e=>S.childrenO18=+e.target.value);
    document.getElementById('sib').addEventListener('change',e=>S.siblings=+e.target.value);
  }
  const numOpts=(min,max,sel)=>{let s='';for(let i=min;i<=max;i++)s+=`<option value="${i}" ${i===sel?'selected':''}>${i}</option>`;return s;};

  /* رندر گام جاری */
  function render(){
    const st = STEPS[step];
    stepsEl.innerHTML = `<h3 style="color:var(--gold);margin-bottom:1rem">${st.title}</h3>` + st.html();
    st.bind && st.bind();
    barEl.style.width = ((step+1)/STEPS.length*100) + '%';
    prevBtn.style.visibility = step===0 ? 'hidden' : 'visible';
    nextBtn.textContent = step===STEPS.length-1 ? 'مشاهده نتیجه' : 'بعدی';
    resultEl.style.display='none';
  }

  nextBtn.addEventListener('click',()=>{
    if (step < STEPS.length-1){ step++; render(); }
    else showResult();
  });
  prevBtn.addEventListener('click',()=>{ if(step>0){step--;render();} });

  /* محاسبه و نمایش نتیجه (الگوریتم امتیازدهی ساده و شفاف) */
  function showResult(){
    let score = 0;
    if (S.age>=20 && S.age<=35) score+=20; else if (S.age<=45) score+=12; else score+=5;
    score += {under:2,diploma:6,bachelor:14,master:18,phd:20}[S.edu]||0;
    score += Math.round(S.langEn*0.2) + Math.round(S.langOther*0.1);
    if (S.hasLangCert==='yes') score+=8;
    if (S.special.length) score+=15; // مبنای قوی پناهندگی
    if (S.prevTravel==='with') score+=6;

    const familyMode = S.marital==='married' &&
      (S.childrenU18>0 || S.spouseApplicant==='yes_with') ? 'family' : 'individual';

    // پیشنهاد کشور بر اساس پروفایل (راهنمای کلی، نه قطعی)
    let countries=[];
    if (S.special.includes('religion')||S.special.includes('political'))
      countries=['آلمان','کانادا','استرالیا'];
    else if (familyMode==='family') countries=['آلمان','کانادا','سوئد'];
    else if (S.budget==='high') countries=['کانادا','استرالیا','آلمان'];
    else countries=['آلمان','هلند','بلژیک'];

    const path = S.special.length ? 'پناهندگی' :
      (S.edu==='master'||S.edu==='phd' ? 'ویزای کاری/تحصیلی یا بشردوستانه' : 'ویزای بشردوستانه');

    const langGoal = S.langEn<40 ? 'ابتدا زبان را به سطح B1 برسانید' : 'سطح زبان شما مناسب است';

    resultEl.style.display='block';
    resultEl.innerHTML = `
      <hr style="border-color:var(--line);margin:1.5rem 0">
      <h3 style="color:var(--gold)">نتیجه ارزیابی اولیه</h3>
      <div class="result-card">
        <p><b>نوع مهاجرت پیشنهادی:</b> ${familyMode==='family'?'پناهندگی/بازپیوند خانوادگی':'فردی'} — ${path}</p>
        <p><b>کشورهای مناسب‌تر (راهنمای کلی):</b> ${countries.join('، ')}</p>
        <p><b>وضعیت زبان:</b> ${langGoal}</p>
        <p><b>امتیاز آمادگی تقریبی:</b> ${Math.min(score,100)} از ۱۰۰</p>
        ${familyMode==='family' ? `<p class="warn">⚠️ اگر همسر/فرزندان در ایران می‌مانند، درخواست بازپیوند معمولاً باید ظرف ۳ ماه تا ۲ سال ثبت شود.</p>`:''}
        ${S.familyRejected==='yes' ? `<p class="warn">⚠️ سابقه رد قبلی نیازمند بررسی تخصصی است؛ حتماً مشاوره بگیرید.</p>`:''}
      </div>
      <p style="color:var(--muted);font-size:.88rem;margin-top:1rem">
        این یک ارزیابی اولیه و راهنمای کلی است، نه تصمیم حقوقی. برای پرونده واقعی حتماً مشاوره تخصصی بگیرید.</p>
      <a href="/consult" class="btn btn-gold" style="margin-top:1rem">ثبت درخواست مشاوره تخصصی</a>`;
    barEl.style.width='100%';
    stepsEl.innerHTML='';
    prevBtn.style.visibility='visible';
    nextBtn.style.display='none';
    resultEl.scrollIntoView({behavior:'smooth'});
  }

  render();
})();
