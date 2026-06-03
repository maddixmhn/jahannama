<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/security.php';
require_once __DIR__ . '/../config/contact.php';

$prices = db_query('SELECT service_key,label,base_price FROM service_prices WHERE is_active=1 ORDER BY id')->fetchAll();

$tiers = [
    'بسته‌های مشاوره'         => ['consult_30','consult_60','consult_3x3','consult_family'],
    'تنظیم و تکمیل پرونده'    => ['statement','forms','religion_case','lgbtq_case','political_case','medical_case','appeal','golden_package'],
    'ویزای بشردوستانه'        => ['humanitarian_reg','humanitarian_de','humanitarian_ca','humanitarian_br'],
    'خانواده و بازپیوند'      => ['family_reunion','family_extra','consult_family','guardianship'],
    'خدمات VIP'               => ['vip_monthly'],
    'آموزش و دوره‌ها'         => ['train_interview','train_forms','train_full'],
    'خدمات جانبی'            => ['doc_review','translation','wa_followup'],
];
$byKey = [];
foreach ($prices as $p) $byKey[$p['service_key']] = $p;

$pageTitle = 'تعرفه خدمات | پناه‌یار';
$pageDesc  = 'تعرفه شفاف خدمات پناهندگی: مشاوره، تنظیم اظهارنامه، ویزای بشردوستانه. هماهنگی پرداخت از طریق واتساپ.';
$activeNav = 'price';
require __DIR__ . '/../includes/header.php';
?>
<section class="map-section">
  <h1 class="section-title">💰 تعرفه خدمات پناه‌یار</h1>

  <div class="expertise-box">
    <span class="ic">🔒</span>
    <div>
      شفاف، منصفانه، بدون هزینه پنهان. قیمت‌ها به یورو است. <strong style="color:var(--gold)">نحوه پرداخت از طریق واتساپ هماهنگ می‌شود.</strong>
      <br><?= e(EXPERTISE_STATEMENT) ?>
    </div>
  </div>

  <div class="feature" style="border-color:var(--gold);margin-bottom:1.5rem">
    <h4>🆓 سطح رایگان</h4>
    <p>دانشنامه، ماشین‌حساب مهاجرت، اخبار، و بررسی اولیه ۲ سوالی در واتساپ — بدون هزینه و بدون ثبت‌نام.</p>
  </div>

  <?php foreach ($tiers as $tierName => $keys): ?>
    <h2 class="section-title"><?= e($tierName) ?></h2>
    <table class="price-table">
      <tbody>
      <?php foreach ($keys as $k): if (!isset($byKey[$k])) continue; $p = $byKey[$k]; $eur=(float)$p['base_price']; $usd=round($eur*1.08); ?>
        <tr>
          <td class="pt-label"><?= e($p['label']) ?></td>
          <td class="pt-price"><?= number_format($eur) ?> € / <?= number_format($usd) ?> $<?= $k==='vip_monthly'?' در ماه':'' ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  <?php endforeach; ?>

  <h2 class="section-title">🧮 ماشین‌حساب هزینه</h2>
  <div class="form-card" style="max-width:720px">
    <p style="color:var(--muted);margin-bottom:1rem">خدمات موردنظر را انتخاب کنید تا برآورد هزینه را ببینید. سپس برای هماهنگی پرداخت با واتساپ تماس بگیرید.</p>
    <div class="opts" id="services">
      <?php foreach ($prices as $p): ?>
        <label class="opt">
          <input type="checkbox" class="svc" value="<?= (int)((float)$p['base_price']*100) ?>" data-label="<?= e($p['label']) ?>">
          <span style="flex:1"><?= e($p['label']) ?></span>
          <b style="color:var(--gold-soft)"><?= number_format((float)$p['base_price']) ?> €</b>
        </label>
      <?php endforeach; ?>
    </div>

    <h3 style="color:var(--gold);margin:1.4rem 0 1rem">تخفیف‌های قابل اعمال</h3>
    <p style="color:var(--muted);font-size:.85rem;margin-bottom:.8rem">توجه: تخفیف‌ها روی هم اعمال نمی‌شوند؛ بیشترین تخفیف لحاظ می‌شود.</p>
    <div class="opts" id="discounts">
      <label class="opt"><input type="radio" name="disc" class="disc" value="0" checked><span style="flex:1">بدون تخفیف</span></label>
      <label class="opt"><input type="radio" name="disc" class="disc" value="15"><span style="flex:1">خانواده (همسر + ۲ فرزند یا بیشتر)</span><b style="color:#7fd99a">−۱۵٪</b></label>
      <label class="opt"><input type="radio" name="disc" class="disc" value="10"><span style="flex:1">پرداخت یکجای پکیج طلایی</span><b style="color:#7fd99a">−۱۰٪</b></label>
      <label class="opt"><input type="radio" name="disc" class="disc" value="20"><span style="flex:1">سازمان غیرانتفاعی همکار (با معرفی‌نامه)</span><b style="color:#7fd99a">−۲۰٪</b></label>
      <label class="opt"><input type="radio" name="disc" class="disc" value="20"><span style="flex:1">دانشجو (با کارت دانشجویی معتبر)</span><b style="color:#7fd99a">−۲۰٪</b></label>
      <label class="opt"><input type="radio" name="disc" class="disc" value="50"><span style="flex:1">زندانی سیاسی سابق (با مدرک)</span><b style="color:#7fd99a">−۵۰٪</b></label>
    </div>

    <h3 style="color:var(--gold);margin:1.4rem 0 1rem">فوریت در انجام</h3>
    <div class="opts" id="urgency">
      <label class="opt"><input type="radio" name="urg" class="urg" value="0" checked><span style="flex:1">عادی (۳۰ روز)</span></label>
      <label class="opt"><input type="radio" name="urg" class="urg" value="20"><span style="flex:1">فوری (۱۵ روز)</span><b style="color:#f0c674">+۲۰٪</b></label>
      <label class="opt"><input type="radio" name="urg" class="urg" value="50"><span style="flex:1">فوق‌العاده فوری (۷ روز)</span><b style="color:#f0c674">+۵۰٪</b></label>
    </div>

    <div class="result-card" id="tariff-result" style="margin-top:1.5rem">
      <p style="display:flex;justify-content:space-between"><span>جمع خدمات:</span> <b id="t-sub">۰ €</b></p>
      <p style="display:flex;justify-content:space-between"><span>تخفیف:</span> <b id="t-disc" style="color:#7fd99a">۰ €</b></p>
      <p style="display:flex;justify-content:space-between"><span>هزینه فوریت:</span> <b id="t-urg" style="color:#f0c674">۰ €</b></p>
      <hr style="border-color:var(--line);margin:.6rem 0">
      <p style="display:flex;justify-content:space-between;font-size:1.25rem">
        <span>هزینه نهایی تقریبی:</span> <b id="t-total" style="color:var(--gold)">۰ €</b></p>
      <p style="display:flex;justify-content:space-between;color:var(--muted);font-size:.9rem">
        <span>معادل دلار:</span> <span id="t-usd">۰ $</span></p>
    </div>

    <a class="btn btn-gold" id="wa-coordinate" style="margin-top:1.2rem"
       href="<?= e(WHATSAPP_LINK) ?>" target="_blank" rel="noopener">هماهنگی پرداخت در واتساپ</a>
    <a href="/consult" class="btn btn-ghost" style="margin-top:1.2rem">مشاوره قبل از پرداخت</a>

    <p class="disclaimer" style="margin-top:1.5rem">
      ساختار پرداخت بسته‌های بزرگ: تا ۵۰۰ یورو نقدی؛ ۵۰۰ تا ۱۰۰۰ یورو با ۵۰٪ پیش‌پرداخت و ۲ قسط؛
      بالاتر با پیش‌پرداخت و اقساط بیشتر. جزئیات و روش پرداخت هنگام هماهنگی واتساپ اعلام می‌شود.
      موفقیت پناهندگی ۱۰۰٪ تضمین نمی‌شود.
    </p>
  </div>
