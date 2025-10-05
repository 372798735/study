@echo off
echo Cleaning up node_modules...
cd /d "%~dp0"
rmdir /s /q node_modules 2>nul
del /f /q package-lock.json 2>nul
echo Cleanup completed!
echo Now you can run: npm install
pause
