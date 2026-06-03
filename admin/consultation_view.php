<?php
declare(strict_types=1);
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/contact.php';
admin_guard();

$id = (int)($_GET['id'] ?? 0);
$flash = null; $err = null;

$c = db_query('SELECT * FROM consultations WHERE id=?', [$id])->fetch();
if (!$c) { http_response_code(404); exit('درخواست یافت نشد.'); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $action = $_POST['action'] ?? '';

    if ($action === 'status') {
        $new = $_POST['status'] ?? '';
        if (in_array($new, ['new','in_progress','answered','closed'], true)) {
            db_query('UPDATE consultations SET status=? WHERE id=?', [$new, $id]);
            $flash = 'وضعیت به‌روزرسانی شد.';
            $c['status'] = $new;
        }
    } elseif ($action === 'reply') {
        $body = clean($_POST['body'] ?? '');
        if ($body === '') $err = 'متن پیام خالی است.';
        else {
            db_query('INSERT INTO consultation_messages (consultation_id,sender,body) VALUES (?,?,?)',
                [$id, 'admin', $body]);
            db_query('UPDATE consultations SET status=? WHERE id=?', ['answered', $id]);
            $c['status'] = 'answered';
            $flash = 'پیام ثبت شد و برای مشتری در صفحه پیگیری قابل مشاهده است.';
        }
    }
}

$msgs = db_query('SELECT sender,body,created_at FROM consultation_messages WHERE consultation_id=? ORDER BY created_at', [$id])->fetchAll();
$docs = db_query('SELECT id,original_name,stored_name,mime_type,size_bytes,created_at FROM user_documents WHERE consultation_id=? ORDER BY created_at', [$id])->fetchAll();

// لینک واتساپ آماده برای پاسخ مستقیم
$waLink = 'https://wa.me/' . preg_replace('/\D/', '', $c['phone']);

$adminTitle = 'مشاهده درخواست #' . $id; $adminActive = 'cons';
require __DIR__ . '/_header.php';
?>
<?php if ($flash): ?><div class="a-alert a-ok"><?= e($flash) ?></div><?php endif; ?>
<?php if ($err): ?><div class="a-alert a-err"><?= e($err) ?></div><?php endif; ?>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
  <div class="stat-card">
    <h3 style="color:var(--gold);margin-bottom:.8rem">اطلاعات متقاضی</h3>
    <p><b>نام:</b> <?= e($c['full_name']) ?></p>
    <p><b>واتساپ:</b> <?= e($c['phone']) ?> — <a class="a-link" href="<?= e($waLink) ?>" target="_blank" rel="noopener">باز کردن در واتساپ ↗</a></p>
    <p><b>ایمیل:</b> <?= e($c['email'] ?: '—') ?></p>
    <p><b>کشور:</b> <?= e($c['country_iso2'] ?: '—') ?></p>
    <p><b>کد پیگیری:</b> <?= e($c['tracking_code']) ?></p>
    <p><b>تاریخ:</b> <?= e($c['created_at']) ?></p>
    <p style="margin-top:.8rem"><b>توضیح متقاضی:</b><br><?= nl2br(e($c['message'])) ?></p>
  </div>

  <div class="stat-card">
    <h3 style="color:var(--gold);margin-bottom:.8rem">تغییر وضعیت</h3>
    <form method="post" style="display:flex;gap:.6rem;align-items:flex-end">
      <?= csrf_field() ?>
      <input type="hidden" name="action" value="status">
      <div class="a-field" style="margin:0;flex:1">
        <select name="status">
          <option value="new"        <?= $c['status']==='new'?'selected':'' ?>>جدید</option>
          <option value="in_progress"<?= $c['status']==='in_progress'?'selected':'' ?>>در حال بررسی</option>
          <option value="answered"   <?= $c['status']==='answered'?'selected':'' ?>>پاسخ داده شده</option>
          <option value="closed"     <?= $c['status']==='closed'?'selected':'' ?>>بسته شده</option>
        </select>
      </div>
      <button class="a-btn" type="submit">ثبت</button>
    </form>

    <h3 style="color:var(--gold);margin:1.4rem 0 .8rem">مدارک کاربر (<?= count($docs) ?>)</h3>
    <?php if (!$docs): ?>
      <p style="color:var(--muted)">مدرکی آپلود نشده است.</p>
    <?php else: foreach ($docs as $d): ?>
      <p style="margin-bottom:.4rem">
        📎 <a class="a-link" href="/admin/download?id=<?= (int)$d['id'] ?>"><?= e($d['original_name']) ?></a>
        <small style="color:var(--muted)">(<?= round($d['size_bytes']/1024) ?>KB)</small>
      </p>
    <?php endforeach; endif; ?>
  </div>
</div>

<div class="stat-card">
  <h3 style="color:var(--gold);margin-bottom:.8rem">گفتگو با مشتری</h3>
  <?php foreach ($msgs as $m): ?>
    <div style="background:<?= $m['sender']==='admin'?'rgba(198,164,63,.1)':'rgba(40,110,190,.12)' ?>;
                padding:.7rem .9rem;border-radius:8px;margin-bottom:.6rem">
      <small style="color:var(--gold-soft)"><?= $m['sender']==='admin'?'تیم پناه‌یار':'مشتری' ?> — <?= e($m['created_at']) ?></small>
      <p style="margin-top:.3rem"><?= nl2br(e($m['body'])) ?></p>
    </div>
  <?php endforeach; ?>
  <?php if (!$msgs): ?><p style="color:var(--muted);margin-bottom:1rem">هنوز پیامی رد و بدل نشده است.</p><?php endif; ?>

  <form method="post">
    <?= csrf_field() ?>
    <input type="hidden" name="action" value="reply">
    <div class="a-field" style="max-width:none"><label>پاسخ به مشتری (در صفحه پیگیری نمایش داده می‌شود)</label>
      <textarea name="body" required></textarea></div>
    <button class="a-btn" type="submit">ارسال پاسخ</button>
  </form>
</div>
<?php require __DIR__ . '/_footer.php'; ?>
