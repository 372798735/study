@echo off
echo ========================================
echo 设置微信小程序登录功能
echo ========================================
echo.

echo [1/4] 停止现有进程...
taskkill /F /IM node.exe 2>nul
echo 完成!
echo.

echo [2/4] 同步数据库模式...
call npx prisma db push
echo.

echo [3/4] 生成 Prisma Client...
call npx prisma generate
echo.

echo [4/4] 创建测试用户...
call node create-test-user.js
echo.

echo ========================================
echo ✅ 设置完成！
echo ========================================
echo.
echo 测试账号信息：
echo 📱 手机号：13800138000
echo 🔑 密码：123456
echo.
echo 后台管理登录：
echo 👤 用户名：admin
echo 🔑 密码：admin123
echo.
echo 现在可以启动服务器：
echo npm run start:dev
echo.
pause

