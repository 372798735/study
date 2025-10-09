-- AlterTable
ALTER TABLE `wrong_books` MODIFY `question_category` VARCHAR(191) NOT NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;
