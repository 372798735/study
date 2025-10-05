import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("开始填充初始数据...");

  // 创建管理员账户
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {
      password: hashedPassword,
    },
    create: {
      username: "admin",
      password: hashedPassword,
      email: "admin@example.com",
    },
  });
  console.log("管理员账户创建成功:", admin.username);
  console.log("用户名: admin, 密码: admin123");

  // 创建示例用户
  const user = await prisma.user.upsert({
    where: { openid: "test_openid_001" },
    update: {},
    create: {
      openid: "test_openid_001",
      nickname: "测试用户",
      avatar: "https://via.placeholder.com/100",
      role: "student",
    },
  });
  console.log("测试用户创建成功:", user.nickname);

  // 创建示例题目
  const questions = await Promise.all([
    prisma.question.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: "什么是JavaScript？",
        content: "JavaScript是一种什么类型的编程语言？",
        type: "single",
        options: {
          A: "编译型语言",
          B: "解释型语言",
          C: "标记语言",
          D: "样式语言",
        },
        answer: "B",
        explanation: "JavaScript是一种解释型编程语言，在浏览器中直接执行。",
        category: "前端基础",
        difficulty: "easy",
        videoUrl: "https://example.com/video1.mp4",
        videoDuration: 300,
      },
    }),
    prisma.question.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: "Vue.js的核心特性",
        content: "Vue.js的核心特性包括哪些？（多选）",
        type: "multiple",
        options: {
          A: "响应式数据绑定",
          B: "组件化开发",
          C: "虚拟DOM",
          D: "双向数据绑定",
        },
        answer: "A,B,C,D",
        explanation: "Vue.js的所有选项都是其核心特性。",
        category: "Vue.js",
        difficulty: "medium",
        videoUrl: "https://example.com/video2.mp4",
        videoDuration: 600,
      },
    }),
    prisma.question.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: "Node.js的优势",
        content: "请简述Node.js的主要优势。",
        type: "essay",
        answer:
          "Node.js的主要优势包括：1. 基于事件驱动和非阻塞I/O模型；2. 使用JavaScript全栈开发；3. 丰富的npm生态系统；4. 高性能和可扩展性。",
        explanation:
          "Node.js通过事件驱动和非阻塞I/O实现了高性能的服务器端开发。",
        category: "Node.js",
        difficulty: "hard",
        videoUrl: "https://example.com/video3.mp4",
        videoDuration: 900,
      },
    }),
  ]);
  console.log(`创建了 ${questions.length} 道题目`);

  // 创建示例视频
  const videos = await Promise.all([
    prisma.video.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: "JavaScript基础入门",
        description: "从零开始学习JavaScript编程语言的基础知识",
        fileUrl: "https://example.com/videos/js-basics.mp4",
        duration: 1800, // 30分钟
        category: "前端基础",
        thumbnailUrl: "https://via.placeholder.com/300x200",
        fileSize: BigInt(50000000), // 50MB
      },
    }),
    prisma.video.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: "Vue.js组件开发",
        description: "深入学习Vue.js组件化开发的最佳实践",
        fileUrl: "https://example.com/videos/vue-components.mp4",
        duration: 2400, // 40分钟
        category: "Vue.js",
        thumbnailUrl: "https://via.placeholder.com/300x200",
        fileSize: BigInt(80000000), // 80MB
      },
    }),
    prisma.video.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: "Node.js后端开发",
        description: "使用Node.js构建高性能的后端服务",
        fileUrl: "https://example.com/videos/node-backend.mp4",
        duration: 3600, // 60分钟
        category: "Node.js",
        thumbnailUrl: "https://via.placeholder.com/300x200",
        fileSize: BigInt(120000000), // 120MB
      },
    }),
  ]);
  console.log(`创建了 ${videos.length} 个视频`);

  // 创建示例学习记录
  const learningRecords = await Promise.all([
    prisma.learningRecord.create({
      data: {
        userId: user.id,
        contentId: 1,
        contentType: "question",
        progress: 100,
        score: 85,
        completedAt: new Date(),
      },
    }),
    prisma.learningRecord.create({
      data: {
        userId: user.id,
        contentId: 1,
        contentType: "video",
        progress: 75,
      },
    }),
  ]);
  console.log(`创建了 ${learningRecords.length} 条学习记录`);

  console.log("初始数据填充完成！");
}

main()
  .catch((e) => {
    console.error("填充数据时出错:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
