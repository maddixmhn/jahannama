<?php
declare(strict_types=1);
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../includes/upload.php';
admin_guard();

$flash = null; $err = null;
$row = db_query('SELECT * FROM about_page ORDER BY id LIMIT 1')->fetch();
if (!$row) {
    db_query("INSERT INTO about_page (title,body) VALUES ('کامیار دادبین','')");
    $row = db_query('SELECT * FROM about_page ORDER BY id LIMIT 1')->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $title = clean($_POST['title'] ?? '');
    $body  = clean($_POST['body'] ?? '');
    $photo = $row['photo_path'];

    if (!empty($_FILES['photo']['name'])) {
        $up = handle_upload($_FILES['photo'], 'about');
        if ($up['ok']) $photo = $up['stored'];
        else $err = $up['error'];
    }
    if (!$err) {
        db_query('UPDATE about_page SET title=?, body=?, photo_path=? WHERE id=?',
            [$title, $body, $photo, $row['id']]);
        $flash = 'صفحه درباره ما به‌روزرسانی شد.';
        $row = db_query('SELECT * FROM about_page WHERE id=?', [$row['id']])->fetch();
    }
}

$adminTitle = 'مدیریت صفحه درباره ما'; $adminActive = 'about';
require __DIR__ . '/_header.php';
?>
<?php if ($flash): ?><div class="a-alert a-ok"><?= e($flash) ?></div><?php endif; ?>
<?php if ($err): ?><div class="a-alert a-err"><?= e($err) ?></div><?php endif; ?>

<form method="post" enctype="multipart/form-data">
  <?= csrf_field() ?>
  <div class="a-field"><label>عنوان</label><input type="text" name="title" value="<?= e($row['title']) ?>"></div>
  <div class="a-field" style="max-width:none"><label>بیوگرافی کامیار دادبین</label>
    <textarea name="body" style="min-height:220px"><?= e($row['body']) ?></textarea></div>
  <div class="a-field"><label>عکس (JPG/PNG)</label>
    <?php if ($row['photo_path']): ?>
      <p><img src="<?= e(UPLOAD_URL.'/'.$row['photo_path']) ?>" style="width:120px;border-radius:8px;margin-bottom:.5rem"></p>
    <?php endif; ?>
    <input type="file" name="photo" accept=".jpg,.jpeg,.png,.webp"></div>
  <button class="a-btn" type="submit">ذخیره</button>
</form>
<?php require __DIR__ . '/_footer.php'; ?>
