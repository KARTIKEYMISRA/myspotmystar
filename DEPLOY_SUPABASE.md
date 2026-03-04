# 🚀 Quick Deploy with Supabase - 10 Minutes

Fast guide to deploy SpotMYstar using Supabase + Vercel.

---

## ⚡ Quick Steps

### Step 1: Setup Supabase (3 min)

1. **Create Project**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Name: `spotmystar`
   - Generate strong password
   - Choose region
   - Click "Create"

2. **Run Migration**
   - Go to SQL Editor
   - Click "New Query"
   - Copy content from `backend/scripts/migrate.sql`
   - Paste and click "Run"
   - Wait for success message

3. **Get Connection String**
   - Go to Project Settings → Database
   - Copy "Connection string" (URI format)
   - Save it for next step

---

### Step 2: Deploy Backend to Vercel (3 min)

1. **Go to Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repo: `KARTIKEYMISRA/myspotmystar`

2. **Configure Backend**
   - Project name: `spotmystar-backend`
   - Root Directory: `backend`
   - Framework: Other

3. **Add Environment Variables**
   ```env
   NODE_ENV=production
   DATABASE_URL=<your-supabase-connection-string>
   JWT_SECRET=<generate-with-command-below>
   JWT_REFRESH_SECRET=<generate-another>
   FRONTEND_URL=https://spotmystar.vercel.app
   ```

   **Generate secrets:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy backend URL

---

### Step 3: Deploy Frontend to Vercel (2 min)

1. **Import Again**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import same repo

2. **Configure Frontend**
   - Project name: `spotmystar`
   - Root Directory: `frontend`
   - Framework: Vite

3. **Add Environment Variable**
   ```env
   VITE_API_URL=<your-backend-url>/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes

---

### Step 4: Update CORS (2 min)

1. **Update backend/server.js**
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://spotmystar.vercel.app',
       'https://spotmystar-*.vercel.app'
     ],
     credentials: true
   }));
   ```

2. **Commit and Push**
   ```bash
   git add .
   git commit -m "Update CORS for production"
   git push
   ```

3. **Vercel auto-deploys** - Wait 1 minute

---

## ✅ Test Your Deployment

### Test Backend
```bash
curl https://spotmystar-backend.vercel.app/health
```

### Test Frontend
Visit: `https://spotmystar.vercel.app`

### Test Full Flow
1. Register a user
2. Login
3. Browse artists
4. Create booking

---

## 🎯 URLs

- **Frontend**: https://spotmystar.vercel.app
- **Backend**: https://spotmystar-backend.vercel.app
- **Supabase**: https://supabase.com/dashboard
- **Admin**: admin@spotmystar.com / admin123

---

## 💰 Costs

**Total: $0/month (Free tier)**

- Supabase Free: 500MB database, unlimited API
- Vercel Free: Unlimited deployments, 100GB bandwidth

---

## 📚 Detailed Guides

- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Complete Supabase guide
- [README_VERCEL.md](README_VERCEL.md) - Vercel deployment
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - Problem solving

---

**Done! Your app is live!** 🎉
