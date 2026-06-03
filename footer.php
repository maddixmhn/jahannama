<?php require_once __DIR__ . '/../config/contact.php'; ?>
</main>

<!-- اعلان محافظت کپی -->
<div class="copy-warning" id="copy-warning"></div>

<!-- دکمه شناور واتساپ (دسکتاپ) -->
<a class="wa-float" href="<?= e(WHATSAPP_LINK) ?>?text=<?= rawurlencode('سلام، برای مشاوره پناهندگی راهنمایی می‌خواهم.') ?>"
   target="_blank" rel="noopener" aria-label="واتساپ">
  <span class="wa-ic">🟢</span> مشاوره واتساپ
</a>

<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <strong>پناه‌یار</strong>
      <p>دانشنامه تخصصی پناهندگی ایرانیان | مرجع قوانین، مسیرها و ویزای بشردوستانه</p>
    </div>
    <div>
      <strong>تماس</strong>
      <p><a href="<?= e(WHATSAPP_LINK) ?>" target="_blank" rel="noopener">واتساپ: <?= e(WHATSAPP_DISPLAY) ?></a></p>
      <p><a href="<?= e(INSTAGRAM_LINK) ?>" target="_blank" rel="noopener">اینستاگرام: @<?= e(INSTAGRAM_HANDLE) ?></a></p>
    </div>
    <div>
      <strong>دسترسی سریع</strong>
      <p><a href="/laws">قوانین</a> · <a href="/calculator">ماشین‌حساب</a> · <a href="/about">درباره ما</a></p>
    </div>
  </div>

  <div>© <?= date('Y') ?> پناه‌یار — <?= e(SITE_DOMAIN) ?></div>
  <p class="disclaimer">
    تمامی محتوای این وبسایت صرفاً جنبه اطلاع‌رسانی دارد و جایگزین مشاوره حقوقی اختصاصی با وکیل پناهندگی
    در کشور مقصد نیست. تیم پناه‌یار هیچ مسئولیتی در قبال تصمیمات کاربران بر اساس این اطلاعات ندارد.
    برای فرم‌ها و قوانین رسمی همواره به منابع رسمی هر کشور (مانند UNHCR و نهادهای دولتی) مراجعه کنید.
    موفقیت پناهندگی ۱۰۰٪ تضمین نمی‌شود.
  </p>
</footer>

<!-- منوی موبایل چسبیده به پایین -->
<nav class="mobile-bottom-nav" aria-label="منوی موبایل">
  <a href="/"><span class="ic">🏠</span>خانه</a>
  <a href="/laws"><span class="ic">📚</span>دانشنامه</a>
  <a href="/calculator"><span class="ic">🧮</span>ماشین‌حساب</a>
  <a href="/consult"><span class="ic">📞</span>مشاوره</a>
</nav>

<script src="/assets/js/main.js"></script>
</body>
</html>
