<?php
declare(strict_types=1);
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/database.php';
admin_guard();

$flash = null; $err = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $action = $_POST['action'] ?? '';
    if ($action === 'update') {
        $prices = $_POST['price'] ?? [];
        $labels = $_POST['label'] ?? [];
        foreach ($prices as $id => $val) {
            $id = (int)$id;
            $p = (float)$val;
            $lbl = clean($labels[$id] ?? '');
            db_query('UPDATE service_prices SET base_price=?, label=? WHERE id=?', [$p, $lbl, $id]);
        }
        $flash = 'تعرفه‌ها به‌روزرسانی شد.';
    } elseif ($action === 'add') {
        $key = clean($_POST['service_key'] ?? '');
        $lbl = clean($_POST['new_label'] ?? '');
        $p   = (float)($_POST['new_price'] ?? 0);
        if ($key === '' || $lbl === '') $err = 'کلید و عنوان الزامی است.';
        else {
            try {
                db_query('INSERT INTO service_prices (service_key,label,base_price) VALUES (?,?,?)', [$key,$lbl,$p]);
                $flash = 'خدمت افزوده شد.';
            } catch (PDOException $e) { $err = 'کلید تکراری است.'; }
        }
    }
}

$prices = db_query('SELECT id,service_key,label,base_price,is_active FROM service_prices ORDER BY id')->fetchAll();

$adminTitle = 'مدیریت تعرفه‌ها'; $adminActive = 'price';
require __DIR__ . '/_header.php';
?>
<?php if ($flash): ?><div class="a-alert a-ok"><?= e($flash) ?></div><?php endif; ?>
<?php if ($err): ?><div class="a-alert a-err"><?= e($err) ?></div><?php endif; ?>

<form method="post">
  <?= csrf_field() ?>
  <input type="hidden" name="action" value="update">
  <table class="tbl" style="margin-bottom:1rem">
    <thead><tr><th>کلید</th><th>عنوان</th><th>قیمت پایه (یورو)</th></tr></thead>
    <tbody>
      <?php foreach ($prices as $p): ?>
        <tr>
          <td><?= e($p['service_key']) ?></td>
          <td><input class="a-field" style="margin:0" type="text" name="label[<?= (int)$p['id'] ?>]" value="<?= e($p['label']) ?>"></td>
          <td><input class="a-field" style="margin:0;max-width:140px" type="number" step="0.01" name="price[<?= (int)$p['id'] ?>]" value="<?= e((string)$p['base_price']) ?>"></td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
  <button class="a-btn" type="submit">ذخیره تغییرات</button>
</form>

<hr style="border-color:var(--line);margin:2rem 0">

<form method="post">
  <?= csrf_field() ?>
  <input type="hidden" name="action" value="add">
  <h3 style="color:var(--gold);margin-bottom:1rem">افزودن خدمت جدید</h3>
  <div class="a-field"><label>کلید (انگلیسی، یکتا)</label><input type="text" name="service_key" required></div>
  <div class="a-field"><label>عنوان</label><input type="text" name="new_label" required></div>
  <div class="a-field"><label>قیمت پایه (یورو)</label><input type="number" step="0.01" name="new_price" value="0"></div>
  <button class="a-btn" type="submit">افزودن</button>
</form>
<?php require __DIR__ . '/_footer.php'; ?>
