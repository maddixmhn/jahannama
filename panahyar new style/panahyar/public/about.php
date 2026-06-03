<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/security.php';
require_once __DIR__ . '/../config/contact.php';

$about = db_query('SELECT title,body,photo_path FROM about_page ORDER BY id LIMIT 1')->fetch();
$lawyers = db_query('SELECT full_name,country_iso2,city,specialty,bio,photo_path FROM lawyers WHERE is_active=1 ORDER BY country_iso2')->fetchAll();

$pageTitle = 'درباره ما | پناه‌یار';
$activeNav = 'about';
require __DIR__ . '/../includes/header.php';
?>
<section class="map-section">
  <h1 class="section-title">درباره ما</h1>

  <div class="feature" style="display:flex;gap:1.5rem;flex-wrap:wrap;align-items:flex-start">
    <?php if (!empty($about['photo_path'])): ?>
      <img src="<?= e(UPLOAD_URL.'/'.$about['photo_path']) ?>" alt="<?= e(EXPERT_NAME) ?>"
           style="width:160px;border-radius:12px;border:2px solid var(--gold)">
    <?php endif; ?>
    <div style="flex:1;min-width:240px">
      <h2 style="color:var(--gold)"><?= e($about['title'] ?? 'کامیار دادبین') ?></h2>
      <p style="color:var(--gold-soft)">متخصص امور پناهندگی ایرانیان در سراسر جهان</p>
      <div style="margin-top:1rem"><?= nl2br(e($about['body'] ?? '')) ?></div>
      <p style="margin-top:1rem">
        <a class="btn btn-gold" href="<?= e(WHATSAPP_LINK) ?>" target="_blank" rel="noopener">واتساپ: <?= e(WHATSAPP_DISPLAY) ?></a>
        <a class="btn btn-ghost" href="<?= e(INSTAGRAM_LINK) ?>" target="_blank" rel="noopener">اینستاگرام @<?= e(INSTAGRAM_HANDLE) ?></a>
      </p>
    </div>
  </div>

  <?php if ($lawyers): ?>
    <h2 class="section-title">وکلای همکار</h2>
    <div class="features">
      <?php foreach ($lawyers as $l): ?>
        <div class="feature">
          <h4><?= e($l['full_name']) ?></h4>
          <p style="color:var(--gold-soft)"><?= e($l['country_iso2']) ?><?= $l['city']?' — '.e($l['city']):'' ?></p>
          <?php if ($l['specialty']): ?><p><?= e($l['specialty']) ?></p><?php endif; ?>
          <?php if ($l['bio']): ?><p style="color:var(--muted);font-size:.9rem"><?= e($l['bio']) ?></p><?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</section>
<?php require __DIR__ . '/../includes/footer.php'; ?>