</section>

<script>
(function(){
  var svcs = document.querySelectorAll('.svc');
  var discs = document.querySelectorAll('.disc');
  var urgs = document.querySelectorAll('.urg');
  var waBtn = document.getElementById('wa-coordinate');
  var waBase = <?= json_encode(WHATSAPP_LINK) ?>;
  var RATE = 1.08; // EUR → USD
  function fmt(n){ return new Intl.NumberFormat('fa-IR').format(Math.round(n)); }
  function calc(){
    var sub = 0, picked = [];
    svcs.forEach(function(s){ if(s.checked){ sub += (+s.value)/100; picked.push(s.dataset.label); } });
    var pct = 0;
    discs.forEach(function(d){ if(d.checked) pct = +d.value; });
    var urg = 0;
    urgs.forEach(function(u){ if(u.checked) urg = +u.value; });
    var discAmt = sub * pct/100;
    var afterDisc = sub - discAmt;
    var urgAmt = afterDisc * urg/100;
    var total = afterDisc + urgAmt;
    document.getElementById('t-sub').textContent = fmt(sub) + ' €';
    document.getElementById('t-disc').textContent = '−' + fmt(discAmt) + ' €';
    document.getElementById('t-urg').textContent = '+' + fmt(urgAmt) + ' €';
    document.getElementById('t-total').textContent = fmt(total) + ' €';
    document.getElementById('t-usd').textContent = fmt(total * RATE) + ' $';
    var msg = 'سلام، برای هماهنگی پرداخت خدمات زیر آماده‌ام:\n';
    msg += picked.length ? picked.join('\n') : '(هنوز خدمتی انتخاب نشده)';
    msg += '\nهزینه تقریبی: ' + fmt(total) + ' یورو (' + fmt(total*RATE) + ' دلار)';
    waBtn.href = waBase + '?text=' + encodeURIComponent(msg);
  }
  svcs.forEach(s=>s.addEventListener('change',calc));
  discs.forEach(d=>d.addEventListener('change',calc));
  urgs.forEach(u=>u.addEventListener('change',calc));
  calc();
})();
</script>
<?php require __DIR__ . '/../includes/footer.php'; ?>
