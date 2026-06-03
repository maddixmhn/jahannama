<?php
/**
 * آپلود امن فایل
 *  - بررسی واقعی MIME با finfo (نه پسوند)
 *  - نام تصادفی روی دیسک
 *  - محدودیت حجم
 *  - ذخیره خارج از مسیر اجراشدنی
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';

/**
 * @return array{ok:bool, error?:string, stored?:string, original?:string, mime?:string, size?:int}
 */
function handle_upload(array $file, string $subdir = ''): array
{
    if (!isset($file['error']) || is_array($file['error'])) {
        return ['ok' => false, 'error' => 'پارامتر آپلود نامعتبر است.'];
    }
    switch ($file['error']) {
        case UPLOAD_ERR_OK: break;
        case UPLOAD_ERR_NO_FILE:
            return ['ok' => false, 'error' => 'فایلی انتخاب نشده است.'];
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            return ['ok' => false, 'error' => 'حجم فایل بیش از حد مجاز است.'];
        default:
            return ['ok' => false, 'error' => 'خطا در آپلود.'];
    }

    if ($file['size'] > MAX_UPLOAD_BYTES) {
        return ['ok' => false, 'error' => 'حجم فایل بیش از حد مجاز است.'];
    }
    if (!is_uploaded_file($file['tmp_name'])) {
        return ['ok' => false, 'error' => 'فایل معتبر نیست.'];
    }

    // تشخیص MIME واقعی
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime  = $finfo->file($file['tmp_name']);
    if (!isset(ALLOWED_UPLOAD_MIME[$mime])) {
        return ['ok' => false, 'error' => 'نوع فایل مجاز نیست (فقط PDF/JPG/PNG/WEBP).'];
    }
    $ext = ALLOWED_UPLOAD_MIME[$mime];

    // مسیر مقصد
    $dir = rtrim(UPLOAD_PATH . '/' . trim($subdir, '/'), '/');
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        return ['ok' => false, 'error' => 'خطا در ساخت مسیر ذخیره.'];
    }

    $stored = bin2hex(random_bytes(16)) . '.' . $ext;
    $dest   = $dir . '/' . $stored;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        return ['ok' => false, 'error' => 'انتقال فایل ناموفق بود.'];
    }
    @chmod($dest, 0644);

    return [
        'ok'       => true,
        'stored'   => ($subdir ? trim($subdir, '/') . '/' : '') . $stored,
        'original' => basename($file['name']),
        'mime'     => $mime,
        'size'     => (int)$file['size'],
    ];
}
