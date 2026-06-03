<?php
declare(strict_types=1);
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/database.php';
admin_guard();

$flash = null; $err = null;

function make_slug(string $t): string {
    $s = preg_replace('/\s+/u', '-', trim($t));
    $s = preg_replace('/[^\p{L}\p{N}\-]+/u', '', $s);
    return mb_substr($s, 0, 180) . '-' . substr(bin2hex(random_bytes(3)), 0, 6);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $action = $_POST['action'] ?? '';
    if ($action === 'add') {
        $title = clean($_POST['title'] ?? '');
        $summary = clean($_POST['summary'] ?? '');
        $source_name = clean($_POST['source_name'] ?? '');
        $source_url  = clean($_POST['source_url'] ?? '');
        $publish = isset($_POST['publish']) ? 1 : 0;
        if ($title === '') $err = 'عنوان الزامی است.';
        else {
            db_query('INSERT INTO news (title,slug,summary,source_name,source_url,is_published,published_at)
                      VALUES (?,?,?,?,?,?,?)',
                [$title, make_slug($title), $summary, $source_name ?:null, $source_url ?:null,
                 $publish, $publish ? date('Y-m-d H:i:s') : null]);
            $flash = $publish ? 'خبر منتشر شد.' : 'خبر به‌صورت پیش‌نویس ذخیره شد.';
        }
    } elseif ($action === 'toggle') {
        $nid = (int)($_POST['id'] ?? 0);
        $cur = (int)db_query('SELECT is_published FROM news WHERE id=?', [$nid])->fetchColumn();
        $new = $cur ? 0 : 1;
        db_query('UPDATE news SET is_published=?, published_at=? WHERE id=?',
            [$new, $new ? date('Y-m-d H:i:s') : null, $nid]);
        $flash = 'وضعیت انتشار تغییر کرد.';
    } elseif ($action === 'delete') {
        db_query('DELETE FROM news WHERE id=?', [(int)($_POST['id'] ?? 0)]);
        $flash = 'خبر حذف شد.';
    }
}

$news = db_query('SELECT id,title,source_name,is_published,created_at FROM news ORDER BY created_at DESC LIMIT 200')->fetchAll();

$adminTitle = 'مدیریت اخبار'; $adminActive = 'news';
require __DIR__ . '/_header.php';
?>
<?php if ($flash): ?><div class="a-alert a-ok"><?= e($flash) ?></div><?php endif; ?>
<?php if ($err): ?><div class="a-alert a-err"><?= e($err) ?></div><?php endif; ?>

<div class="a-alert" style="background:rgba(40,110,190,.12);border:1px solid #2a6ebe">
  💡 اخبار از منابع فارسی (رادیو فردا، دویچه‌وله، بی‌بی‌سی فارسی، یورونیوز) پس از بازبینی اینجا ثبت و با درج منبع منتشر می‌شوند.
</div>

<form method="post" style="margin-bottom:2rem">
  <?= csrf_field() ?>
  <input type="hidden" name="action" value="add">
  <h3 style="color:var(--gold);margin-bottom:1rem">افزودن خبر</h3>
  <div class="a-field"><label>عنوان</label><input type="text" name="title" required></div>
  <div class="a-field" style="max-width:none"><label>خلاصه</label><textarea name="summary" style="min-height:80px"></textarea></div>
  <div class="a-field"><label>نام منبع</label><input type="text" name="source_name" placeholder="رادیو فردا"></div>
  <div class="a-field"><label>لینک منبع</label><input type="url" name="source_url" placeholder="https://..."></div>
  <div class="a-field"><label class="opt"><input type="checkbox" name="publish" value="1"> انتشار فوری</label></div>
  <button class="a-btn" type="submit">ذخیره</button>
</form>

<table class="tbl">
  <thead><tr><th>عنوان</th><th>منبع</th><th>وضعیت</th><th>تاریخ</th><th></th></tr></thead>
  <tbody>
    <?php if (!$news): ?><tr><td colspan="5" style="color:var(--muted)">خبری ثبت نشده است.</td></tr>
    <?php else: foreach ($news as $n): ?>
      <tr>
        <td><?= e($n['title']) ?></td>
        <td><?= e($n['source_name'] ?: '—') ?></td>
        <td><?= $n['is_published'] ? '<span class="badge badge-prog">منتشر شده</span>' : '<span class="badge badge-new">پیش‌نویس</span>' ?></td>
        <td><?= e($n['created_at']) ?></td>
        <td style="display:flex;gap:.4rem">
          <form method="post" style="display:inline"><?= csrf_field() ?>
            <input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?= (int)$n['id'] ?>">
            <button class="a-btn a-btn-sm" type="submit"><?= $n['is_published']?'پنهان':'انتشار' ?></button></form>
          <form method="post" onsubmit="return confirm('حذف شود؟')" style="display:inline"><?= csrf_field() ?>
            <input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$n['id'] ?>">
            <button class="a-btn a-btn-sm a-btn-danger" type="submit">حذف</button></form>
        </td>
      </tr>
    <?php endforeach; endif; ?>
  </tbody>
</table>
<?php require __DIR__ . '/_footer.php'; ?>
