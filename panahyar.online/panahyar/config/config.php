<?php
/**
 * پناه‌یار | پیکربندی اصلی
 * مقادیر حساس را از متغیرهای محیطی می‌خواند (هرگز در گیت قرار نده).
 */
declare(strict_types=1);

// --- تنظیمات پایه ---
define('SITE_NAME', 'پناه‌یار');
define('SITE_DOMAIN', 'panahyar.online');
define('BASE_URL', 'https://panahyar.online');

// --- دیتابیس (از محیط بخوان، مقدار پیش‌فرض فقط برای توسعه) ---
define('DB_HOST', getenv('PY_DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('PY_DB_PORT') ?: '3306');
define('DB_NAME', getenv('PY_DB_NAME') ?: 'panahyar');
define('DB_USER', getenv('PY_DB_USER') ?: 'root');
define('DB_PASS', getenv('PY_DB_PASS') ?: '');
define('DB_CHARSET', 'utf8mb4');

// --- مسیرها ---
define('ROOT_PATH', dirname(__DIR__));
define('UPLOAD_PATH', ROOT_PATH . '/uploads');
define('UPLOAD_URL', BASE_URL . '/uploads');

// --- امنیت آپلود ---
define('MAX_UPLOAD_BYTES', 8 * 1024 * 1024); // 8MB
define('ALLOWED_UPLOAD_MIME', [
    'application/pdf' => 'pdf',
    'image/jpeg'      => 'jpg',
    'image/png'       => 'png',
    'image/webp'      => 'webp',
]);

// --- نمایش خطا فقط در توسعه ---
$IS_DEV = (getenv('PY_ENV') === 'dev');
error_reporting(E_ALL);
ini_set('display_errors', $IS_DEV ? '1' : '0');
ini_set('log_errors', '1');

date_default_timezone_set('UTC');
