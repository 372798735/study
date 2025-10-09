/*
  Warnings:

  - A unique constraint covering the columns `[user_id,content_id,content_type]` on the table `learning_records` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `learning_records` DROP FOREIGN KEY `learning_records_user_id_fkey`;

-- DropIndex
DROP INDEX `learning_records_video_id_fkey` ON `learning_records`;

-- CreateIndex
CREATE UNIQUE INDEX `learning_records_user_id_content_id_content_type_key` ON `learning_records`(`user_id`, `content_id`, `content_type`);

-- AddForeignKey
ALTER TABLE `learning_records` ADD CONSTRAINT `learning_records_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `learning_records` ADD CONSTRAINT `learning_records_question_id_fkey` FOREIGN KEY (`content_id`) REFERENCES `questions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `learning_records` ADD CONSTRAINT `learning_records_video_id_fkey` FOREIGN KEY (`content_id`) REFERENCES `videos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
