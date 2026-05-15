@echo off
title Prepare Backend for Render Deployment
color 0A

echo.
echo ============================================================
echo     UPF Backend - Preparation for Render Deployment
echo ============================================================
echo.

cd backend

echo Step 1: Checking Git status...
git status
echo.

echo Step 2: Adding all files to Git...
git add .
echo.

echo Step 3: Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Prepare for Render deployment

git commit -m "%commit_msg%"
echo.

echo Step 4: Checking remote repository...
git remote -v
echo.

set /p push_confirm="Push to GitHub? (y/n): "
if /i "%push_confirm%"=="y" (
    echo.
    echo Pushing to GitHub...
    git push origin main
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ============================================================
        echo  ✅ SUCCESS! Code pushed to GitHub
        echo ============================================================
        echo.
        echo  Next steps:
        echo  1. Go to https://render.com
        echo  2. Create new Web Service
        echo  3. Connect your GitHub repository
        echo  4. Render will detect render.yaml automatically
        echo  5. Add DB_PASSWORD environment variable
        echo  6. Deploy!
        echo.
        echo  Documentation: DEPLOYMENT-RENDER.md
        echo.
    ) else (
        echo.
        echo ============================================================
        echo  ❌ Push failed! Check your Git configuration
        echo ============================================================
        echo.
    )
) else (
    echo.
    echo ============================================================
    echo  Changes committed but not pushed
    echo ============================================================
    echo.
    echo  To push later: git push origin main
    echo.
)

pause
