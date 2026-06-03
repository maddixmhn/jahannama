<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/security.php';

$news = db_query(
    'SELECT title,summary,source_name,source_url,published_at
     FROM news WHERE is_published=1 ORDER BY COALESCE(published_at,created_at) DESC LIMIT 50'
)->fetchAll();

$pageTitle = 'اخبار پناهندگی | پناه‌یار';
$pageDesc  = 'آخرین اخبار پناهندگی و مهاجرت به زبان فارسی، با درج منبع اصلی.';
$activeNav = 'news';
require __DIR__ . '/../includes/header.php';
?>
<section class="map-section">
  <h1 class="section-title">📰 آخرین اخبار پناهندگی</h1>

  <?php if (!$news): ?>
    <div class="alert alert-ok" style="margin-top:1rem">
      اخبار از منابع معتبر فارسی‌زبان (رادیو فردا، دویچه‌وله فارسی، بی‌بی‌سی فارسی، یورونیوز فارسی)
      پس از بازبینی توسط تیم منتشر می‌شوند.
    </div>
  <?php else: ?>
    <?php foreach ($news as $n): ?>
      <article class="feature" style="margin-bottom:1rem">
        <h4>🔹 <?= e($n['title']) ?></h4>
        <?php if ($n['summary']): ?><p><?= e($n['summary']) ?></p><?php endif; ?>
        <small style="color:var(--muted)">
          📅 <?= e($n['published_at']) ?>
          <?php if ($n['source_name']): ?> | منبع: <?= e($n['source_name']) ?><?php endif; ?>
        </small>
        <?php if ($n['source_url']): ?>
          <p><a href="<?= e($n['source_url']) ?>" target="_blank" rel="noopener">🔗 مشاهده متن کامل در منبع اصلی ↗</a></p>
        <?php endif; ?>
      </article>
    <?php endforeach; ?>
  <?php endif; ?>

  <p class="disclaimer">هر خبر از منبع ذکرشده گرفته شده است. پناه‌یار مسئولیتی در قبال صحت محتوای منابع خارجی ندارد.</p>
</section>
<?php require __DIR__ . '/../includes/footer.php'; ?>
