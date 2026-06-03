<?php
declare(strict_types=1);
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/database.php';
admin_guard();

$flash = null; $err = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $action = $_POST['action'] ?? '';
    if ($action === 'add') {
        $scope = ($_POST['scope'] ?? 'international') === 'country' ? 'country' : 'international';
        $iso   = strtoupper(clean($_POST['country_iso2'] ?? '')) ?: null;
        $title = clean($_POST['title'] ?? '');
        $body  = clean($_POST['body'] ?? '');
        $sn    = clean($_POST['source_name'] ?? '');
        $su    = clean($_POST['source_url'] ?? '');
        if ($title === '') $err = 'عنوان الزامی است.';
        else {
            db_query('INSERT INTO laws (scope,country_iso2,title,body,source_name,source_url,is_published)
                      VALUES (?,?,?,?,?,?,1)',
                [$scope, $scope==='country'?$iso:null, $title, $body, $sn ?:null, $su ?:null]);
            $flash = 'قانون افزوده شد.';
        }
    } elseif ($action === 'delete') {
        db_query('DELETE FROM laws WHERE id=?', [(int)($_POST['id'] ?? 0)]);
        $flash = 'حذف شد.';
    }
}

$laws = db_query('SELECT id,scope,country_iso2,title,is_published,updated_at FROM laws ORDER BY scope,title')->fetchAll();

$adminTitle = 'مدیریت قوانین'; $adminActive = 'laws';
require __DIR__ . '/_header.php';
?>
<?php if ($flash): ?><div class="a-alert a-ok"><?= e($flash) ?></div><?php endif; ?>
<?php if ($err): ?><div class="a-alert a-err"><?= e($err) ?></div><?php endif; ?>

<form method="post" style="margin-bottom:2rem">
  <?= csrf_field() ?>
  <input type="hidden" name="action" value="add">
  <h3 style="color:var(--gold);margin-bottom:1rem">افزودن قانون / مقاله</h3>
  <div class="a-field"><label>حوزه</label>
    <select name="scope"><option value="international">بین‌المللی</option><option value="country">کشوری</option></select></div>
  <div class="a-field"><label>کد کشور (فقط برای کشوری)</label><input type="text" name="country_iso2" maxlength="2"></div>
  <div class="a-field"><label>عنوان</label><input type="text" name="title" required></div>
  <div class="a-field" style="max-width:none"><label>متن</label><textarea name="body" style="min-height:160px"></textarea></div>
  <div class="a-field"><label>نام منبع</label><input type="text" name="source_name" placeholder="UNHCR"></div>
  <div class="a-field"><label>لینک منبع رسمی</label><input type="url" name="source_url" placeholder="https://..."></div>
  <button class="a-btn" type="submit">ذخیره</button>
</form>

<table class="tbl">
  <thead><tr><th>عنوان</th><th>حوزه</th><th>کشور</th><th>به‌روزرسانی</th><th></th></tr></thead>
  <tbody>
    <?php if (!$laws): ?><tr><td colspan="5" style="color:var(--muted)">قانونی ثبت نشده است.</td></tr>
    <?php else: foreach ($laws as $l): ?>
      <tr>
        <td><?= e($l['title']) ?></td>
        <td><?= $l['scope']==='country'?'کشوری':'بین‌المللی' ?></td>
        <td><?= e($l['country_iso2'] ?: '—') ?></td>
        <td><?= e($l['updated_at']) ?></td>
        <td><form method="post" onsubmit="return confirm('حذف شود؟')" style="display:inline"><?= csrf_field() ?>
          <input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$l['id'] ?>">
          <button class="a-btn a-btn-sm a-btn-danger" type="submit">حذف</button></form></td>
      </tr>
    <?php endforeach; endif; ?>
  </tbody>
</table>
<?php require __DIR__ . '/_footer.php'; ?>
