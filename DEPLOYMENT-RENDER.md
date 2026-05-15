# 🚀 Déploiement Backend Laravel sur Render.com

## 📋 Prérequis

1. ✅ Compte Render.com (gratuit)
2. ✅ Code source pushé sur GitHub/GitLab
3. ✅ Base de données Railway déjà configurée

---

## 🎯 Étapes de Déploiement

### Étape 1: Préparer le Projet pour Render

#### 1.1 Créer un fichier `render.yaml` à la racine du backend

Créez ce fichier dans `backend/render.yaml`:

```yaml
services:
  - type: web
    name: upf-university-backend
    env: php
    plan: free
    buildCommand: |
      composer install --no-dev --optimize-autoloader
      php artisan key:generate
      php artisan migrate --force
    startCommand: heroku-php-apache2 public/
    envVars:
      - key: APP_ENV
        value: production
      - key: APP_DEBUG
        value: false
      - key: APP_KEY
        generateValue: true
      - key: DB_CONNECTION
        value: mysql
      - key: DB_HOST
        sync: false
      - key: DB_PORT
        value: "26711"
      - key: DB_DATABASE
        value: railway
      - key: DB_USERNAME
        value: root
      - key: DB_PASSWORD
        sync: false
      - key: SESSION_DRIVER
        value: cookie
      - key: CACHE_STORE
        value: file
      - key: QUEUE_CONNECTION
        value: sync
```

#### 1.2 Mettre à jour `.gitignore`

Assurez-vous que ces fichiers sont ignorés:
```
/vendor
/node_modules
/.env
/storage/logs/*.log
```

#### 1.3 Configurer CORS pour Production

Modifiez `backend/config/cors.php`:

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',  // Development
        'https://votre-frontend.vercel.app',  // Production frontend URL
        'https://*.onrender.com',  // Allow Render domains
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

### Étape 2: Push sur GitHub

```bash
cd "c:\Users\basir\Documents\upf\PHP\exam final\backend"

# Initialiser git si pas déjà fait
git init
git add .
git commit -m "Initial commit for Render deployment"

# Ajouter remote GitHub (remplacez par votre repo)
git remote add origin https://github.com/votre-username/upf-backend.git
git push -u origin main
```

---

### Étape 3: Déployer sur Render

#### Option A: Via render.yaml (Recommandé)

1. Allez sur: https://render.com
2. Connectez-vous
3. Cliquez **"New +"** → **"Blueprint"**
4. Connectez votre repository GitHub
5. Sélectionnez le repo `upf-backend`
6. Render détectera automatiquement `render.yaml`
7. Cliquez **"Apply"**

#### Option B: Manuellement

1. Allez sur: https://render.com
2. Cliquez **"New +"** → **"Web Service"**
3. Connectez votre repository GitHub
4. Configurez:
   ```
   Name: upf-university-backend
   Branch: main
   Root Directory: backend
   Runtime: PHP
   Build Command: composer install --no-dev --optimize-autoloader && php artisan key:generate && php artisan migrate --force
   Start Command: heroku-php-apache2 public/
   ```

5. Ajoutez les variables d'environnement:
   ```
   APP_ENV=production
   APP_DEBUG=false
   DB_CONNECTION=mysql
   DB_HOST=switchback.proxy.rlwy.net
   DB_PORT=26711
   DB_DATABASE=railway
   DB_USERNAME=root
   DB_PASSWORD=cXFCHdBFAdkihIIbbmceLzQoXUFEtxTt
   SESSION_DRIVER=cookie
   CACHE_STORE=file
   QUEUE_CONNECTION=sync
   ```

6. Cliquez **"Create Web Service"**

---

### Étape 4: Configuration Post-Déploiement

#### 4.1 Générer APP_KEY

Dans le dashboard Render:
1. Allez dans votre service
2. Onglet **"Environment"**
3. Ajoutez:
   ```
   APP_KEY=base64:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
   
   Ou exécutez dans Shell:
   ```bash
   php artisan key:generate --show
   ```
   Copiez la clé et ajoutez-la comme variable d'environnement.

#### 4.2 Exécuter les Migrations

Dans le dashboard Render:
1. Onglet **"Shell"**
2. Exécutez:
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   ```

