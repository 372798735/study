-- 添加字典表
CREATE TABLE `dictionaries` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(191) NOT NULL,
  `label` VARCHAR(191) NOT NULL,
  `value` VARCHAR(191) NOT NULL,
  `sort` INT NOT NULL DEFAULT 0,
  `status` VARCHAR(191) NOT NULL DEFAULT 'active',
  `remark` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `dictionaries_type_value_key` (`type`, `value`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 题目表添加字段
ALTER TABLE `questions` 
ADD COLUMN `exam_type` VARCHAR(191) NULL AFTER `question_category`,
ADD COLUMN `paper_name` VARCHAR(191) NULL AFTER `exam_type`;

-- 插入试卷名称示例数据
INSERT INTO `dictionaries` (`type`, `label`, `value`, `sort`, `status`, `updated_at`) VALUES
('paper_name', '2024年全国统一考试卷一', '2024_national_1', 1, 'active', NOW()),
('paper_name', '2024年全国统一考试卷二', '2024_national_2', 2, 'active', NOW()),
('paper_name', '2023年全国统一考试卷一', '2023_national_1', 3, 'active', NOW()),
('paper_name', '模拟卷第一套', 'mock_1', 4, 'active', NOW()),
('paper_name', '模拟卷第二套', 'mock_2', 5, 'active', NOW()),
('paper_name', '专题训练-函数', 'special_function', 6, 'active', NOW()),
('paper_name', '专题训练-几何', 'special_geometry', 7, 'active', NOW());

