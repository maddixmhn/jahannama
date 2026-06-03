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
        $name = clean($_POST['full_name'] ?? '');
        $iso  = strtoupper(clean($_POST['country_iso2'] ?? ''));
        $city = clean($_POST['city'] ?? '');
        $spec = clean($_POST['specialty'] ?? '');
        $email= clean($_POST['email'] ?? '');
        $phone= clean($_POST['phone'] ?? '');
        $bio  = clean($_POST['bio'] ?? '');
        $photo= null;
        if ($name==='' || strlen($iso)!==2) $err = 'نام و کد دو حرفی کشور الزامی است.';
        else {
            if (!empty($_FILES['photo']['name'])) {
                $up = handle_upload($_FILES['photo'], 'lawyers');
                if ($up['ok']) $photo = $up['stored']; else $err = $up['error'];
            }
            if (!$err) {
                db_query('INSERT INTO lawyers (full_name,country_iso2,city,specialty,email,phone,bio,photo_path)
                          VALUES (?,?,?,?,?,?,?,?)',
                    [$name,$iso,$city,$spec,$email ?:null,$phone ?:null,$bio,$photo]);
                $flash = 'وکیل افزوده شد.';
            }
        }
    } elseif ($action === 'delete') {
        $lid = (int)($_POST['id'] ?? 0);
        $p = db_query('SELECT photo_path FROM lawyers WHERE id=?', [$lid])->fetchColumn();
        if ($p) @unlink(UPLOAD_PATH.'/'.$p);
        db_query('DELETE FROM lawyers WHERE id=?', [$lid]);
        $flash = 'وکیل حذف شد.';
    }
}

$lawyers = db_query('SELECT id,full_name,country_iso2,city,specialty FROM lawyers ORDER BY country_iso2,full_name')->fetchAll();

$adminTitle = 'مدیریت وکلای همکار'; $adminActive = 'law';
require __DIR__ . '/_header.php';
?>
<?php if ($flash): ?><div class="a-alert a-ok"><?= e($flash) ?></div><?php endif; ?>
<?php if ($err): ?><div class="a-alert a-err"><?= e($err) ?></div><?php endif; ?>

<form method="post" enctype="multipart/form-data" style="margin-bottom:2rem">
  <?= csrf_field() ?>
  <input type="hidden" name="action" value="add">
  <h3 style="color:var(--gold);margin-bottom:1rem">افزودن وکیل</h3>
  <div class="a-field"><label>نام کامل</label><input type="text" name="full_name" required></div>
  <div class="a-field"><label>کد کشور (مثل DE، CA)</label><input type="text" name="country_iso2" maxlength="2" required></div>
  <div class="a-field"><label>شهر</label><input type="text" name="city"></div>
  <div class="a-field"><label>تخصص</label><input type="text" name="specialty"></div>
  <div class="a-field"><label>ایمیل</label><input type="email" name="email"></div>
  <div class="a-field"><label>تلفن</label><input type="text" name="phone"></div>
  <div class="a-field" style="max-width:none"><label>بیوگرافی</label><textarea name="bio"></textarea></div>
  <div class="a-field"><label>عکس</label><input type="file" name="photo" accept=".jpg,.jpeg,.png,.webp"></div>
  <button class="a-btn" type="submit">افزودن</button>
</form>

<table class="tbl">
  <thead><tr><th>نام</th><th>کشور</th><th>شهر</th><th>تخصص</th><th></th></tr></thead>
  <tbody>
    <?php if (!$lawyers): ?><tr><td colspan="5" style="color:var(--muted)">وکیلی ثبت نشده است.</td></tr>
    <?php else: foreach ($lawyers as $l): ?>
      <tr>
        <td><?= e($l['full_name']) ?></td><td><?= e($l['country_iso2']) ?></td>
        <td><?= e($l['city'] ?: '—') ?></td><td><?= e($l['specialty'] ?: '—') ?></td>
        <td>
          <form method="post" onsubmit="return confirm('حذف شود؟')" style="display:inline">
            <?= csrf_field() ?><input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?= (int)$l['id'] ?>">
            <button class="a-btn a-btn-sm a-btn-danger" type="submit">حذف</button>
          </form>
        </td>
      </tr>
    <?php endforeach; endif; ?>
  </tbody>
</table>
<?php require __DIR__ . '/_footer.php'; ?>
