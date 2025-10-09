-- CreateTable
CREATE TABLE `wrong_books` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `question_category` VARCHAR(50) NOT NULL COMMENT '题目分类: objective(客观题), subjective(主观题)',
    `user_answer` TEXT NULL COMMENT '用户的错误答案',
    `note` TEXT NULL COMMENT '笔记',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `wrong_books_user_id_idx`(`user_id`),
    INDEX `wrong_books_question_id_idx`(`question_id`),
    INDEX `wrong_books_question_category_idx`(`question_category`),
    UNIQUE INDEX `wrong_books_user_id_question_id_key`(`user_id`, `question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `wrong_books` ADD CONSTRAINT `wrong_books_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wrong_books` ADD CONSTRAINT `wrong_books_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

