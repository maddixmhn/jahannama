<?php
declare(strict_types=1);
require_once __DIR__ . '/../../includes/security.php';
require_once __DIR__ . '/../../includes/auth.php';
send_security_headers();
secure_session_start();

if (admin_check()) { header('Location: /admin/index'); exit; }

$err = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();

    // محدودیت نرخ ساده (۵ تلاش در ۱۰ دقیقه)
    $now = time();
    $_SESSION['login_attempts'] = array_filter(
        $_SESSION['login_attempts'] ?? [],
        fn($t) => $t > $now - 600
    );
    if (count($_SESSION['login_attempts']) >= 5) {
        $err = 'تلاش‌های زیاد. چند دقیقه صبر کنید.';
    } else {
        $u = clean($_POST['username'] ?? '');
        $p = (string)($_POST['password'] ?? '');
        if (admin_login($u, $p)) {
            unset($_SESSION['login_attempts']);
            header('Location: /admin/index'); exit;
        }
        $_SESSION['login_attempts'][] = $now;
        $err = 'نام کاربری یا رمز نادرست است.';
    }
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>ورود به پنل | پناه‌یار</title>
<link rel="stylesheet" href="/assets/css/admin.css">
</head>
<body>
<div class="login-wrap">
  <div class="login-box">
    <h1>پناه<b>‌یار</b><br><small style="font-size:.9rem;color:#9fb0c7">ورود مدیریت</small></h1>
    <?php if ($err): ?><div class="a-alert a-err"><?= e($err) ?></div><?php endif; ?>
    <form method="post">
      <?= csrf_field() ?>
      <div class="a-field"><label>نام کاربری</label><input type="text" name="username" required autofocus></div>
      <div class="a-field"><label>رمز عبور</label><input type="password" name="password" required></div>
      <button class="a-btn" type="submit" style="width:100%">ورود</button>
    </form>
  </div>
</div>
</body>
</html>
