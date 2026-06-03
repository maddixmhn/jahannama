/* ============================================================
   پناه‌یار | اسکریپت اصلی
   ============================================================ */
(function () {
  'use strict';

  /* ---------- تب قاره‌ها + فیلتر پرچم‌ها ---------- */
  const tabs = document.querySelectorAll('.continent-tabs button');
  const cards = document.querySelectorAll('.flag-card');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const c = btn.dataset.continent;
      cards.forEach(function (card) {
        card.style.display = (c === 'all' || card.dataset.continent === c) ? '' : 'none';
      });
    });
  });

  /* ---------- مودال کشور (داده از data-attribute) ---------- */
  const modal = document.getElementById('country-modal');
  if (modal) {
    const box = {
      name:    document.getElementById('m-name'),
      flag:    document.getElementById('m-flag'),
      asylum:  document.getElementById('m-asylum'),
      human:   document.getElementById('m-human'),
      form:    document.getElementById('m-form'),
      source:  document.getElementById('m-source'),
    };
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        box.name.textContent   = card.dataset.name || '';
        box.flag.textContent   = card.dataset.flag || '🏳️';
        box.asylum.textContent = card.dataset.asylum || 'اطلاعاتی ثبت نشده است.';
        box.human.textContent  = card.dataset.human || '—';
        // فرم رسمی → فقط لینک (طبق توصیه: ارجاع به منبع رسمی)
        if (card.dataset.formUrl) {
          box.form.innerHTML = (card.dataset.formName || 'فرم رسمی') +
            ' — <a href="' + card.dataset.formUrl + '" target="_blank" rel="noopener">مشاهده در سایت رسمی ↗</a>';
        } else {
          box.form.textContent = '—';
        }
        if (card.dataset.url) {
          box.source.innerHTML = '<a href="' + card.dataset.url +
            '" target="_blank" rel="noopener">منبع رسمی ↗</a>';
        } else {
          box.source.textContent = '—';
        }
        modal.classList.add('open');
      });
    });
    modal.addEventListener('click', function (ev) {
      if (ev.target === modal || ev.target.classList.contains('modal-close')) {
        modal.classList.remove('open');
      }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });
  }

  /* ---------- منوی موبایل ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      if (!open) {
        links.style.position = 'absolute';
        links.style.flexDirection = 'column';
        links.style.background = 'var(--navy-800)';
        links.style.top = '60px'; links.style.left = '0'; links.style.right = '0';
        links.style.padding = '1rem'; links.style.gap = '1rem';
        links.style.borderBottom = '1px solid var(--line)';
      }
    });
  }

  /* ---------- پارالاکس سبک ---------- */
  const stars = document.querySelector('.parallax-stars');
  if (stars) {
    window.addEventListener('scroll', function () {
      stars.style.transform = 'translateY(' + (window.scrollY * 0.15) + 'px)';
    }, { passive: true });
  }

  /* ============================================================
     محافظت ضد کپی (کامل — طبق درخواست کارفرما)
     توجه فنی: این موارد کاربر عادی را محدود می‌کند ولی توسط
     کاربر حرفه‌ای قابل دور زدن است. صرفاً یک لایه بازدارنده است.
     ============================================================ */
  const warn = document.getElementById('copy-warning');
  function flash(msg) {
    if (!warn) return;
    warn.textContent = msg || 'این محتوا محافظت‌شده است.';
    warn.classList.add('show');
    clearTimeout(warn._t);
    warn._t = setTimeout(() => warn.classList.remove('show'), 1800);
  }

  // راست‌کلیک
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault(); flash('راست‌کلیک غیرفعال است.');
  });
  // کپی / برش
  document.addEventListener('copy', function (e) { e.preventDefault(); flash('کپی غیرفعال است.'); });
  document.addEventListener('cut',  function (e) { e.preventDefault(); });
  // کشیدن تصویر
  document.addEventListener('dragstart', e => e.preventDefault());
  // کلیدهای میانبر
  document.addEventListener('keydown', function (e) {
    const k = (e.key || '').toLowerCase();
    // Ctrl/Cmd + C/X/S/P/U  و  F12  و  Ctrl+Shift+I/J/C
    if ((e.ctrlKey || e.metaKey) && ['c','x','s','p','u'].includes(k)) {
      // اجازه کپی داخل فیلد فرم
      const tag = (e.target.tagName || '').toLowerCase();
      if (k === 'c' && (tag === 'input' || tag === 'textarea')) return;
      e.preventDefault(); flash('این عملیات غیرفعال است.');
    }
    if (e.key === 'F12') { e.preventDefault(); flash('ابزار توسعه‌دهنده مسدود است.'); }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i','j','c'].includes(k)) {
      e.preventDefault(); flash('ابزار توسعه‌دهنده مسدود است.');
    }
  });
  // چاپ (CSS هم در print media صفحه را پنهان می‌کند)
  window.addEventListener('beforeprint', function () {
    document.body.style.visibility = 'hidden';
  });
  window.addEventListener('afterprint', function () {
    document.body.style.visibility = 'visible';
  });
})();
