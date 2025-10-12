const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("正在创建测试用户...\n");

  // 创建测试用户
  const password = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { phone: "13800138000" },
    update: {
      password,
      nickname: "测试用户",
    },
    create: {
      phone: "13800138000",
      password,
      nickname: "测试用户",
    },
  });

  console.log("✅ 测试用户创建/更新成功！");
  console.log("─────────────────────────");
  console.log("📱 手机号：13800138000");
  console.log("🔑 密码：123456");
  console.log("👤 昵称：测试用户");
  console.log("🆔 用户ID：", user.id);
  console.log("─────────────────────────\n");
}

main()
  .catch((e) => {
    console.error("❌ 创建用户失败:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
