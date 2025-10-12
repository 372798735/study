const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addVideoCategories() {
  console.log("========== 添加视频分类数据 ==========\n");

  const categories = [
    { value: "三角函数", label: "三角函数", sort: 1 },
    { value: "数列", label: "数列", sort: 2 },
    { value: "圆锥曲线", label: "圆锥曲线", sort: 3 },
    { value: "函数与导数", label: "函数与导数", sort: 4 },
    { value: "空间向量与立体几何", label: "空间向量与立体几何", sort: 5 },
    { value: "概率与统计", label: "概率与统计", sort: 6 },
  ];

  try {
    console.log("正在添加视频分类...\n");

    for (const category of categories) {
      const result = await prisma.dictionary.upsert({
        where: {
          type_value: {
            type: "video_category",
            value: category.value,
          },
        },
        update: {
          label: category.label,
          sort: category.sort,
        },
        create: {
          type: "video_category",
          value: category.value,
          label: category.label,
          sort: category.sort,
        },
      });

      console.log(`✅ ${category.label} (sort: ${category.sort})`);
    }

    console.log("\n========== 添加完成 ==========\n");

    // 验证添加结果
    const allCategories = await prisma.dictionary.findMany({
      where: { type: "video_category" },
      orderBy: { sort: "asc" },
    });

    console.log(`共有 ${allCategories.length} 个视频分类：`);
    allCategories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.label}`);
    });

    console.log("\n✨ 现在可以在小程序中看到视频分类了！");
    console.log("\n📱 测试步骤：");
    console.log("1. 在微信开发者工具中重新编译小程序");
    console.log("2. 登录账号");
    console.log("3. 点击首页的【学习视频】");
    console.log("4. 应该能看到所有6个分类");
    console.log("5. 点击【三角函数】，应该能看到你上传的2个视频\n");
  } catch (error) {
    console.error("❌ 添加失败:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addVideoCategories();
