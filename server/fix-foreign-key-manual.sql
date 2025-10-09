-- ===================================
-- 修复外键约束 - 手动执行版本
-- ===================================
-- 使用方法：
-- 1. 打开MySQL客户端
-- 2. 连接到 education_db 数据库
-- 3. 执行以下SQL语句
-- ===================================

USE education_db;

-- 1. 删除现有的外键约束
ALTER TABLE `learning_records` 
DROP FOREIGN KEY `learning_records_question_id_fkey`;

ALTER TABLE `learning_records` 
DROP FOREIGN KEY `learning_records_video_id_fkey`;

-- 2. 重新添加外键约束（使用CASCADE）
ALTER TABLE `learning_records` 
ADD CONSTRAINT `learning_records_question_id_fkey` 
FOREIGN KEY (`content_id`) 
REFERENCES `questions`(`id`) 
ON DELETE CASCADE 
ON UPDATE NO ACTION;

ALTER TABLE `learning_records` 
ADD CONSTRAINT `learning_records_video_id_fkey` 
FOREIGN KEY (`content_id`) 
REFERENCES `videos`(`id`) 
ON DELETE CASCADE 
ON UPDATE NO ACTION;

-- 3. 验证外键约束
SELECT 
  CONSTRAINT_NAME as '约束名',
  REFERENCED_TABLE_NAME as '引用表',
  DELETE_RULE as '删除规则',
  UPDATE_RULE as '更新规则'
FROM 
  information_schema.REFERENTIAL_CONSTRAINTS
WHERE 
  CONSTRAINT_SCHEMA = 'education_db'
  AND TABLE_NAME = 'learning_records';

-- 应该看到 DELETE_RULE 为 CASCADE

SELECT '✅ 外键约束修复完成！' as '状态';

