-- 删除多态关联的外键约束
-- 这些约束在多态关联中会导致问题
-- 我们在应用层维护数据完整性

-- 删除 question 外键约束
ALTER TABLE `learning_records` DROP FOREIGN KEY `learning_records_question_id_fkey`;

-- 删除 video 外键约束
ALTER TABLE `learning_records` DROP FOREIGN KEY `learning_records_video_id_fkey`;

