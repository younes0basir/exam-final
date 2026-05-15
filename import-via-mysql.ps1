# UPF University System - Database Import via PowerShell
# This script imports g_universitaire.sql to remote MySQL database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " UPF University System - DB Deployment" -ForegroundColor Cyan
Write-Host " Via Command Line (MySQL Client)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database: sql7827019" -ForegroundColor Yellow
Write-Host "Host: sql7.freesqldatabase.com" -ForegroundColor Yellow
Write-Host "User: sql7827019" -ForegroundColor Yellow
Write-Host ""
Write-Host "This will import g_universitaire.sql to remote database" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Press Enter to continue or 'q' to quit"
if ($continue -eq 'q') { exit }

Write-Host ""
Write-Host "Starting database import..." -ForegroundColor Green
Write-Host "This may take 1-2 minutes, please wait..." -ForegroundColor Green
Write-Host ""

# Path to SQL file
$sqlFile = "c:\Users\basir\Documents\upf\PHP\exam final\g_universitaire.sql"

# Check if file exists
if (-Not (Test-Path $sqlFile)) {
    Write-Host "❌ ERROR: SQL file not found at: $sqlFile" -ForegroundColor Red
    pause
    exit 1
}

# MySQL command
$mysqlCommand = "mysql"
$mysqlArgs = @(
    "-h", "sql7.freesqldatabase.com",
    "-u", "sql7827019",
    "-pyva22d8HLU",
    "sql7827019",
    "<", "`"$sqlFile`""
)

# Try to execute
try {
    # Using cmd to handle the redirect properly
    $cmdCommand = "cmd /c `"mysql -h sql7.freesqldatabase.com -u sql7827019 -pyva22d8HLU sql7827019 < `"$sqlFile`"`""
    
    Write-Host "Executing: mysql -h sql7.freesqldatabase.com -u sql7827019 -p*** sql7827019" -ForegroundColor Gray
    Write-Host ""
    
    Invoke-Expression $cmdCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host " ✅ SUCCESS! Database imported successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Now testing connection..." -ForegroundColor Cyan
        Write-Host ""
        
        # Test connection
        Set-Location backend
        php test-db-connection.php
        Set-Location ..
    } else {
        throw "MySQL returned error code: $LASTEXITCODE"
    }
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host " ❌ FAILED! Import failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible solutions:" -ForegroundColor Yellow
    Write-Host "1. Make sure MySQL is installed and in PATH" -ForegroundColor White
    Write-Host "   Check by running: mysql --version" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Check your internet connection" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Verify credentials are correct" -ForegroundColor White
    Write-Host ""
    Write-Host "4. Try using Laravel migrations instead:" -ForegroundColor White
    Write-Host "   cd backend" -ForegroundColor Gray
    Write-Host "   php artisan migrate:fresh --seed" -ForegroundColor Gray
    Write-Host ""
}

Write-Host ""
pause
