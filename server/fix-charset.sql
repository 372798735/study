-- 修复数据库字符编码问题

-- 设置当前会话字符集
SET NAMES utf8mb4;

-- 确保数据库使用utf8mb4
ALTER DATABASE education_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 修改questions表字符集
ALTER TABLE questions CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 修改dictionaries表字符集
ALTER TABLE dictionaries CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 修改其他表字符集
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE videos CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE learning_records CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE admins CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
