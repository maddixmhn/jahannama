<?php
declare(strict_types=1);
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/database.php';
admin_guard();

$id = (int)($_GET['id'] ?? 0);
$doc = db_query('SELECT original_name,stored_name,mime_type FROM user_documents WHERE id=?', [$id])->fetch();
if (!$doc) { http_response_code(404); exit('فایل یافت نشد.'); }

$path = UPLOAD_PATH . '/' . $doc['stored_name'];
$real = realpath($path);
// جلوگیری از path traversal: فایل باید داخل UPLOAD_PATH باشد
if ($real === false || strpos($real, realpath(UPLOAD_PATH)) !== 0 || !is_file($real)) {
    http_response_code(404); exit('فایل موجود نیست.');
}

// لاگ دسترسی
error_log(sprintf('[doc-access] admin=%s doc=%d at=%s',
    current_admin()['username'] ?? '?', $id, date('c')));

header('Content-Type: ' . $doc['mime_type']);
header('Content-Disposition: attachment; filename="' . rawurlencode($doc['original_name']) . '"');
header('Content-Length: ' . filesize($real));
header('X-Content-Type-Options: nosniff');
readfile($real);
exit;
