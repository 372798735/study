const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("正在创建/更新管理员账号...\n");

  // 创建管理员账户
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {
      password: hashedPassword,
      email: "admin@example.com",
    },
    create: {
      username: "admin",
      password: hashedPassword,
      email: "admin@example.com",
    },
  });

  console.log("✅ 管理员账号创建/更新成功！");
  console.log("─────────────────────────");
  console.log("👤 用户名：admin");
  console.log("🔑 密码：admin123");
  console.log("📧 邮箱：admin@example.com");
  console.log("🆔 ID：", admin.id);
  console.log("─────────────────────────\n");

  console.log("现在可以使用该账号登录后台管理系统了！");
}

main()
  .catch((e) => {
    console.error("❌ 创建管理员失败:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
