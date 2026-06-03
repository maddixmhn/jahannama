<?php
declare(strict_types=1);
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/database.php';
admin_guard();

$stats = [
    'new'    => (int)db_query("SELECT COUNT(*) FROM consultations WHERE status='new'")->fetchColumn(),
    'total'  => (int)db_query("SELECT COUNT(*) FROM consultations")->fetchColumn(),
    'docs'   => (int)db_query("SELECT COUNT(*) FROM user_documents")->fetchColumn(),
    'news'   => (int)db_query("SELECT COUNT(*) FROM news WHERE is_published=1")->fetchColumn(),
];
$recent = db_query(
    "SELECT id,full_name,phone,status,created_at FROM consultations ORDER BY created_at DESC LIMIT 8"
)->fetchAll();

$statusBadge = [
    'new'=>'<span class="badge badge-new">جدید</span>',
    'in_progress'=>'<span class="badge badge-prog">در حال بررسی</span>',
    'answered'=>'<span class="badge badge-ans">پاسخ داده شده</span>',
    'closed'=>'<span class="badge badge-closed">بسته شده</span>',
];

$adminTitle = 'داشبورد'; $adminActive = 'dash';
require __DIR__ . '/_header.php';
?>
<div class="stat-grid">
  <div class="stat-card"><div class="num"><?= $stats['new'] ?></div><div class="lbl">درخواست جدید</div></div>
  <div class="stat-card"><div class="num"><?= $stats['total'] ?></div><div class="lbl">کل درخواست‌ها</div></div>
  <div class="stat-card"><div class="num"><?= $stats['docs'] ?></div><div class="lbl">مدارک آپلودشده</div></div>
  <div class="stat-card"><div class="num"><?= $stats['news'] ?></div><div class="lbl">خبر منتشرشده</div></div>
</div>

<h2 style="margin-bottom:1rem;font-size:1.1rem">آخرین درخواست‌ها</h2>
<table class="tbl">
  <thead><tr><th>نام</th><th>واتساپ</th><th>وضعیت</th><th>تاریخ</th><th></th></tr></thead>
  <tbody>
    <?php if (!$recent): ?>
      <tr><td colspan="5" style="color:var(--muted)">هنوز درخواستی ثبت نشده است.</td></tr>
    <?php else: foreach ($recent as $r): ?>
      <tr>
        <td><?= e($r['full_name']) ?></td>
        <td><?= e($r['phone']) ?></td>
        <td><?= $statusBadge[$r['status']] ?? '' ?></td>
        <td><?= e($r['created_at']) ?></td>
        <td><a class="a-link" href="/admin/consultation_view?id=<?= (int)$r['id'] ?>">مشاهده</a></td>
      </tr>
    <?php endforeach; endif; ?>
  </tbody>
</table>
<?php require __DIR__ . '/_footer.php'; ?>
