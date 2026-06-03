<?php
/**
 * هدر مشترک پنل مدیریت
 * فایل‌های پنل قبل از include باید admin_guard() را صدا زده باشند.
 */
require_once __DIR__ . '/../../includes/security.php';
require_once __DIR__ . '/../../includes/auth.php';
send_security_headers();

$admin = current_admin();
$adminTitle = $adminTitle ?? 'پنل مدیریت';
$adminActive = $adminActive ?? '';
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title><?= e($adminTitle) ?> | پناه‌یار</title>
<link rel="stylesheet" href="/assets/css/admin.css">
</head>
<body>
<div class="admin-shell">
  <aside class="admin-sidebar">
    <div class="admin-brand">پناه<b>‌یار</b><small>پنل مدیریت</small></div>
    <nav>
      <a href="/admin/index"        class="<?= $adminActive==='dash'?'active':'' ?>">📊 داشبورد</a>
      <a href="/admin/consultations" class="<?= $adminActive==='cons'?'active':'' ?>">📨 درخواست‌ها</a>
      <a href="/admin/certificates" class="<?= $adminActive==='cert'?'active':'' ?>">📜 گواهی‌ها</a>
      <a href="/admin/documents"    class="<?= $adminActive==='docs'?'active':'' ?>">📎 مدارک کاربران</a>
      <a href="/admin/lawyers"      class="<?= $adminActive==='law'?'active':'' ?>">⚖️ وکلا</a>
      <a href="/admin/news"         class="<?= $adminActive==='news'?'active':'' ?>">📰 اخبار</a>
      <a href="/admin/laws"         class="<?= $adminActive==='laws'?'active':'' ?>">📚 قوانین</a>
      <a href="/admin/about"        class="<?= $adminActive==='about'?'active':'' ?>">👤 درباره ما</a>
      <a href="/admin/prices"       class="<?= $adminActive==='price'?'active':'' ?>">💰 تعرفه‌ها</a>
    </nav>
    <div class="admin-foot">
      <span><?= e($admin['full_name'] ?? '') ?></span>
      <a href="/admin/logout" class="logout">خروج</a>
    </div>
  </aside>
  <main class="admin-main">
    <header class="admin-topbar"><h1><?= e($adminTitle) ?></h1></header>
    <div class="admin-content">
