@echo off
echo ===================================
echo 修复外键约束
echo ===================================

echo.
echo 正在执行数据库迁移...
mysql -h localhost -P 3306 -u root -proot education_db < prisma\migrations\20251008000001_fix_foreign_key_constraints\migration.sql

if %errorlevel% neq 0 (
    echo.
    echo 迁移执行失败！请检查MySQL连接或手动执行SQL。
    pause
    exit /b 1
)

echo.
echo 迁移执行成功！
echo.
echo 正在重新生成Prisma客户端...
call npx prisma generate

if %errorlevel% neq 0 (
    echo.
    echo Prisma生成失败！
    pause
    exit /b 1
)

echo.
echo ===================================
echo 修复完成！请重启后端服务。
echo ===================================
echo.
pause

