<?php
/**
 * اتصال دیتابیس با PDO
 * تمام کوئری‌ها باید از prepared statement استفاده کنند → جلوگیری از SQL Injection
 */
declare(strict_types=1);

require_once __DIR__ . '/config.php';

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    if (getenv('PY_DB_SOCKET')) {
        $dsn = sprintf('mysql:unix_socket=%s;dbname=%s;charset=%s',
            getenv('PY_DB_SOCKET'), DB_NAME, DB_CHARSET);
    } else {
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s',
            DB_HOST, DB_PORT, DB_NAME, DB_CHARSET);
    }

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false, // prepared واقعی سمت سرور
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        error_log('DB connection failed: ' . $e->getMessage());
        http_response_code(500);
        exit('خطا در اتصال به پایگاه داده.');
    }

    return $pdo;
}

/** کمک‌تابع کوئری امن */
function db_query(string $sql, array $params = []): PDOStatement
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    return $stmt;
}
