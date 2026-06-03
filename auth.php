<?php
/**
 * احراز هویت مدیر (پنل کامیار دادبین)
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/security.php';

/** ورود مدیر */
function admin_login(string $username, string $password): bool
{
    $stmt = db_query(
        'SELECT id, username, password_hash, full_name, role, is_active
         FROM admins WHERE username = ? LIMIT 1',
        [$username]
    );
    $admin = $stmt->fetch();

    if (!$admin || !$admin['is_active']) {
        return false;
    }
    if (!password_verify($password, $admin['password_hash'])) {
        return false;
    }

    // ارتقای هش در صورت قدیمی بودن
    if (password_needs_rehash($admin['password_hash'], PASSWORD_DEFAULT)) {
        $new = password_hash($password, PASSWORD_DEFAULT);
        db_query('UPDATE admins SET password_hash = ? WHERE id = ?', [$new, $admin['id']]);
    }

    secure_session_start();
    session_regenerate_id(true);
    $_SESSION['admin'] = [
        'id'        => (int)$admin['id'],
        'username'  => $admin['username'],
        'full_name' => $admin['full_name'],
        'role'      => $admin['role'],
    ];
    db_query('UPDATE admins SET last_login_at = NOW() WHERE id = ?', [$admin['id']]);
    return true;
}

function admin_logout(): void
{
    secure_session_start();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

function admin_check(): bool
{
    secure_session_start();
    return !empty($_SESSION['admin']['id']);
}

/** نگهبان صفحات پنل: اگر وارد نشده → ریدایرکت به ورود */
function admin_guard(): void
{
    if (!admin_check()) {
        header('Location: /admin/login.php');
        exit;
    }
}

function current_admin(): ?array
{
    secure_session_start();
    return $_SESSION['admin'] ?? null;
}
