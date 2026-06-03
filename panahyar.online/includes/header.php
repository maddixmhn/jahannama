<?php
/**
 * هدر مشترک
 * متغیرها قبل از include قابل تنظیم: $pageTitle, $pageDesc, $activeNav
 */
require_once __DIR__ . '/security.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/contact.php';
send_security_headers();
secure_session_start();

$pageTitle = $pageTitle ?? 'پناه‌یار | دانشنامه تخصصی پناهندگی ایرانیان';
$pageDesc  = $pageDesc  ?? 'دانشنامه پناهندگی، ماشین‌حساب مهاجرت، شرایط کشورها و مشاوره تخصصی برای ایرانیان.';
$activeNav = $activeNav ?? '';
$canonical = BASE_URL . ($_SERVER['REQUEST_URI'] ?? '/');
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($pageTitle) ?></title>
<meta name="description" content="<?= e($pageDesc) ?>">
<link rel="canonical" href="<?= e($canonical) ?>">
<meta name="robots" content="index,follow">
<!-- Open Graph / SEO -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="<?= e(SITE_NAME) ?>">
<meta property="og:title" content="<?= e($pageTitle) ?>">
<meta property="og:description" content="<?= e($pageDesc) ?>">
<meta property="og:url" content="<?= e($canonical) ?>">
<meta property="og:locale" content="fa_IR">
<meta name="twitter:card" content="summary_large_image">
<!-- داده ساختاری -->
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"<?= e(SITE_NAME) ?>",
 "url":"<?= e(BASE_URL) ?>","inLanguage":"fa-IR"}
</script>
<link rel="stylesheet" href="/assets/css/style.css">
<style>
/* محافظت چاپ: هنگام پرینت محتوا پنهان می‌شود */
@media print{ body *{visibility:hidden !important} body::after{
  content:"چاپ این صفحه مجاز نیست — محتوای محافظت‌شده پناه‌یار";
  visibility:visible;position:fixed;top:40%;right:0;left:0;text-align:center;font-size:20px} }
</style>
</head>
<body>
<div class="parallax-bg"></div>
<div class="parallax-stars"></div>

<?php
// نوار اعلان اضطراری (در صورت وجود اعلان فعال از دیتابیس)
$emergency = null;
try {
    $emergency = db_query(
        "SELECT title FROM news WHERE is_published=1 AND title LIKE '%هشدار فوری%'
         ORDER BY published_at DESC LIMIT 1"
    )->fetchColumn();
} catch (Throwable $e) { /* در صورت نبود اتصال، نادیده */ }
?>
<?php if ($emergency): ?>
<div class="emergency-bar"><span>⚠️ <?= e($emergency) ?></span></div>
<?php endif; ?>

<header class="site-header">
  <div class="nav-wrap">
    <a class="brand" href="/">
      <!-- لوگو: سپر + کتاب + شاخه زیتون -->
      <svg class="logo" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="لوگوی پناه‌یار">
        <path d="M32 4 56 12V30C56 46 45 56 32 60 19 56 8 46 8 30V12L32 4Z" fill="#11294a" stroke="#c9a24b" stroke-width="2.5"/>
        <rect x="22" y="24" width="20" height="15" rx="1.5" fill="#f4efe3"/>
        <line x1="32" y1="24" x2="32" y2="39" stroke="#9c7a2e" stroke-width="1.4"/>
        <path d="M18 44c4-3 8-2 10 1M46 44c-4-3-8-2-10 1" stroke="#c9a24b" stroke-width="2" stroke-linecap="round"/>
        <circle cx="20" cy="42" r="1.6" fill="#c9a24b"/><circle cx="44" cy="42" r="1.6" fill="#c9a24b"/>
      </svg>
      <span>پناه<b>‌یار</b></span>
    </a>

    <ul class="nav-links">
      <li><a href="/" class="<?= $activeNav==='home'?'active':'' ?>">خانه</a></li>
      <li><a href="/laws" class="<?= $activeNav==='laws'?'active':'' ?>">قوانین</a></li>
      <li><a href="/calculator" class="<?= $activeNav==='calc'?'active':'' ?>">ماشین‌حساب مهاجرت</a></li>
      <li><a href="/news" class="<?= $activeNav==='news'?'active':'' ?>">اخبار</a></li>
      <li><a href="/pricing" class="<?= $activeNav==='price'?'active':'' ?>">تعرفه</a></li>
      <li><a href="/certificates" class="<?= $activeNav==='cert'?'active':'' ?>">گواهی‌ها</a></li>
      <li><a href="/about" class="<?= $activeNav==='about'?'active':'' ?>">درباره ما</a></li>
      <li><a href="/consult" class="nav-cta">درخواست مشاوره</a></li>
    </ul>
    <button class="menu-toggle" aria-label="منو">☰</button>
  </div>
</header>

<main>
