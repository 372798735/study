const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkVideoCategories() {
  console.log("========== 检查视频分类数据 ==========\n");

  try {
    // 1. 检查字典表中的视频分类
    console.log("1. 检查字典表（dictionary）中的 video_category：");
    const categories = await prisma.dictionary.findMany({
      where: { type: "video_category" },
      orderBy: { sort: "asc" },
    });

    if (categories.length === 0) {
      console.log("❌ 没有找到视频分类数据！");
      console.log("\n这是问题的根源！需要添加视频分类。\n");
    } else {
      console.log(`✅ 找到 ${categories.length} 个视频分类：`);
      categories.forEach((cat, index) => {
        console.log(
          `   ${index + 1}. ${cat.label} (value: ${cat.value}, sort: ${cat.sort})`
        );
      });
    }

    // 2. 检查视频表中的视频
    console.log("\n2. 检查视频表（videos）中的视频：");
    const videos = await prisma.video.findMany({
      select: {
        id: true,
        title: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (videos.length === 0) {
      console.log("❌ 没有找到任何视频！");
    } else {
      console.log(`✅ 找到 ${videos.length} 个视频：`);
      videos.forEach((video, index) => {
        console.log(
          `   ${index + 1}. ${video.title} (分类: ${video.category})`
        );
      });
    }

    // 3. 统计每个分类的视频数量
    console.log("\n3. 每个分类的视频数量：");
    const categoryStats = {};
    videos.forEach((video) => {
      if (!categoryStats[video.category]) {
        categoryStats[video.category] = 0;
      }
      categoryStats[video.category]++;
    });

    Object.keys(categoryStats).forEach((category) => {
      console.log(`   ${category}: ${categoryStats[category]} 个视频`);
    });

    // 4. 检查是否有分类不匹配的情况
    console.log("\n4. 检查分类匹配情况：");
    const categoryValues = categories.map((c) => c.value);
    const videoCategoryValues = [...new Set(videos.map((v) => v.category))];

    const unmatchedCategories = videoCategoryValues.filter(
      (vc) => !categoryValues.includes(vc)
    );

    if (unmatchedCategories.length > 0) {
      console.log("⚠️  以下视频分类在字典表中不存在：");
      unmatchedCategories.forEach((cat) => {
        console.log(`   - ${cat}`);
      });
    } else {
      console.log("✅ 所有视频分类都在字典表中存在");
    }

    console.log("\n========== 检查完成 ==========\n");

    // 5. 给出建议
    if (categories.length === 0) {
      console.log("💡 解决方案：");
      console.log("需要在字典表中添加视频分类数据。");
      console.log("运行以下命令：");
      console.log("  node add-video-categories.js");
    } else if (videos.length === 0) {
      console.log("💡 提示：");
      console.log("字典表中有分类，但没有视频。");
      console.log("请在后台管理系统中上传视频。");
    } else {
      console.log("💡 状态：");
      console.log("数据看起来正常。如果小程序还是显示'暂无视频分类'，");
      console.log("请检查：");
      console.log("1. 后端服务器是否正在运行");
      console.log("2. 小程序是否已登录");
      console.log("3. 清除小程序缓存后重试");
    }
  } catch (error) {
    console.error("❌ 检查失败:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkVideoCategories();