#### 4.3 Configurer les Permissions

Dans Shell:
```bash
chmod -R 775 storage bootstrap/cache
```

---

### Étape 5: Tester le Déploiement

Une fois déployé, Render vous donnera une URL comme:
```
https://upf-university-backend.onrender.com
```

Testez l'API:
```bash
curl https://upf-university-backend.onrender.com/api
```

Testez le login:
```bash
curl -X POST https://upf-university-backend.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@upf.ma","password":"password"}'
```

---

## 🔧 Configuration du Frontend

Mettez à jour `frontend/.env.production`:

```env
VITE_API_BASE_URL=https://upf-university-backend.onrender.com/api
```

Rebuild le frontend:
```bash
cd frontend
npm run build
```

Déployez le frontend sur Vercel/Netlify avec cette configuration.

---

## ⚠️ Problèmes Courants & Solutions

### Erreur: "APP_KEY not set"

**Solution:**
1. Générez une clé: `php artisan key:generate --show`
2. Ajoutez-la dans Render Environment Variables
3. Redémarrez le service

### Erreur: "Database connection failed"

**Solution:**
1. Vérifiez les credentials dans Environment Variables
2. Testez la connexion Railway depuis Render Shell:
   ```bash
   php artisan tinker
   DB::connection()->getPdo();
   ```

### Erreur: "Permission denied" sur storage/

**Solution:**
Dans Render Shell:
```bash
chmod -R 775 storage bootstrap/cache
```

### Erreur: "Class not found"

**Solution:**
Vérifiez que `composer install` s'exécute correctement:
```bash
composer install --no-dev --optimize-autoloader
```

### Erreur CORS

**Solution:**
Ajoutez l'URL de votre frontend dans `config/cors.php`:
```php
'allowed_origins' => [
    'https://votre-frontend.vercel.app',
],
```

---

## 📊 Architecture Après Déploiement

```
Frontend (Vercel/Netlify)
    ↓ HTTPS
Backend API (Render.com)
    ↓ MySQL Connection
Database (Railway.app)
```

---

## 💡 Optimisations pour Production

### 1. Cache Configuration

Dans Render Environment Variables:
```
CACHE_DRIVER=file
CONFIG_CACHE=true
ROUTE_CACHE=true
VIEW_CACHE=true
```

Exécutez dans Shell:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. Logs

Les logs sont disponibles dans:
- Dashboard Render → Logs tab
- Ou: `storage/logs/laravel.log`

### 3. Monitoring

Render fournit:
- Métriques CPU/Mémoire
- Logs en temps réel
- Health checks automatiques

---

## 🔄 Mise à Jour du Déploiement

Après chaque modification:

```bash
git add .
git commit -m "Description des changements"
git push origin main
```

Render redéploiera automatiquement!

---

## 🆘 Support

**Logs Render:**
- Dashboard → Votre service → Logs

**Shell Access:**
- Dashboard → Votre service → Shell

**Documentation:**
- https://render.com/docs
- https://render.com/docs/deploy-laravel

---

## ✅ Checklist de Déploiement

- [ ] Code pushé sur GitHub
- [ ] `render.yaml` créé
- [ ] CORS configuré pour production
- [ ] Service créé sur Render
- [ ] Variables d'environnement ajoutées
- [ ] APP_KEY généré
- [ ] Migrations exécutées
- [ ] Permissions storage/ corrigées
- [ ] API testée et fonctionnelle
- [ ] Frontend configuré avec nouvelle URL
- [ ] Tests de login réussis

---

## 🎉 C'est Tout!

Votre backend Laravel est maintenant déployé sur Render.com avec:
- ✅ HTTPS automatique
- ✅ Déploiements automatiques via Git
- ✅ Base de données Railway connectée
- ✅ Logs et monitoring inclus
- **100% Gratuit!**

**URL de votre API:** `https://upf-university-backend.onrender.com/api`
