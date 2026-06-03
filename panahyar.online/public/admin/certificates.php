<?php
declare(strict_types=1);
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../includes/upload.php';
admin_guard();

$flash = null; $err = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $action = $_POST['action'] ?? '';
    if ($action === 'add') {
        $title = clean($_POST['title'] ?? '');
        $desc  = clean($_POST['description'] ?? '');
        if ($title === '' || empty($_FILES['file']['name'])) {
            $err = 'عنوان و فایل الزامی است.';
        } else {
            $up = handle_upload($_FILES['file'], 'certs');
            if (!$up['ok']) $err = $up['error'];
            else {
                db_query('INSERT INTO certificates (title,description,file_path) VALUES (?,?,?)',
                    [$title, $desc, $up['stored']]);
                $flash = 'گواهی افزوده شد.';
            }
        }
    } elseif ($action === 'delete') {
        $cid = (int)($_POST['id'] ?? 0);
        $f = db_query('SELECT file_path FROM certificates WHERE id=?', [$cid])->fetchColumn();
        if ($f) { @unlink(UPLOAD_PATH.'/'.$f); }
        db_query('DELETE FROM certificates WHERE id=?', [$cid]);
        $flash = 'گواهی حذف شد.';
    }
}

$certs = db_query('SELECT id,title,description,file_path,created_at FROM certificates ORDER BY sort_order,id')->fetchAll();

$adminTitle = 'مدیریت گواهی‌ها'; $adminActive = 'cert';
require __DIR__ . '/_header.php';
?>
<?php if ($flash): ?><div class="a-alert a-ok"><?= e($flash) ?></div><?php endif; ?>
<?php if ($err): ?><div class="a-alert a-err"><?= e($err) ?></div><?php endif; ?>

<form method="post" enctype="multipart/form-data" style="margin-bottom:2rem">
  <?= csrf_field() ?>
  <input type="hidden" name="action" value="add">
  <h3 style="color:var(--gold);margin-bottom:1rem">افزودن گواهی جدید</h3>
  <div class="a-field"><label>عنوان</label><input type="text" name="title" required></div>
  <div class="a-field"><label>توضیح</label><input type="text" name="description"></div>
  <div class="a-field"><label>فایل (PDF/تصویر)</label><input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png,.webp" required></div>
  <button class="a-btn" type="submit">افزودن</button>
</form>

<table class="tbl">
  <thead><tr><th>عنوان</th><th>توضیح</th><th>تاریخ</th><th></th></tr></thead>
  <tbody>
    <?php if (!$certs): ?><tr><td colspan="4" style="color:var(--muted)">گواهی‌ای ثبت نشده است.</td></tr>
    <?php else: foreach ($certs as $c): ?>
      <tr>
        <td><?= e($c['title']) ?></td>
        <td><?= e($c['description']) ?></td>
        <td><?= e($c['created_at']) ?></td>
        <td>
          <form method="post" onsubmit="return confirm('حذف شود؟')" style="display:inline">
            <?= csrf_field() ?>
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?= (int)$c['id'] ?>">
            <button class="a-btn a-btn-sm a-btn-danger" type="submit">حذف</button>
          </form>
        </td>
      </tr>
    <?php endforeach; endif; ?>
  </tbody>
</table>
<?php require __DIR__ . '/_footer.php'; ?>
