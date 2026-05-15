@echo off
title UPF University System - Start All Servers
color 0B

echo.
echo ============================================================
echo        UPF University Management System
echo        Starting Backend and Frontend Servers
echo ============================================================
echo.
echo This will open TWO terminal windows:
echo   1. Backend Server (Laravel API) - Port 8000
echo   2. Frontend Server (React App) - Port 5173
echo.
echo Please keep BOTH windows open while using the application.
echo.
echo ============================================================
echo.

pause

echo.
echo Starting Backend Server...
start "UPF Backend - Laravel API" cmd /k "cd /d c:\Users\basir\Documents\upf\PHP\exam final\backend && php artisan serve"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "UPF Frontend - React App" cmd /k "cd /d c:\Users\basir\Documents\upf\PHP\exam final\frontend && npm run dev"

echo.
echo ============================================================
echo  ✅ Both servers are starting!
echo ============================================================
echo.
echo  Backend: http://localhost:8000
echo  Frontend: http://localhost:5173
echo.
echo  Opening browser in 5 seconds...
echo.
echo  IMPORTANT: Keep both terminal windows OPEN!
echo ============================================================
echo.

timeout /t 5 /nobreak >nul

start http://localhost:5173

echo.
echo Browser opened! You can now login.
echo.
echo Login credentials:
echo   Admin: admin@upf.ma / password
echo   Professor: a.bennani@upf.ma / password
echo   Student: y.alami@student.upf.ma / password
echo.
pause
