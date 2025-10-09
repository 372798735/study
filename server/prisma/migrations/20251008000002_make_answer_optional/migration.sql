-- 将 answer 字段改为可选（允许为 NULL）
-- 主观题不需要正确答案，所以 answer 可以为空

ALTER TABLE `questions` 
MODIFY COLUMN `answer` TEXT NULL;

