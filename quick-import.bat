@echo off
echo ========================================
echo  UPF Database - Quick Import via CMD
echo ========================================
echo.
echo This uses your WAMP/XAMPP MySQL client
echo to import directly to FreeSQLDatabase
echo.

REM Try common MySQL locations
set MYSQL_PATH=

if exist "C:\wamp64\bin\mysql" (
    for /d %%i in (C:\wamp64\bin\mysql\*) do set MYSQL_PATH=%%i\bin\mysql.exe
)

if exist "C:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe
)

if "%MYSQL_PATH%"=="" (
    echo Checking if mysql is in PATH...
    where mysql >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        set MYSQL_PATH=mysql
    ) else (
        echo.
        echo ERROR: MySQL client not found!
        echo.
        echo Please install MySQL or use one of these options:
        echo 1. Install WAMP/XAMPP
        echo 2. Use Laravel migrations (if database space allows)
        echo 3. Use phpMyAdmin web interface
        echo.
        pause
        exit /b 1
    )
)

echo Found MySQL at: %MYSQL_PATH%
echo.
echo Starting import...
echo This will take 1-2 minutes...
echo.

"%MYSQL_PATH%" -h sql7.freesqldatabase.com -u sql7827019 -pyva22d8HLU sql7827019 < "c:\Users\basir\Documents\upf\PHP\exam final\g_universitaire.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  SUCCESS! Database imported!
    echo ========================================
    echo.
    echo Testing connection...
    cd backend
    php test-db-connection.php
) else (
    echo.
    echo ========================================
    echo  Import failed with error: %ERRORLEVEL%
    echo ========================================
    echo.
    echo Possible causes:
    echo 1. Database storage limit reached (free tier = 100MB)
    echo 2. Network timeout
    echo 3. Invalid credentials
    echo.
    echo Try again or contact FreeSQLDatabase support
)

echo.
pause
