<?php
/**
 * توابع امنیتی مرکزی
 *  - جلوگیری از XSS با escape خروجی
 *  - توکن CSRF برای همه فرم‌ها
 *  - نشست (session) امن
 *  - هدرهای امنیتی + CSP
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';

/** نشست امن */
function secure_session_start(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'domain'   => '',
        'secure'   => $https,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_name('PYSESS');
    session_start();

    // چرخش شناسه نشست برای جلوگیری از session fixation
    if (empty($_SESSION['_initiated'])) {
        session_regenerate_id(true);
        $_SESSION['_initiated'] = true;
    }
}

/** هدرهای امنیتی + سیاست امنیت محتوا (CSP) */
function send_security_headers(): void
{
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
    // CSP: اجازه اسکریپت inline محدود (برای محافظت کپی نیاز است) — در تولید nonce بهتر است
    header("Content-Security-Policy: default-src 'self'; "
        . "img-src 'self' data:; "
        . "style-src 'self' 'unsafe-inline'; "
        . "script-src 'self' 'unsafe-inline'; "
        . "frame-ancestors 'self';");
    if (!empty($_SERVER['HTTPS'])) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
}

/** ESCAPE خروجی → جلوگیری از XSS. همیشه قبل از چاپ هر داده کاربر استفاده شود. */
function e(?string $value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

/** ساخت/دریافت توکن CSRF */
function csrf_token(): string
{
    secure_session_start();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/** فیلد مخفی CSRF برای فرم‌ها */
function csrf_field(): string
{
    return '<input type="hidden" name="csrf_token" value="' . e(csrf_token()) . '">';
}

/** اعتبارسنجی توکن CSRF (مقایسه زمان‌ثابت) */
function csrf_verify(?string $token): bool
{
    secure_session_start();
    return !empty($_SESSION['csrf_token'])
        && is_string($token)
        && hash_equals($_SESSION['csrf_token'], $token);
}

/** اگر CSRF نامعتبر بود، درخواست را رد کن */
function require_csrf(): void
{
    if ($_SERVER['REQUEST_METHOD'] === 'POST'
        && !csrf_verify($_POST['csrf_token'] ?? null)) {
        http_response_code(419);
        exit('توکن امنیتی نامعتبر است. صفحه را تازه کنید.');
    }
}

/** هش IP برای حریم خصوصی (ذخیره خود IP نمی‌کنیم) */
function ip_hash(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return hash('sha256', $ip . '|panahyar_salt');
}

/** پاک‌سازی ساده رشته ورودی (trim + حذف کاراکترهای کنترلی) */
function clean(?string $v): string
{
    $v = (string)$v;
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v);
    return trim($v);
}

/** اعتبارسنجی ایمیل */
function valid_email(string $email): bool
{
    return (bool)filter_var($email, FILTER_VALIDATE_EMAIL);
}
