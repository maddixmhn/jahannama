<?php
declare(strict_types=1);
require_once __DIR__ . '/../includes/security.php';
require_once __DIR__ . '/../config/contact.php';

$pageTitle = 'ماشین‌حساب مهاجرت | پناه‌یار';
$pageDesc  = 'ارزیابی اولیه مهاجرت و پناهندگی بدون ذخیره اطلاعات شخصی. سن، زبان، تحصیلات، خانواده و وضعیت ویژه.';
$activeNav = 'calc';
require __DIR__ . '/../includes/header.php';
?>

<section class="map-section">
  <h1 class="section-title">ماشین‌حساب مهاجرت</h1>

  <div class="expertise-box">
    <span class="ic">🔒</span>
    <div>
      <strong style="color:var(--gold)">بدون ذخیره اطلاعات.</strong>
      هیچ نام، کوکی یا اطلاعات شخصی ذخیره نمی‌شود. همه محاسبات در مرورگر شما انجام می‌شود.
      <br><?= e(EXPERTISE_STATEMENT) ?>
    </div>
  </div>

  <div class="form-card" id="calc-app" style="max-width:760px">
    <!-- نوار پیشرفت -->
    <div class="calc-progress"><div class="calc-progress-bar" id="calc-bar"></div></div>
    <div id="calc-steps"></div>
    <div class="calc-nav">
      <button class="btn btn-ghost" id="calc-prev" type="button">قبلی</button>
      <button class="btn btn-gold" id="calc-next" type="button">بعدی</button>
    </div>
    <div id="calc-result" style="display:none"></div>
  </div>
</section>

<script src="/assets/js/calculator.js"></script>
<?php require __DIR__ . '/../includes/footer.php'; ?>
