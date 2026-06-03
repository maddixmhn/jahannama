<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/security.php';

$laws = db_query(
    'SELECT scope,country_iso2,title,body,source_name,source_url,updated_at
     FROM laws WHERE is_published=1 ORDER BY scope, title'
)->fetchAll();

$pageTitle = 'قوانین پناهندگی | پناه‌یار';
$pageDesc  = 'دانشنامه قوانین بین‌المللی و کشوری پناهندگی، کنوانسیون ۱۹۵۱ و پروتکل ۱۹۶۷، با ارجاع به منابع رسمی.';
$activeNav = 'laws';
require __DIR__ . '/../includes/header.php';
?>
<section class="map-section">
  <h1 class="section-title">دانشنامه قوانین پناهندگی</h1>
  <p style="color:var(--muted);max-width:760px">قوانین بین‌المللی و کشوری با ارجاع به منابع رسمی. هر مقاله دارای تاریخ بازبینی و لینک منبع است.</p>

  <?php if (!$laws): ?>
    <div class="alert alert-ok" style="margin-top:1.5rem">
      محتوای قوانین از پنل مدیریت اضافه می‌شود. تا آن زمان، منابع رسمی معتبر:
      <ul style="margin-top:.6rem">
        <li><a href="https://www.unhcr.org/1951-refugee-convention.html" target="_blank" rel="noopener">کنوانسیون ۱۹۵۱ پناهندگان (UNHCR) ↗</a></li>
        <li><a href="https://www.unhcr.org/" target="_blank" rel="noopener">کمیساریای عالی پناهندگان سازمان ملل ↗</a></li>
        <li><a href="https://euaa.europa.eu/" target="_blank" rel="noopener">آژانس پناهندگی اتحادیه اروپا (EUAA) ↗</a></li>
      </ul>
    </div>
  <?php else: ?>
    <?php
    $intl = array_filter($laws, fn($l)=>$l['scope']==='international');
    $ctry = array_filter($laws, fn($l)=>$l['scope']==='country');
    ?>
    <?php if ($intl): ?><h2 class="section-title">قوانین بین‌المللی</h2><?php endif; ?>
    <?php foreach ($intl as $l): ?>
      <article class="feature" style="margin-bottom:1rem">
        <h4><?= e($l['title']) ?></h4>
        <p><?= nl2br(e(mb_substr((string)$l['body'],0,600))) ?><?= mb_strlen((string)$l['body'])>600?'…':'' ?></p>
        <?php if ($l['source_url']): ?><p><a href="<?= e($l['source_url']) ?>" target="_blank" rel="noopener">منبع: <?= e($l['source_name'] ?: 'لینک رسمی') ?> ↗</a></p><?php endif; ?>
        <small style="color:var(--muted)">آخرین بازبینی: <?= e($l['updated_at']) ?></small>
      </article>
    <?php endforeach; ?>

    <?php if ($ctry): ?><h2 class="section-title">قوانین کشوری</h2><?php endif; ?>
    <?php foreach ($ctry as $l): ?>
      <article class="feature" style="margin-bottom:1rem">
        <h4><?= e($l['title']) ?> <small style="color:var(--muted)">(<?= e($l['country_iso2']) ?>)</small></h4>
        <p><?= nl2br(e(mb_substr((string)$l['body'],0,600))) ?></p>
        <?php if ($l['source_url']): ?><p><a href="<?= e($l['source_url']) ?>" target="_blank" rel="noopener">منبع رسمی ↗</a></p><?php endif; ?>
      </article>
    <?php endforeach; ?>
  <?php endif; ?>
</section>
<?php require __DIR__ . '/../includes/footer.php'; ?>
