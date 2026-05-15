# 🚀 Database Deployment Guide - FreeSQLDatabase.com

## 📋 Database Credentials

```
Host: sql7.freesqldatabase.com
Database: sql7827019
Username: sql7827019
Password: yva22d8HLU
Port: 3306
```

---

## 🎯 Deployment Steps

### Option 1: Using phpMyAdmin (Recommended)

1. **Access phpMyAdmin**
   - Go to: http://sql7.freesqldatabase.com/
   - Login with your credentials above

2. **Select Database**
   - Click on database `sql7827019` from the left sidebar

3. **Import SQL File**
   - Click on the **"Import"** tab at the top
   - Click **"Choose File"** button
   - Select the file: `g_universitaire.sql` from your project
   - Make sure format is set to **SQL**
   - Click **"Go"** button at the bottom

4. **Wait for Completion**
   - The import may take 1-2 minutes
   - You should see a success message when complete

5. **Verify Tables**
   - Check that all tables are created in the left sidebar
   - Expected tables: users, filieres, groupes, modules, notes, absences, etc.

---

### Option 2: Using MySQL Command Line

If you have MySQL client installed:

```bash
mysql -h sql7.freesqldatabase.com -u sql7827019 -p sql7827019 < g_universitaire.sql
```

When prompted, enter password: `yva22d8HLU`

---

### Option 3: Using Laravel Migrations (Alternative)

Instead of importing the SQL dump, you can use Laravel migrations:

1. **Update `.env` file** with remote database credentials (see below)

2. **Run migrations:**
```bash
cd backend
php artisan migrate:fresh --seed
```

⚠️ **Note:** This will create empty tables and seed them with fresh data from DatabaseSeeder.php

---

## 🔧 Update Backend Configuration

After deploying the database, update your Laravel `.env` file:

### Current (.env):
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=G_universitaire
DB_USERNAME=root
DB_PASSWORD=
```

### Change to:
```env
DB_CONNECTION=mysql
DB_HOST=sql7.freesqldatabase.com
DB_PORT=3306
DB_DATABASE=sql7827019
DB_USERNAME=sql7827019
DB_PASSWORD=yva22d8HLU
```

Then clear config cache:
```bash
cd backend
php artisan config:clear
php artisan cache:clear
```

---

## ✅ Verification Checklist

After deployment, verify everything works:

### 1. Test Database Connection
```bash
cd backend
php artisan tinker
```
```php
DB::connection()->getPdo();
// Should return PDO object without errors
exit;
```

### 2. Check Tables Exist
In phpMyAdmin, you should see these tables:
- ✅ users
- ✅ filieres
- ✅ groupes
- ✅ modules
- ✅ module_professor (pivot)
- ✅ student_group (pivot)
- ✅ notes
- ✅ emplois_du_temps
- ✅ salles
- ✅ absences
- ✅ cahier_textes
- ✅ classroom_documents
- ✅ classroom_annonces
- ✅ classroom_commentaires
- ✅ demandes_administratives
- ✅ reservation_salles
- ✅ cache
- ✅ cache_locks
- ✅ jobs
- ✅ job_batches
- ✅ failed_jobs
- ✅ personal_access_tokens
- ✅ sessions

### 3. Test API Connection
```bash
# Start Laravel server
cd backend
php artisan serve

# Test login endpoint
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@upf.ma","password":"password"}'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "token": "...",
    "user": {...}
  }
}
```

---

## ⚠️ Important Notes

### FreeSQLDatabase Limitations:
1. **Storage Limit**: Usually 100MB max
2. **Connection Limit**: Limited concurrent connections
3. **No SSH Access**: Only phpMyAdmin and MySQL protocol
4. **Backup**: Regularly backup your database
5. **Performance**: May be slower than local development

### Security Recommendations:
1. **Change Default Passwords** after first login
2. **Don't commit `.env` file** to Git (it's already in .gitignore)
3. **Use HTTPS** for production frontend
4. **Enable CORS** properly in `backend/config/cors.php`

### If Import Fails:
1. **Check file size** - FreeSQLDatabase has upload limits
2. **Split SQL file** if too large:
   ```bash
   # Split into schema and data
   # First import structure only
   # Then import data separately
   ```
3. **Remove DROP TABLE statements** if tables already exist
4. **Check for syntax errors** in SQL file

---

## 🔄 Backup Your Database

### Export from phpMyAdmin:
1. Select database `sql7827019`
2. Click **"Export"** tab
3. Choose **"Quick"** method
4. Format: **SQL**
5. Click **"Go"**
6. Save the `.sql` file locally

### Or using command line:
```bash
mysqldump -h sql7.freesqldatabase.com -u sql7827019 -p sql7827019 > backup_$(date +%Y%m%d).sql
```

---

## 🌐 Deploy Frontend & Backend

### Backend (Laravel API):
You'll need to host the Laravel backend on a server that supports PHP 8.4+:
- Options: Heroku, DigitalOcean, AWS, Hostinger, etc.
- Upload all backend files except `vendor/` and `node_modules/`
- Run `composer install` on the server
- Configure `.env` with production settings
- Set `APP_DEBUG=false` in production

### Frontend (React):
Build and deploy the React app:
```bash
cd frontend
npm run build
```
Deploy the `dist/` folder to:
- Netlify
- Vercel
- GitHub Pages
- Or any static hosting service

Update `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

---

## 🆘 Troubleshooting

### Error: "Access denied for user"
- Double-check username and password
- Ensure you're using the correct host: `sql7.freesqldatabase.com`

### Error: "Can't connect to MySQL server"
- Check if your IP is allowed (some hosts require whitelisting)
- Verify port 3306 is not blocked by firewall

### Error: "Table already exists"
- The SQL file has `DROP TABLE IF EXISTS` statements
- This should handle existing tables
- If issues persist, manually drop tables in phpMyAdmin first

### Error: "Max execution time exceeded"
- FreeSQLDatabase has timeout limits
- Try importing smaller chunks of data
- Or use Laravel migrations instead

### CORS Errors (Frontend can't connect to API):
Update `backend/config/cors.php`:
```php
'allowed_origins' => [
    'http://localhost:5173',  // Dev
    'https://your-frontend-domain.com',  // Production
],
```

---

## 📞 Support

If you encounter issues:
1. Check FreeSQLDatabase documentation
2. Verify your account is active
3. Contact their support team
4. Review Laravel logs: `backend/storage/logs/laravel.log`

---

**Good luck with your deployment! 🎉**
