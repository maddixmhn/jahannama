<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/security.php';

$pageTitle = 'پناه‌یار | دانشنامه تخصصی پناهندگی ایرانیان';
$activeNav = 'home';

// کشورهای منتشرشده برای نقشه
$countries = db_query(
    'SELECT iso2,name_fa,continent,flag_emoji,asylum_summary,humanitarian,official_url,form_name,form_url
     FROM countries WHERE is_published = 1 ORDER BY name_fa'
)->fetchAll();

$continents = [
    'all' => 'همه', 'asia' => 'آسیا', 'europe' => 'اروپا',
    'north_america' => 'آمریکای شمالی', 'south_america' => 'آمریکای جنوبی',
    'africa' => 'آفریقا', 'oceania' => 'اقیانوسیه',
];

require __DIR__ . '/../includes/header.php';
?>

<section class="hero">
  <h1>راهنمای امن شما در مسیر <span>پناهندگی</span></h1>
  <p>دانشنامه تخصصی، ماشین‌حساب مهاجرت و مشاوره — با ارجاع به منابع رسمی بین‌المللی. روی پرچم هر کشور کلیک کنید تا شرایط پناهندگی و ویزای بشردوستانه آن را ببینید.</p>
  <div class="hero-actions">
    <a href="/calculator" class="btn btn-gold">شروع ارزیابی رایگان</a>
    <a href="/consult" class="btn btn-ghost">درخواست مشاوره</a>
  </div>
</section>

<section class="map-section">
  <h2 class="section-title">نقشه تعاملی کشورها</h2>

  <div class="continent-tabs">
    <?php foreach ($continents as $key => $label): ?>
      <button data-continent="<?= e($key) ?>" class="<?= $key==='all'?'active':'' ?>"><?= e($label) ?></button>
    <?php endforeach; ?>
  </div>

  <div class="flags-grid">
    <?php foreach ($countries as $c): ?>
      <div class="flag-card"
           data-continent="<?= e($c['continent']) ?>"
           data-name="<?= e($c['name_fa']) ?>"
           data-flag="<?= e($c['flag_emoji']) ?>"
           data-asylum="<?= e($c['asylum_summary']) ?>"
           data-human="<?= e($c['humanitarian']) ?>"
           data-form-name="<?= e($c['form_name']) ?>"
           data-form-url="<?= e($c['form_url']) ?>"
           data-url="<?= e($c['official_url']) ?>">
        <div class="flag"><?= e($c['flag_emoji'] ?: '🏳️') ?></div>
        <div class="name"><?= e($c['name_fa']) ?></div>
      </div>
    <?php endforeach; ?>
  </div>
</section>

<!-- مودال کشور -->
<div class="modal" id="country-modal" role="dialog" aria-modal="true">
  <div class="modal-box">
    <button class="modal-close" aria-label="بستن">×</button>
    <h3><span id="m-flag">🏳️</span> <span id="m-name"></span></h3>
    <div class="row"><span class="label">شرایط پناهندگی</span><div id="m-asylum"></div></div>
    <div class="row"><span class="label">ویزای بشردوستانه</span><div id="m-human"></div></div>
    <div class="row"><span class="label">فرم رسمی</span><div id="m-form"></div></div>
    <div class="row"><span class="label">منبع</span><div id="m-source"></div></div>
  </div>
</div>

<section class="features">
  <div class="feature"><h4>📚 دانشنامه قوانین</h4><p>کنوانسیون‌ها و قوانین بین‌المللی پناهندگی با لینک به منابع رسمی.</p></div>
  <div class="feature"><h4>🧮 ماشین‌حساب مهاجرت</h4><p>ارزیابی شانس مهاجرت بدون ذخیره اطلاعات شخصی شما.</p></div>
  <div class="feature"><h4>⚖️ وکلای همکار</h4><p>دسترسی به وکلای متخصص بر اساس کشور مقصد.</p></div>
  <div class="feature"><h4>🔒 آپلود امن مدارک</h4><p>ارسال امن مدارک همراه درخواست مشاوره.</p></div>
</section>

<?php require __DIR__ . '/../includes/footer.php'; ?>
