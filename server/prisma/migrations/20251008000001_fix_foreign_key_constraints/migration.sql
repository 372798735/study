-- 修复外键约束，允许级联删除
-- Drop existing foreign key constraints
ALTER TABLE `learning_records` 
DROP FOREIGN KEY `learning_records_question_id_fkey`;

ALTER TABLE `learning_records` 
DROP FOREIGN KEY `learning_records_video_id_fkey`;

-- Add foreign key constraints with CASCADE delete
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

