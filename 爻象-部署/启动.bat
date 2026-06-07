@echo off
cd /d "%~dp0"
echo 爻象 AI命理大师 - 本地启动
echo ============================
echo.
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo [错误] 未找到 Node.js，请先安装 https://nodejs.org
  echo.
  pause
  exit /b 1
)
echo Node.js 已检测到
echo 服务地址: http://localhost:8765
echo 按 Ctrl+C 停止服务
echo.
node server.js
pause
