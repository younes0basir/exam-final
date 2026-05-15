@echo off
title UPF Database Import - Fixed Auth
color 0A

echo.
echo ============================================================
echo        UPF University - Database Import (Fixed)
echo ============================================================
echo.
echo  Fixing authentication plugin issue...
echo  Using --default-auth=mysql_native_password
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
echo Starting import with fixed authentication...
echo This will take 1-2 minutes...
echo.

REM Try with default authentication plugin
"%MYSQL_EXE%" --default-auth=mysql_native_password -h sql7.freesqldatabase.com -u sql7827019 -pyva22d8HLU sql7827019 < "%SQL_FILE%"

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
    echo.
    echo First method failed. Trying alternative...
    echo.
    
    REM Try without specifying auth plugin but with secure auth disabled
    "%MYSQL_EXE%" --secure-auth=OFF -h sql7.freesqldatabase.com -u sql7827019 -pyva22d8HLU sql7827019 < "%SQL_FILE%"
    
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
    ) else (
        color 0C
        echo.
        echo ============================================================
        echo                 ❌ IMPORT FAILED
        echo ============================================================
        echo.
        echo The authentication issue persists.
        echo.
        echo SOLUTION: Use interactive mode instead:
        echo.
        echo 1. Run this command:
        echo    %MYSQL_EXE% -h sql7.freesqldatabase.com -u sql7827019 -p
        echo.
        echo 2. Enter password when prompted: yva22d8HLU
        echo.
        echo 3. At mysql^> prompt, type:
        echo    source c:/Users/basir/Documents/upf/PHP/exam final/g_universitaire.sql
        echo.
        echo 4. Wait for completion
        echo.
        echo ============================================================
    )
    echo.
    echo Press any key to exit...
    pause >nul
)
