# 🚀 Quick Start Guide - UPF University System

## ⚡ Starting Your Application

You need **TWO terminals** running simultaneously:

---

### Terminal 1 - Backend (Laravel API)

```bash
cd "c:\Users\basir\Documents\upf\PHP\exam final\backend"
php artisan serve
```

**Expected output:**
```
INFO  Server running on [http://127.0.0.1:8000].
  Press Ctrl+C to stop the server
```

✅ **Backend is now running at:** http://localhost:8000

---

### Terminal 2 - Frontend (React App)

Open a **NEW terminal** (don't close the backend terminal):

```bash
cd "c:\Users\basir\Documents\upf\PHP\exam final\frontend"
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ **Frontend is now running at:** http://localhost:5173

---

## 🌐 Access Your Application

**Open your browser and go to:**
```
http://localhost:5173
```

---

## 🔑 Login Credentials

### Admin Account:
- **Email:** `admin@upf.ma`
- **Password:** `password`

### Professor Account:
- **Email:** `a.bennani@upf.ma`
- **Password:** `password`

### Student Account:
- **Email:** `y.alami@student.upf.ma`
- **Password:** `password`

---

## ❌ Common Errors & Solutions

### Error: "Network Error" or "ERR_INTERNET_DISCONNECTED"

**Cause:** Backend server is not running

**Solution:**
1. Open a terminal
2. Navigate to backend folder
3. Run: `php artisan serve`
4. Keep this terminal open while using the app

---

### Error: "Connection refused"

**Cause:** Backend is running on wrong port or not started

**Solution:**
1. Make sure backend shows: `Server running on [http://127.0.0.1:8000]`
2. Check frontend `.env` file has: `VITE_API_BASE_URL=http://localhost:8000/api`
3. Restart both servers if needed

---

### Error: "CORS policy" error

**Cause:** CORS not configured properly

**Solution:**
Update `backend/config/cors.php`:
```php
'allowed_origins' => ['http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

Then restart backend server.

---

### Error: Database connection failed

**Cause:** Railway database not accessible

**Solution:**
1. Check internet connection
2. Verify credentials in `backend/.env`
3. Test connection: `php test-db-connection.php`
4. Clear config: `php artisan config:clear`

---

## 🔄 Stopping the Servers

**To stop either server:**
- Press `Ctrl + C` in the terminal where it's running

---

## 💡 Pro Tips

1. **Always start backend FIRST**, then frontend
2. **Keep both terminals open** while using the app
3. **Don't close terminals** - servers will stop
4. **Check terminal output** for errors
5. **Refresh browser** after making changes

---

## 📊 Architecture Overview

```
Browser (http://localhost:5173)
    ↓
React Frontend (Vite Dev Server)
    ↓ HTTP Requests
Laravel Backend (http://localhost:8000)
    ↓ SQL Queries
Railway Database (switchback.proxy.rlwy.net:26711)
```

---

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] Backend terminal shows "Server running on [http://127.0.0.1:8000]"
- [ ] Frontend terminal shows "Local: http://localhost:5173/"
- [ ] Both terminals are still open (not closed)
- [ ] No errors in terminal output
- [ ] Browser console (F12) shows no red errors
- [ ] Internet connection is active (for Railway DB)

---

## 🆘 Still Having Issues?

1. **Restart both servers:**
   ```bash
   # Terminal 1
   cd backend
   php artisan serve
   
   # Terminal 2
   cd frontend
   npm run dev
   ```

2. **Clear caches:**
   ```bash
   cd backend
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   ```

3. **Check browser console:**
   - Press F12
   - Go to "Console" tab
   - Look for red errors
   - Share the error message

4. **Test API directly:**
   Open browser: http://localhost:8000/api
   Should show: Laravel API response

---

## 🎯 Quick Commands Reference

```bash
# Start backend
cd backend && php artisan serve

# Start frontend
cd frontend && npm run dev

# Test database
cd backend && php test-db-connection.php

# Clear all caches
cd backend && php artisan optimize:clear

# View logs
cd backend && tail -f storage/logs/laravel.log
```

---

**Your application should now be working! Open http://localhost:5173 and login! 🎉**
