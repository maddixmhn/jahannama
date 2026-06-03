<?php
declare(strict_types=1);
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/database.php';
admin_guard();

$docs = db_query(
    'SELECT d.id,d.original_name,d.mime_type,d.size_bytes,d.created_at,
            c.full_name,c.tracking_code,c.id AS cid
     FROM user_documents d
     LEFT JOIN consultations c ON c.id = d.consultation_id
     ORDER BY d.created_at DESC LIMIT 300'
)->fetchAll();

$adminTitle = 'مدارک کاربران'; $adminActive = 'docs';
require __DIR__ . '/_header.php';
?>
<table class="tbl">
  <thead><tr><th>فایل</th><th>متقاضی</th><th>کد پیگیری</th><th>حجم</th><th>تاریخ</th><th></th></tr></thead>
  <tbody>
    <?php if (!$docs): ?><tr><td colspan="6" style="color:var(--muted)">مدرکی آپلود نشده است.</td></tr>
    <?php else: foreach ($docs as $d): ?>
      <tr>
        <td><?= e($d['original_name']) ?></td>
        <td><?= e($d['full_name'] ?: '—') ?></td>
        <td><?= e($d['tracking_code'] ?: '—') ?></td>
        <td><?= round($d['size_bytes']/1024) ?>KB</td>
        <td><?= e($d['created_at']) ?></td>
        <td>
          <a class="a-link" href="/admin/download?id=<?= (int)$d['id'] ?>">دانلود</a>
          <?php if ($d['cid']): ?> · <a class="a-link" href="/admin/consultation_view?id=<?= (int)$d['cid'] ?>">پرونده</a><?php endif; ?>
        </td>
      </tr>
    <?php endforeach; endif; ?>
  </tbody>
</table>
<?php require __DIR__ . '/_footer.php'; ?>
