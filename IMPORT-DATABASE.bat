@echo off
title UPF Database Import
color 0A

echo.
echo ============================================================
echo           UPF University - Database Import Tool
echo ============================================================
echo.
echo  MySQL Host: sql7.freesqldatabase.com
echo  Database: sql7827019
echo  Using WAMP MySQL Client
echo.
echo ============================================================
echo.

set MYSQL_EXE=C:\wamp64\bin\mysql\mysql9.1.0\bin\mysql.exe
set SQL_FILE=c:\Users\basir\Documents\upf\PHP\exam final\g_universitaire.sql

echo Checking MySQL...
if not exist "%MYSQL_EXE%" (
    echo ERROR: MySQL not found at %MYSQL_EXE%
    echo.
    pause
    exit /b 1
)
echo [OK] MySQL found
echo.

echo Checking SQL file...
if not exist "%SQL_FILE%" (
    echo ERROR: SQL file not found at %SQL_FILE%
    echo.
    pause
    exit /b 1
)
echo [OK] SQL file found
echo.

echo Starting import...
echo This will take 1-2 minutes. Please wait...
echo.
echo [Progress] Importing database tables and data...
echo.

"%MYSQL_EXE%" -h sql7.freesqldatabase.com -u sql7827019 -pyva22d8HLU sql7827019 < "%SQL_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================
    echo                    IMPORT SUCCESSFUL!
    echo ============================================================
    echo.
    echo  Database has been imported successfully.
    echo.
    echo  Next steps:
    echo  1. Test connection: php test-db-connection.php
    echo  2. Start backend: php artisan serve
    echo  3. Start frontend: npm run dev (in frontend folder)
    echo.
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
    echo                    IMPORT FAILED!
    echo ============================================================
    echo.
    echo  Error code: %ERRORLEVEL%
    echo.
    echo  Possible causes:
    echo  1. Database storage limit reached (100MB free tier)
    echo  2. Network timeout or connection issue
    echo  3. Invalid credentials
    echo  4. FreeSQLDatabase server is busy
    echo.
    echo  Solutions:
    echo  1. Try again in a few minutes
    echo  2. Clear database first via phpMyAdmin
    echo  3. Use interactive mode (see FINAL_SOLUTION.md)
    echo  4. Consider upgrading to paid plan
    echo.
    echo ============================================================
    echo.
    echo Press any key to exit...
    pause >nul
)
