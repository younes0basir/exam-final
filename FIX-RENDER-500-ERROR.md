# 🔴 CRITICAL: Fix HTTP 500 Error on Render

## Problem
Your backend is showing **HTTP 500 error** because the **database password is missing** from Render environment variables.

---

## ✅ Solution (Takes 30 Seconds)

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com
2. Click on your service: **upf-university-backend**

### Step 2: Add Environment Variables
1. Click on **Environment** tab (left sidebar)
2. Click **Add Environment Variable**
3. Add this:

```
Key: DB_PASSWORD
Value: cXFCHdBFAdkihIIbbmceLzQoXUFEtxTt
```

4. Click **Save**

### Step 3: Redeploy
1. Go to **Manual Deploy** tab
2. Click **Deploy latest commit**
3. Wait 2-3 minutes for build to complete

---

##  All Required Environment Variables

Make sure ALL of these are set in Render:

| Key | Value |
|-----|-------|
| APP_ENV | production |
| APP_DEBUG | false |
| APP_NAME | UPF University |
| APP_URL | https://upf-manage.onrender.com |
| DB_CONNECTION | mysql |
| DB_HOST | switchback.proxy.rlwy.net |
| DB_PORT | 26711 |
| DB_DATABASE | railway |
| DB_USERNAME | root |
| **DB_PASSWORD** | **cXFCHdBFAdkihIIbbmceLzQoXUFEtxTt** ← ADD THIS! |
| SESSION_DRIVER | cookie |
| CACHE_STORE | file |
| QUEUE_CONNECTION | sync |
| LOG_CHANNEL | stderr |
| FILESYSTEM_DISK | local |
| CORS_ALLOWED_ORIGINS | http://localhost:3000,http://localhost:5173,https://upf-manage.onrender.com |
| SANCTUM_STATEFUL_DOMAINS | localhost:3000,localhost:5173,upf-manage.onrender.com |
| SESSION_DOMAIN | .onrender.com |

---

## 🔍 Why This Happened

The `render.yaml` file has `sync: false` for DB_PASSWORD, which means:
- ❌ It's NOT automatically deployed (for security)
- ✅ You MUST add it manually in Render dashboard
- 🔒 This prevents passwords from being in Git

---

## ✅ After Adding DB_PASSWORD

Your backend should:
1. ✅ Connect to Railway database
2. ✅ Return proper API responses
3. ✅ Stop showing HTTP 500 error
4. ✅ Health check will pass

---

## 🧪 Test Your Backend

After redeploying, test:
```
https://upf-manage.onrender.com/api/user
```

Should return:
- `{"message": "Unauthenticated."}` (with 401 status) ← This is CORRECT!
- Or user data if you're authenticated

If you still see HTTP 500, check Render logs for the exact error.

---

## 📝 Note

Never commit DB_PASSWORD to Git! Always add sensitive credentials manually in the hosting dashboard.
