@echo off
echo ========================================
echo  UPF University System - DB Deployment
echo ========================================
echo.
echo Database: sql7827019
echo Host: sql7.freesqldatabase.com
echo.
echo This script will help you deploy the database.
echo.
pause

echo.
echo Step 1: Testing database connection...
echo.

cd backend
php artisan tinker --execute="try { DB::connection()->getPdo(); echo 'Connection successful!'; } catch (Exception $e) { echo 'Connection failed: ' . $e->getMessage(); }"

echo.
echo If connection is successful, you can now import the SQL file via phpMyAdmin.
echo.
echo Steps to import:
echo 1. Go to http://sql7.freesqldatabase.com/
echo 2. Login with your credentials
echo 3. Select database: sql7827019
echo 4. Click Import tab
echo 5. Choose file: g_universitaire.sql
echo 6. Click Go
echo.
pause
