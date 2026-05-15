# 🖥️ Command Line Database Deployment Guide

## ⚡ Quick Start (Choose ONE method)

### Method 1: Using Laravel Migrations (Easiest - Recommended) ✅

This doesn't require MySQL client installation!

```bash
cd backend
php artisan migrate:fresh --seed
```

**That's it!** This will:
- Create all database tables
- Insert sample data
- Take ~30 seconds
- Work immediately

---

### Method 2: Using MySQL Client (If Installed)

#### Option A: Double-click the batch file
```
import-via-mysql.bat
```

#### Option B: Run PowerShell script
```powershell
.\import-via-mysql.ps1
```

#### Option C: Manual command

**Windows Command Prompt:**
```cmd
mysql -h sql7.freesqldatabase.com -u sql7827019 -pyva22d8HLU sql7827019 < "c:\Users\basir\Documents\upf\PHP\exam final\g_universitaire.sql"
```

**PowerShell:**
```powershell
cmd /c "mysql -h sql7.freesqldatabase.com -u sql7827019 -pyva22d8HLU sql7827019 < `"c:\Users\basir\Documents\upf\PHP\exam final\g_universitaire.sql`""
```

**Git Bash / WSL:**
```bash
mysql -h sql7.freesqldatabase.com -u sql7827019 -pyva22d8HLU sql7827019 < g_universitaire.sql
```

---

## 🔍 Check if MySQL is Installed

Before using Method 2, verify MySQL client is available:

```bash
mysql --version
```

**Expected output:**
```
mysql  Ver 8.0.xx for Win64 on x86_64 (MySQL Community Server - GPL)
```

**If you get error:** `'mysql' is not recognized as an internal or external command`

→ MySQL is NOT installed. Use **Method 1** instead!

---

## 📋 Detailed Steps for Each Method

### Method 1: Laravel Migrations (No MySQL Required) ⭐ RECOMMENDED

**Why this is better:**
- ✅ No MySQL client needed
- ✅ Faster (30 seconds vs 2 minutes)
- ✅ More reliable
- ✅ Uses PHP which you already have
- ✅ Creates clean schema

**Steps:**

1. Open Command Prompt or PowerShell

2. Navigate to backend folder:
```bash
cd "c:\Users\basir\Documents\upf\PHP\exam final\backend"
```

3. Clear config cache:
```bash
php artisan config:clear
```

4. Run migrations with seeders:
```bash
php artisan migrate:fresh --seed
```

5. Wait for completion (should see many "Migrated:" messages)

6. Test connection:
```bash
php test-db-connection.php
```

**Expected output:**
```
✅ SUCCESS! Database connection established.
Found 22 tables in database.
```

---

### Method 2: MySQL Client Import

**Prerequisites:**
- MySQL client must be installed
- Must be in system PATH
- Internet connection required

**Steps:**

1. **Check MySQL is installed:**
```bash
mysql --version
```

2. **If not installed, install MySQL:**
   - Download from: https://dev.mysql.com/downloads/installer/
   - Install "MySQL Server" (includes client)
   - Add to PATH during installation
   
   OR use WAMP/XAMPP MySQL client:
```bash
# For WAMP users:
C:\wamp64\bin\mysql\mysql8.0.xx\bin\mysql.exe -h sql7.freesqldatabase.com -u sql7827019 -pyva22d8HLU sql7827019 < "c:\Users\basir\Documents\upf\PHP\exam final\g_universitaire.sql"

