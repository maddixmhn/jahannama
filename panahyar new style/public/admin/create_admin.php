<?php
/**
 * ساخت مدیر اولیه — از خط فرمان اجرا شود:
 *   php create_admin.php <username> <password> "<full name>"
 * بعد از ساخت اولین مدیر، این فایل را حذف یا غیرفعال کنید.
 */
declare(strict_types=1);

if (PHP_SAPI !== 'cli') { http_response_code(403); exit('فقط از خط فرمان.'); }

require_once __DIR__ . '/../../config/database.php';

$user = $argv[1] ?? null;
$pass = $argv[2] ?? null;
$name = $argv[3] ?? 'کامیار دادبین';

if (!$user || !$pass) {
    fwrite(STDERR, "استفاده: php create_admin.php <username> <password> \"<full name>\"\n");
    exit(1);
}
if (strlen($pass) < 8) {
    fwrite(STDERR, "رمز باید حداقل ۸ کاراکتر باشد.\n");
    exit(1);
}

$hash = password_hash($pass, PASSWORD_DEFAULT);
try {
    db_query(
        'INSERT INTO admins (username,password_hash,full_name,role) VALUES (?,?,?,?)',
        [$user, $hash, $name, 'superadmin']
    );
    echo "مدیر «{$user}» ساخته شد. این فایل را اکنون حذف کنید.\n";
} catch (PDOException $e) {
    fwrite(STDERR, 'خطا: ' . $e->getMessage() . "\n");
    exit(1);
}
