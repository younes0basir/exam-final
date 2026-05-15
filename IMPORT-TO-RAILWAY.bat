@echo off
title UPF Database Import - Railway.app
color 0A

echo.
echo ============================================================
echo        UPF University - Railway Database Import
echo ============================================================
echo.
echo  Host: switchback.proxy.rlwy.net
echo  Port: 26711
echo  Database: railway
echo  User: root
echo.
echo ============================================================
echo.

set MYSQL_EXE=C:\wamp64\bin\mysql\mysql9.1.0\bin\mysql.exe
set SQL_FILE=c:\Users\basir\Documents\upf\PHP\exam final\g_universitaire.sql

echo Checking files...
if not exist "%MYSQL_EXE%" (
    echo ERROR: MySQL not found
    pause
    exit /b 1
)

if not exist "%SQL_FILE%" (
    echo ERROR: SQL file not found
    pause
    exit /b 1
)

echo [OK] All files found
echo.
echo Starting import to Railway database...
echo This will take 1-2 minutes...
echo.

REM Use PowerShell to pipe the SQL file (PowerShell supports this)
powershell -Command "Get-Content '%SQL_FILE%' | & '%MYSQL_EXE%' -h switchback.proxy.rlwy.net -P 26711 -u root -pcXFCHdBFAdkihIIbbmceLzQoXUFEtxTt railway"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================
    echo                 ✅ IMPORT SUCCESSFUL!
    echo ============================================================
    echo.
    echo Testing connection...
    cd backend
    php test-db-connection.php
    cd ..
    echo.
    echo Press any key to exit...
    pause >nul
) else (
    color 0C
    echo.
    echo ============================================================
    echo                 ❌ IMPORT FAILED
    echo ============================================================
    echo.
    echo Error code: %ERRORLEVEL%
    echo.
    echo Check your internet connection and try again.
    echo.
    pause
)