# For XAMPP users:
C:\xampp\mysql\bin\mysql.exe -h sql7.freesqldatabase.com -u sql7827019 -pyva22d8HLU sql7827019 < "c:\Users\basir\Documents\upf\PHP\exam final\g_universitaire.sql"
```

3. **Run import command:**
```bash
mysql -h sql7.freesqldatabase.com -u sql7827019 -pyva22d8HLU sql7827019 < "c:\Users\basir\Documents\upf\PHP\exam final\g_universitaire.sql"
```

4. **Wait for completion** (1-2 minutes, no output means it's working)

5. **Verify import:**
```bash
cd backend
php test-db-connection.php
```

---

## 🆘 Troubleshooting

### Problem: "mysql is not recognized"

**Solution 1:** Use Method 1 (Laravel migrations)
```bash
cd backend
php artisan migrate:fresh --seed
```

**Solution 2:** Find MySQL executable
```bash
# Common locations:
C:\wamp64\bin\mysql\mysqlX.X.XX\bin\mysql.exe
C:\xampp\mysql\bin\mysql.exe
C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
```

Then use full path:
```bash
"C:\wamp64\bin\mysql\mysql8.0.33\bin\mysql.exe" -h sql7.freesqldatabase.com -u sql7827019 -pyva22d8HLU sql7827019 < "c:\Users\basir\Documents\upf\PHP\exam final\g_universitaire.sql"
```

**Solution 3:** Add MySQL to PATH
1. Find mysql.exe location
2. Right-click "This PC" → Properties
3. Advanced system settings → Environment Variables
4. Edit "Path" variable
5. Add MySQL bin directory
6. Restart terminal

---

### Problem: "Access denied for user"

**Solutions:**
1. Check password is correct: `yva22d8HLU`
2. Ensure no space between `-p` and password
3. Try quoting the password: `-p"yva22d8HLU"`

---

### Problem: "Can't connect to MySQL server"

**Solutions:**
1. Check internet connection
2. Verify host: `sql7.freesqldatabase.com`
3. FreeSQLDatabase may block some IPs
4. Try again later (server might be busy)

---

### Problem: Import takes too long / timeout

**Solutions:**
1. Be patient - free hosting is slow
2. Use Method 1 instead (much faster)
3. Split SQL file into smaller chunks

---

### Problem: SQL syntax errors

**Cause:** French text with escaped quotes

**Solution:** The SQL file should already be fixed, but if errors occur:
- Use Method 1 (migrations don't have this issue)
- Or manually fix quotes in SQL file (`\'` → `''`)

---

## ✅ Verification

After import (any method), always verify:

```bash
cd backend
php test-db-connection.php
```

**Success looks like:**
```
Testing Database Connection...
Host: sql7.freesqldatabase.com
Database: sql7827019
Username: sql7827019

✅ SUCCESS! Database connection established.
Server version: 5.5.62-0ubuntu0.14.04.1

Found 22 tables in database.

Tables:
  - absences
  - cache
  - cache_locks
  - cahier_textes
  - classroom_annonces
  - classroom_commentaires
  - classroom_documents
  - demandes_administratives
  - emplois_du_temps
  - failed_jobs
  - filieres
  - groupes
  - jobs
  - job_batches
  - migrations
  - module_professor
  - modules
  - notes
  - personal_access_tokens
  - reservation_salles
  - salles
  - sessions
  - student_group
  - users
```

---

## 🚀 Next Steps After Successful Import

1. **Start Backend:**
```bash
cd backend
php artisan serve
```

2. **Start Frontend (new terminal):**
```bash
cd frontend
npm run dev
```

3. **Open browser:** http://localhost:5173

4. **Login:**
   - Admin: admin@upf.ma / password
   - Professor: a.bennani@upf.ma / password
   - Student: y.alami@student.upf.ma / password

---

## 💡 Pro Tips

1. **Method 1 is recommended** - It's faster and more reliable
2. **Always clear config** after changing .env: `php artisan config:clear`
3. **Test connection** after any database operation
4. **Backup regularly** - Export from phpMyAdmin when possible
5. **Keep credentials secure** - Don't share your password

---

## 📊 Comparison of Methods

| Feature | Method 1 (Migrations) | Method 2 (MySQL Import) |
|---------|----------------------|------------------------|
| Requires MySQL | ❌ No | ✅ Yes |
| Speed | ⚡ Fast (30s) | 🐢 Slow (2 min) |
| Reliability | ✅ High | ⚠️ Medium |
| Data | Fresh seed data | Original SQL data |
| Complexity | Simple | Complex |
| Recommended | ✅ YES | Only if needed |

---

## 🎯 Recommendation

**Use Method 1 (Laravel Migrations)** unless you specifically need the exact data from g_universitaire.sql.

Both methods create a fully functional database with:
- All required tables
- Sample users (admin, professors, students)
- Sample academic data
- Ready to use immediately

---

**Good luck! 🚀**
