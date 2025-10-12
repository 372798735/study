@echo off
echo 正在修复 Prisma 迁移错误...
echo.

echo [1/4] 删除旧的迁移文件...
rmdir /s /q prisma\migrations 2>nul
echo 完成!
echo.

echo [2/4] 同步数据库模式...
call npx prisma db push --accept-data-loss
echo.

echo [3/4] 生成 Prisma Client...
call npx prisma generate
echo.

echo [4/4] 创建测试用户...
call node create-test-user.js
echo.

echo ================================
echo ✅ 修复完成！
echo ================================
echo.
echo 现在可以启动服务器了：
echo npm run start:dev
echo.
pause

