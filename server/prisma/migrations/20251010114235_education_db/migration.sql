/*
  Warnings:

  - You are about to drop the column `duration` on the `videos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `videos` DROP COLUMN `duration`;

-- AlterTable
ALTER TABLE `wrong_books` MODIFY `question_category` VARCHAR(191) NOT NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;
