# 🚀 Quick Deployment Checklist

## ✅ Database Credentials (Save This!)

```
Host:     sql7.freesqldatabase.com
Database: sql7827019
Username: sql7827019
Password: yva22d8HLU
Port:     3306
phpMyAdmin: http://sql7.freesqldatabase.com/
```

---

## 📝 Deployment Steps (5 Minutes)

### 1️⃣ Import Database via phpMyAdmin

1. Open browser → http://sql7.freesqldatabase.com/
2. Login with credentials above
3. Click on database `sql7827019` (left sidebar)
4. Click **Import** tab (top menu)
5. Click **Choose File** → Select `g_universitaire.sql`
6. Click **Go** button
7. Wait for success message ✅

### 2️⃣ Verify Import

Check these tables exist in phpMyAdmin:
- users
- filieres
- groupes
- modules
- notes
- absences
- emplois_du_temps
- salles

### 3️⃣ Test Connection

```bash
cd backend
php artisan config:clear
php artisan tinker
```

In tinker:
```php
DB::connection()->getPdo();
// Should show PDO object
exit;
```

### 4️⃣ Start Backend

```bash
cd backend
php artisan serve
```

Test login:
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@upf.ma","password":"password"}'
```

### 5️⃣ Start Frontend

```bash
cd frontend
npm run dev
```

Open: http://localhost:5173

---

## 🔑 Default Login Credentials

**Admin:**
- Email: admin@upf.ma
- Password: password

**Professor:**
- Email: a.bennani@upf.ma
- Password: password

**Student:**
- Email: y.alami@student.upf.ma
- Password: password

---

## ⚠️ Important Notes

✅ `.env` file already updated with remote DB credentials  
✅ SQL file ready to import: `g_universitaire.sql`  
✅ All migrations and seeders included in SQL dump  

❌ Don't share your database password publicly  
❌ Don't commit `.env` file to Git  
❌ FreeSQLDatabase has 100MB storage limit  

---

## 🆘 If Something Goes Wrong

**Can't connect to database?**
```bash
php artisan config:clear
php artisan cache:clear
```

**Import fails in phpMyAdmin?**
- Check file size (should be under upload limit)
- Try removing `DROP TABLE` statements if tables exist
- Or use Laravel migrations: `php artisan migrate:fresh --seed`

**CORS errors from frontend?**
Update `backend/config/cors.php`:
```php
'allowed_origins' => ['http://localhost:5173'],
```

---

## 📞 Need Help?

1. Check `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Review Laravel logs: `backend/storage/logs/laravel.log`
3. Test API at: http://localhost:8000/api-docs.html

---

**You're all set! Good luck! 🎉**
