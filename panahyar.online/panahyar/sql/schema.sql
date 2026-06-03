-- ============================================================
-- پناه‌یار | Panahyar.online  — اسکیمای دیتابیس
-- charset: utf8mb4 برای پشتیبانی کامل فارسی و اموجی
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS panahyar
  CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci;
USE panahyar;

-- ----------------------------------------------------------
-- مدیران (پنل کامیار دادبین)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(60)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,           -- password_hash() / Argon2id
  full_name     VARCHAR(120) NOT NULL,
  role          ENUM('superadmin','editor') NOT NULL DEFAULT 'editor',
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  last_login_at DATETIME     NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- ----------------------------------------------------------
-- کشورها (برای نقشه و صفحات شرایط)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS countries (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  iso2            CHAR(2)      NOT NULL UNIQUE,   -- مثل US, AU, DE
  name_fa         VARCHAR(120) NOT NULL,
  name_en         VARCHAR(120) NOT NULL,
  continent       ENUM('asia','europe','north_america','south_america','africa','oceania') NOT NULL,
  flag_emoji      VARCHAR(16)  NULL,
  asylum_summary  TEXT         NULL,             -- خلاصه ساده شرایط پناهندگی
  humanitarian    TEXT         NULL,             -- ویزای بشردوستانه
  official_url    VARCHAR(500) NULL,             -- لینک منبع رسمی
  form_name       VARCHAR(120) NULL,             -- مثل I-589 / Subclass 202
  form_url        VARCHAR(500) NULL,             -- لینک فرم رسمی
  is_published    TINYINT(1)   NOT NULL DEFAULT 1,
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- ----------------------------------------------------------
-- درخواست‌های مشاوره (فرم عمومی → پنل مدیریت)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS consultations (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name    VARCHAR(120) NOT NULL,
  email        VARCHAR(190) NULL,
  phone        VARCHAR(40)  NOT NULL,
  country_iso2 CHAR(2)      NULL,
  message      TEXT         NOT NULL,
  tracking_code CHAR(6)     NOT NULL UNIQUE,     -- کد پیگیری ۶ رقمی
  status       ENUM('new','in_progress','answered','closed') NOT NULL DEFAULT 'new',
  ip_hash      CHAR(64)     NULL,                -- هش IP، نه خود IP
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- ----------------------------------------------------------
-- پیام‌های پاسخ مدیر به مشتری (تاریخچه گفتگو)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS consultation_messages (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  consultation_id INT UNSIGNED NOT NULL,
  sender          ENUM('admin','client') NOT NULL,
  body            TEXT NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- ----------------------------------------------------------
-- وکلای همکار بر اساس کشور
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS lawyers (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name    VARCHAR(120) NOT NULL,
  country_iso2 CHAR(2)      NOT NULL,
  city         VARCHAR(120) NULL,
  specialty    VARCHAR(190) NULL,
  email        VARCHAR(190) NULL,
  phone        VARCHAR(40)  NULL,
  bio          TEXT         NULL,
  photo_path   VARCHAR(255) NULL,
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- ----------------------------------------------------------
-- اخبار (CMS با بازبینی + درج منبع)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS news (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  summary      VARCHAR(500) NULL,
  body         MEDIUMTEXT   NULL,
  source_name  VARCHAR(190) NULL,                -- نام منبع
  source_url   VARCHAR(500) NULL,                -- لینک منبع
  is_published TINYINT(1)   NOT NULL DEFAULT 0,  -- پیش‌فرض پیش‌نویس (بازبینی)
  published_at DATETIME     NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- ----------------------------------------------------------
-- محتوای صفحه «درباره ما» (بیوگرافی کامیار دادبین)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS about_page (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(190) NOT NULL DEFAULT 'درباره ما',
  body        MEDIUMTEXT   NULL,
  photo_path  VARCHAR(255) NULL,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- ----------------------------------------------------------
-- گواهی‌نامه‌ها / سرتیفیکیت‌ها (آپلود مدیر)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificates (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(190) NOT NULL,
  description VARCHAR(500) NULL,
  file_path   VARCHAR(255) NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- ----------------------------------------------------------
-- آپلود امن مدارک توسط کاربران (مرتبط با درخواست)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_documents (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  consultation_id INT UNSIGNED NULL,
  original_name   VARCHAR(255) NOT NULL,
  stored_name     VARCHAR(255) NOT NULL,         -- نام تصادفی روی دیسک
  mime_type       VARCHAR(100) NOT NULL,
  size_bytes      INT UNSIGNED NOT NULL,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- ----------------------------------------------------------
-- قوانین جامع (بین‌المللی و کشوری) — CMS
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS laws (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  scope        ENUM('international','country') NOT NULL DEFAULT 'international',
  country_iso2 CHAR(2)      NULL,
  title        VARCHAR(255) NOT NULL,
  body         MEDIUMTEXT   NULL,
  source_name  VARCHAR(190) NULL,
  source_url   VARCHAR(500) NULL,
  is_published TINYINT(1)   NOT NULL DEFAULT 1,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- ----------------------------------------------------------
-- تعرفه خدمات (برای ماشین‌حساب تعرفه)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_prices (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_key VARCHAR(80)  NOT NULL UNIQUE,
  label       VARCHAR(190) NOT NULL,
  base_price  DECIMAL(10,2) NOT NULL DEFAULT 0,  -- به USD
  is_active   TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- ----------------------------------------------------------
-- داده‌های اولیه نمونه
-- ----------------------------------------------------------
INSERT INTO about_page (title, body) VALUES
('درباره کامیار دادبین', 'بیوگرافی از طریق پنل مدیریت قابل ویرایش است.');

-- قوانین بین‌المللی پایه (از منابع رسمی UNHCR)
INSERT INTO laws (scope,title,body,source_name,source_url,is_published) VALUES
('international','کنوانسیون ۱۹۵۱ پناهندگان',
 'کنوانسیون مربوط به وضعیت پناهندگان (۱۹۵۱) سند بنیادین حقوق بین‌الملل پناهندگی است. این کنوانسیون «پناهنده» را فردی تعریف می‌کند که به دلیل ترس موجه از آزار به سبب نژاد، دین، ملیت، عضویت در گروه اجتماعی خاص، یا عقیده سیاسی، خارج از کشور خود است و نمی‌تواند یا نمی‌خواهد از حمایت آن کشور برخوردار شود. اصل کلیدی آن «عدم بازگرداندن» (Non-refoulement) است: هیچ کشوری نباید پناهنده را به مرزهایی بازگرداند که جان یا آزادی او در خطر است.',
 'UNHCR','https://www.unhcr.org/about-unhcr/who-we-are/1951-refugee-convention',1),
('international','پروتکل ۱۹۶۷',
 'پروتکل ۱۹۶۷ محدودیت‌های زمانی و جغرافیایی کنوانسیون ۱۹۵۱ (که در ابتدا عمدتاً به رویدادهای پیش از ۱۹۵۱ در اروپا محدود بود) را برداشت و دامنه آن را جهانی کرد.',
 'UNHCR','https://www.unhcr.org/',1);

INSERT INTO service_prices (service_key, label, base_price) VALUES
-- بسته‌های مشاوره
('consult_30',     'مشاوره تخصصی ۳۰ دقیقه', 150.00),
('consult_60',     'مشاوره تخصصی ۱ ساعته', 250.00),
('consult_3x3',    'بسته ۳ ساعت در ۳ روز (تحلیل کامل + نقشه راه PDF + ۷ روز پشتیبانی)', 185.00),
('consult_family', 'مشاوره تخصصی خانواده (۲ ساعت)', 280.00),
-- تنظیم و تکمیل پرونده
('statement',      'تنظیم اظهارنامه پناهندگی (ترجمه + بازنویسی تا ۳ بار)', 550.00),
('forms',          'تکمیل فرم‌های رسمی پناهندگی (هر کشور)', 350.00),
('religion_case',  'تنظیم کیس تغییر دین', 500.00),
('lgbtq_case',     'تنظیم کیس LGBTQ+', 550.00),
('political_case', 'تنظیم کیس فعالان سیاسی/روزنامه‌نگاران', 600.00),
('medical_case',   'تنظیم کیس پزشکی (بیماری خاص)', 500.00),
('appeal',         'بررسی و بازسازی پرونده رد شده (اعتراض)', 750.00),
('golden_package', 'پکیج طلایی کامل (همه موارد بالا)', 1200.00),
-- ویزای بشردوستانه
('humanitarian_reg','ثبت‌نام اولیه ویزای بشردوستانه', 150.00),
('humanitarian_de','پکیج کامل ویزای بشردوستانه آلمان', 1600.00),
('humanitarian_ca','پکیج کامل ویزای بشردوستانه کانادا', 1800.00),
('humanitarian_br','پکیج کامل ویزای بشردوستانه برزیل/آرژانتین', 1100.00),
-- خانواده و بازپیوند
('family_reunion', 'پکیج بازپیوند خانواده (همسر و فرزندان)', 1500.00),
('family_extra',   'افزودن هر عضو اضافی (فرزند بالای ۱۸، والدین) — به ازای هر نفر', 300.00),
('guardianship',   'تنظیم فرم‌های سرپرستی خانواده', 400.00),
-- VIP
('vip_monthly',    'همراهی کامل VIP تا حصول نتیجه (ماهانه، حداقل ۳ ماه)', 1000.00),
-- آموزش و دوره‌ها
('train_interview','آموزش مصاحبه پناهندگی (۲ جلسه ۱ ساعته)', 300.00),
('train_forms',    'آموزش تکمیل فرم‌ها (ویدئو + PDF + پشتیبانی)', 180.00),
('train_full',     'پکیج آموزش کامل (۵ موضوع اصلی)', 550.00),
-- خدمات جانبی
('doc_review',     'بررسی مدارک (تا ۵ مدرک، بدون مشاوره)', 120.00),
('translation',   'ترجمه رسمی مدارک (هر صفحه)', 10.00),
('wa_followup',    'ارسال پیگیری خودکار واتساپ (هفتگی، ماهانه)', 50.00);

-- کشورها از فایل seed_countries.sql درج می‌شوند (مرجع واحد).
