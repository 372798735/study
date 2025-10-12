@echo off
echo ========================================
echo 完整设置：数据库 + 管理员 + 学生账号
echo ========================================
echo.

echo [1/5] 停止现有进程...
taskkill /F /IM node.exe 2>nul
echo 完成!
echo.

echo [2/5] 同步数据库模式...
call npx prisma db push
echo.

echo [3/5] 生成 Prisma Client...
call npx prisma generate
echo.

echo [4/5] 创建管理员账号（后台管理系统）...
call node create-admin.js
echo.

echo [5/5] 创建学生测试账号（微信小程序）...
call node create-test-user.js
echo.

echo ========================================
echo ✅ 所有设置完成！
echo ========================================
echo.
echo 【后台管理系统登录】
echo 👤 用户名：admin
echo 🔑 密码：admin123
echo 🌐 地址：http://localhost:3001
echo.
echo 【微信小程序登录】
echo 📱 手机号：13800138000
echo 🔑 密码：123456
echo.
echo 现在可以启动服务器：
echo npm run start:dev
echo.
pause

