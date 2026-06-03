<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/security.php';

secure_session_start();
$result = null; $errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $phone = clean($_POST['phone'] ?? '');
    $code  = clean($_POST['code'] ?? '');
    if ($phone==='' || $code==='') $errors[] = 'شماره واتساپ و کد پیگیری را وارد کنید.';
    if (!$errors) {
        $row = db_query(
            'SELECT id,full_name,status,created_at FROM consultations WHERE phone=? AND tracking_code=? LIMIT 1',
            [$phone, $code]
        )->fetch();
        if (!$row) $errors[] = 'درخواستی با این مشخصات یافت نشد.';
        else {
            $msgs = db_query(
                'SELECT sender,body,created_at FROM consultation_messages WHERE consultation_id=? ORDER BY created_at',
                [$row['id']]
            )->fetchAll();
            $result = ['c'=>$row,'msgs'=>$msgs];
        }
    }
}

$statusFa = ['new'=>'🟡 جدید','in_progress'=>'🟢 در حال بررسی','answered'=>'🔵 پاسخ داده شده','closed'=>'⚫ بسته شده'];
$pageTitle = 'پیگیری درخواست | پناه‌یار';
require __DIR__ . '/../includes/header.php';
?>
<section class="map-section">
  <h1 class="section-title">پیگیری درخواست</h1>
  <div class="form-card">
    <?php if ($errors): ?><div class="alert alert-err"><?php foreach($errors as $e) echo e($e).'<br>'; ?></div><?php endif; ?>

    <?php if ($result): ?>
      <div class="alert alert-ok">
        وضعیت درخواست: <strong><?= e($statusFa[$result['c']['status']]) ?></strong><br>
        تاریخ ثبت: <?= e($result['c']['created_at']) ?>
      </div>
      <?php if ($result['msgs']): ?>
        <h3 style="color:var(--gold);margin:1rem 0">پیام‌ها</h3>
        <?php foreach ($result['msgs'] as $m): ?>
          <div class="result-card" style="margin-bottom:.8rem">
            <small style="color:var(--gold-soft)"><?= $m['sender']==='admin'?'تیم پناه‌یار':'شما' ?> — <?= e($m['created_at']) ?></small>
            <p style="margin-top:.4rem"><?= nl2br(e($m['body'])) ?></p>
          </div>
        <?php endforeach; ?>
      <?php else: ?><p style="color:var(--muted)">هنوز پاسخی ثبت نشده است.</p><?php endif; ?>
      <a href="/track" class="btn btn-ghost" style="margin-top:1rem">پیگیری دیگر</a>
    <?php else: ?>
      <form method="post">
        <?= csrf_field() ?>
        <div class="field"><label>شماره واتساپ</label><input type="text" name="phone" required></div>
        <div class="field"><label>کد پیگیری ۶ رقمی</label><input type="text" name="code" maxlength="6" required></div>
        <button class="btn btn-gold" type="submit">مشاهده وضعیت</button>
      </form>
    <?php endif; ?>
  </div>
</section>
<?php require __DIR__ . '/../includes/footer.php'; ?>
