@echo off
title UPF Database Import - Interactive Mode
color 0B

echo.
echo ============================================================
echo     UPF University - Interactive Database Import
echo ============================================================
echo.
echo  This will open MySQL and prompt you for password.
echo  Then you'll import the SQL file manually.
echo.
echo  Password: yva22d8HLU
echo.
echo ============================================================
echo.
pause

echo.
echo Opening MySQL connection...
echo When prompted, enter password: yva22d8HLU
echo.
echo After connecting, type this command:
echo   source c:/Users/basir/Documents/upf/PHP/exam final/g_universitaire.sql
echo.
echo Then wait for import to complete.
echo.
echo Press any key to open MySQL...
pause >nul

C:\wamp64\bin\mysql\mysql9.1.0\bin\mysql.exe -h sql7.freesqldatabase.com -u sql7827019 -p

echo.
echo ============================================================
echo  If import was successful, test your connection:
echo.
echo    cd backend
echo    php test-db-connection.php
echo.
echo ============================================================
echo.
pause
