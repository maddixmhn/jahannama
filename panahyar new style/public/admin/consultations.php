<?php
declare(strict_types=1);
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/database.php';
admin_guard();

$status = clean($_GET['status'] ?? '');
$q      = clean($_GET['q'] ?? '');

$sql = "SELECT id,full_name,phone,country_iso2,status,created_at FROM consultations WHERE 1=1";
$params = [];
if (in_array($status, ['new','in_progress','answered','closed'], true)) {
    $sql .= " AND status = ?"; $params[] = $status;
}
if ($q !== '') {
    $sql .= " AND (full_name LIKE ? OR phone LIKE ? OR tracking_code = ?)";
    $params[] = "%$q%"; $params[] = "%$q%"; $params[] = $q;
}
$sql .= " ORDER BY created_at DESC LIMIT 200";
$rows = db_query($sql, $params)->fetchAll();

$statusBadge = [
    'new'=>'<span class="badge badge-new">جدید</span>',
    'in_progress'=>'<span class="badge badge-prog">در حال بررسی</span>',
    'answered'=>'<span class="badge badge-ans">پاسخ داده شده</span>',
    'closed'=>'<span class="badge badge-closed">بسته شده</span>',
];

$adminTitle = 'درخواست‌های مشاوره'; $adminActive = 'cons';
require __DIR__ . '/_header.php';
?>
<form method="get" style="display:flex;gap:.7rem;flex-wrap:wrap;margin-bottom:1.2rem">
  <select name="status" class="a-field" style="margin:0;max-width:180px">
    <option value="">همه وضعیت‌ها</option>
    <option value="new"        <?= $status==='new'?'selected':'' ?>>جدید</option>
    <option value="in_progress"<?= $status==='in_progress'?'selected':'' ?>>در حال بررسی</option>
    <option value="answered"   <?= $status==='answered'?'selected':'' ?>>پاسخ داده شده</option>
    <option value="closed"     <?= $status==='closed'?'selected':'' ?>>بسته شده</option>
  </select>
  <input type="text" name="q" class="a-field" style="margin:0;max-width:220px" placeholder="نام، واتساپ یا کد پیگیری" value="<?= e($q) ?>">
  <button class="a-btn" type="submit">فیلتر</button>
</form>

<table class="tbl">
  <thead><tr><th>نام</th><th>واتساپ</th><th>کشور</th><th>وضعیت</th><th>تاریخ</th><th></th></tr></thead>
  <tbody>
    <?php if (!$rows): ?>
      <tr><td colspan="6" style="color:var(--muted)">موردی یافت نشد.</td></tr>
    <?php else: foreach ($rows as $r): ?>
      <tr>
        <td><?= e($r['full_name']) ?></td>
        <td><?= e($r['phone']) ?></td>
        <td><?= e($r['country_iso2'] ?: '—') ?></td>
        <td><?= $statusBadge[$r['status']] ?? '' ?></td>
        <td><?= e($r['created_at']) ?></td>
        <td><a class="a-link" href="/admin/consultation_view?id=<?= (int)$r['id'] ?>">مشاهده ›</a></td>
      </tr>
    <?php endforeach; endif; ?>
  </tbody>
</table>
<?php require __DIR__ . '/_footer.php'; ?>
