<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/security.php';
require_once __DIR__ . '/../includes/upload.php';

secure_session_start();
$msg = null; $err = [];

// آپلود مدرک توسط کاربر دارای کد پیگیری
if ($_SERVER['REQUEST_METHOD']==='POST') {
    require_csrf();
    $code  = clean($_POST['code'] ?? '');
    $phone = clean($_POST['phone'] ?? '');
    $row = db_query('SELECT id FROM consultations WHERE tracking_code=? AND phone=? LIMIT 1',[$code,$phone])->fetch();
    if (!$row) $err[] = 'کد پیگیری یا شماره واتساپ نادرست است.';
    elseif (!isset($_POST['confirm'])) $err[] = 'لطفاً صحت مدارک را تأیید کنید.';
    elseif (empty($_FILES['file']['name'])) $err[] = 'فایلی انتخاب نشده است.';
    else {
        $up = handle_upload($_FILES['file'],'certs');
        if (!$up['ok']) $err[] = $up['error'];
        else {
            db_query('INSERT INTO user_documents (consultation_id,original_name,stored_name,mime_type,size_bytes) VALUES (?,?,?,?,?)',
                [$row['id'],$up['original'],$up['stored'],$up['mime'],$up['size']]);
            $msg = 'مدرک با موفقیت و به‌صورت امن آپلود شد و در انتظار بررسی است.';
        }
    }
}

// گواهی‌های نمونه که مدیر آپلود کرده
$certs = db_query('SELECT title,description FROM certificates ORDER BY sort_order, id')->fetchAll();

$pageTitle = 'گواهی‌ها و مدارک | پناه‌یار';
$activeNav = 'cert';
require __DIR__ . '/../includes/header.php';
?>
<section class="map-section">
  <h1 class="section-title">📜 راهنمای جامع مدارک و گواهی‌های پناهندگی</h1>
  <p style="color:var(--muted);max-width:800px">با انواع گواهی‌های موردنیاز، نحوه دریافت معتبر آن‌ها و آپلود امن مدارک خود آشنا می‌شوید.</p>

  <div class="features" style="margin-top:1.5rem">
    <div class="feature"><h4>🔔 گواهی تغییر دین</h4><p>نامه از کلیسا، گواهی غسل تعمید، تأییدیه گروه مذهبی.</p></div>
    <div class="feature"><h4>🗳️ فعالیت سیاسی</h4><p>نامه از سازمان‌های سیاسی، مدرک عضویت، گزارش‌های خبری.</p></div>
    <div class="feature"><h4>🩺 گواهی پزشکی/شکنجه</h4><p>گزارش معتبر بر اساس پروتکل استانبول، گواهی روانپزشکی.</p></div>
    <div class="feature"><h4>🏳️‍🌈 وضعیت LGBTQ+</h4><p>نامه از سازمان‌های مرتبط، گزارش روانشناس.</p></div>
  </div>

  <?php if ($certs): ?>
    <h2 class="section-title">نمونه گواهی‌های تأییدشده</h2>
    <div class="features">
      <?php foreach ($certs as $c): ?>
        <div class="feature"><h4><?= e($c['title']) ?></h4><p><?= e($c['description']) ?></p></div>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>

  <h2 class="section-title">آپلود امن مدارک</h2>
  <div class="form-card">
    <?php if ($msg): ?><div class="alert alert-ok"><?= e($msg) ?></div><?php endif; ?>
    <?php if ($err): ?><div class="alert alert-err"><?php foreach($err as $e) echo e($e).'<br>'; ?></div><?php endif; ?>
    <p style="color:var(--muted);font-size:.9rem;margin-bottom:1rem">فقط دارندگان کد پیگیری می‌توانند مدرک آپلود کنند (PDF/JPG/PNG، حداکثر ۸ مگابایت).</p>
    <form method="post" enctype="multipart/form-data">
      <?= csrf_field() ?>
      <div class="field"><label>شماره واتساپ</label><input type="text" name="phone" required></div>
      <div class="field"><label>کد پیگیری ۶ رقمی</label><input type="text" name="code" maxlength="6" required></div>
      <div class="field"><label>فایل مدرک</label><input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png,.webp" required></div>
      <div class="field"><label class="opt"><input type="checkbox" name="confirm" value="1"> تأیید می‌کنم این مدارک واقعی و مربوط به پرونده من است.</label></div>
      <button class="btn btn-gold" type="submit">آپلود امن</button>
    </form>
  </div>
</section>
<?php require __DIR__ . '/../includes/footer.php'; ?>
