-- AlterTable
ALTER TABLE `questions` ADD COLUMN `question_category` VARCHAR(191) NOT NULL DEFAULT 'objective' AFTER `type`;

