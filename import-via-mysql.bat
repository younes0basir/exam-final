@echo off
echo ========================================
echo  UPF University System - DB Deployment
echo  Via Command Line (MySQL Client)
echo ========================================
echo.
echo Database: sql7827019
echo Host: sql7.freesqldatabase.com
echo User: sql7827019
echo.
echo This will import g_universitaire.sql to remote database
echo.
pause

echo.
echo Starting database import...
echo This may take 1-2 minutes, please wait...
echo.

mysql -h sql7.freesqldatabase.com -u sql7827019 -pyva22d8HLU sql7827019 < "c:\Users\basir\Documents\upf\PHP\exam final\g_universitaire.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  ✅ SUCCESS! Database imported successfully!
    echo ========================================
    echo.
    echo Now testing connection...
    echo.
    cd backend
    php test-db-connection.php
) else (
    echo.
    echo ========================================
    echo  ❌ FAILED! Import failed with error code: %ERRORLEVEL%
    echo ========================================
    echo.
    echo Possible solutions:
    echo 1. Make sure MySQL is installed and in PATH
    echo 2. Check your internet connection
    echo 3. Verify credentials are correct
    echo 4. Try using phpMyAdmin instead
    echo.
    echo Alternative: Use Laravel migrations:
    echo   cd backend
    echo   php artisan migrate:fresh --seed
    echo.
)

echo.
pause
