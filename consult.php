<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/security.php';
require_once __DIR__ . '/../includes/upload.php';
require_once __DIR__ . '/../config/contact.php';

secure_session_start();
$errors = [];
$success = null;
$trackingCode = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();

    $name    = clean($_POST['full_name'] ?? '');
    $email   = clean($_POST['email'] ?? '');
    $phone   = clean($_POST['phone'] ?? '');     // واتساپ
    $country = clean($_POST['country'] ?? '');
    $message = clean($_POST['message'] ?? '');
    $consent = isset($_POST['consent']);

    if ($name === '')        $errors[] = 'نام را وارد کنید.';
    if ($phone === '')       $errors[] = 'شماره واتساپ را وارد کنید.';
    if ($email !== '' && !valid_email($email)) $errors[] = 'ایمیل نامعتبر است.';
    if ($message === '')     $errors[] = 'توضیح کوتاه را وارد کنید.';
    if (!$consent)           $errors[] = 'لطفاً تیک تأیید را بزنید.';

    // جلوگیری از ارسال تکراری همان شماره در ۲۴ ساعت
    if (!$errors) {
        $dup = db_query(
            'SELECT COUNT(*) FROM consultations WHERE phone = ? AND created_at > (NOW() - INTERVAL 24 HOUR)',
            [$phone]
        )->fetchColumn();
        if ((int)$dup > 0) {
            $errors[] = 'با این شماره در ۲۴ ساعت گذشته درخواستی ثبت شده است. لطفاً منتظر پاسخ بمانید.';
        }
    }

    if (!$errors) {
        // کد پیگیری ۶ رقمی یکتا
        do {
            $trackingCode = (string)random_int(100000, 999999);
            $exists = db_query('SELECT COUNT(*) FROM consultations WHERE tracking_code = ?', [$trackingCode])->fetchColumn();
        } while ((int)$exists > 0);

        db_query(
            'INSERT INTO consultations (full_name,email,phone,country_iso2,message,tracking_code,ip_hash)
             VALUES (?,?,?,?,?,?,?)',
            [$name, $email ?: null, $phone, $country ?: null, $message, $trackingCode, ip_hash()]
        );
        $cid = (int)db()->lastInsertId();

        // آپلود مدارک اختیاری
        if (!empty($_FILES['documents']['name'][0])) {
            $files = $_FILES['documents'];
            $count = min(count($files['name']), 5);
            for ($i = 0; $i < $count; $i++) {
                if ($files['error'][$i] !== UPLOAD_ERR_OK) continue;
                $one = ['name'=>$files['name'][$i],'type'=>$files['type'][$i],
                        'tmp_name'=>$files['tmp_name'][$i],'error'=>$files['error'][$i],'size'=>$files['size'][$i]];
                $up = handle_upload($one, 'docs');
                if ($up['ok']) {
                    db_query(
                        'INSERT INTO user_documents (consultation_id,original_name,stored_name,mime_type,size_bytes)
                         VALUES (?,?,?,?,?)',
                        [$cid, $up['original'], $up['stored'], $up['mime'], $up['size']]
                    );
                }
            }
        }
        $success = 'درخواست شما ثبت شد. کد پیگیری شما: ' . $trackingCode;
    }
}

$countries = db_query('SELECT iso2,name_fa FROM countries WHERE is_published=1 ORDER BY name_fa')->fetchAll();

$pageTitle = 'درخواست مشاوره | پناه‌یار';
$activeNav = 'consult';
require __DIR__ . '/../includes/header.php';
?>

<section class="map-section">
  <h1 class="section-title">ثبت درخواست مشاوره و ارزیابی</h1>

  <div class="expertise-box">
    <span class="ic">💛</span>
    <div><?= e(EXPERTISE_STATEMENT) ?></div>
  </div>

  <div class="form-card">
    <?php if ($success): ?>
      <div class="alert alert-ok">
        <strong><?= e($success) ?></strong><br>
        این کد را نزد خود نگه دارید. می‌توانید با آن در صفحه «پیگیری درخواست» وضعیت را ببینید.
      </div>
      <a href="/track" class="btn btn-gold">پیگیری درخواست</a>
    <?php else: ?>
      <?php if ($errors): ?>
        <div class="alert alert-err"><?php foreach ($errors as $er) echo e($er).'<br>'; ?></div>
      <?php endif; ?>

      <form method="post" enctype="multipart/form-data">
        <?= csrf_field() ?>
        <div class="field"><label>نام و نام خانوادگی *</label>
          <input type="text" name="full_name" value="<?= e($_POST['full_name'] ?? '') ?>" required></div>
        <div class="field"><label>شماره واتساپ * (برای پاسخگویی)</label>
          <input type="text" name="phone" value="<?= e($_POST['phone'] ?? '') ?>" placeholder="+98..." required></div>
        <div class="field"><label>ایمیل (اختیاری)</label>
          <input type="email" name="email" value="<?= e($_POST['email'] ?? '') ?>"></div>
        <div class="field"><label>کشور مدنظر برای پناهندگی</label>
          <select name="country">
            <option value="">— انتخاب کنید —</option>
            <?php foreach ($countries as $c): ?>
              <option value="<?= e($c['iso2']) ?>"><?= e($c['name_fa']) ?></option>
            <?php endforeach; ?>
          </select></div>
        <div class="field"><label>توضیح کوتاه *</label>
          <textarea name="message" required><?= e($_POST['message'] ?? '') ?></textarea></div>
        <div class="field"><label>مدارک (اختیاری، تا ۵ فایل PDF/JPG/PNG)</label>
          <input type="file" name="documents[]" accept=".pdf,.jpg,.jpeg,.png,.webp" multiple></div>
        <div class="field">
          <label class="opt"><input type="checkbox" name="consent" value="1">
            می‌دانم اطلاعات من فقط برای پاسخگویی استفاده می‌شود.</label>
        </div>
        <button type="submit" class="btn btn-gold">ارسال درخواست</button>
      </form>
    <?php endif; ?>
  </div>
</section>

<?php require __DIR__ . '/../includes/footer.php'; ?>
