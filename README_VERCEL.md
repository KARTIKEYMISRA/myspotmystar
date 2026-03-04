# 🚀 Deploy SpotMYstar to Vercel - Quick Guide

**Time Required**: 10-15 minutes

---

## 🎯 What You'll Deploy

- **Frontend**: Vercel (Free tier)
- **Backend**: Railway (Free $5 credit/month)
- **Database**: Railway PostgreSQL (Included)

---

## 📋 Prerequisites

1. GitHub account
2. Vercel account ([Sign up free](https://vercel.com/signup))
3. Railway account ([Sign up free](https://railway.app))

---

## 🚀 Quick Deploy (3 Steps)

### Step 1: Deploy Backend to Railway (5 min)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway add postgresql
railway up
```

**Set Environment Variables** in Railway dashboard:
```env
NODE_ENV=production
JWT_SECRET=your_very_long_secret_key_min_32_characters_here
JWT_REFRESH_SECRET=another_very_long_secret_key_different_from_above
FRONTEND_URL=https://your-app.vercel.app
```

**Run Migrations**:
```bash
railway run npm run migrate
```

**Copy your Railway URL**: `https://your-app.railway.app`

---

### Step 2: Deploy Frontend to Vercel (5 min)

#### Option A: Using Deployment Script (Easiest)

**Windows**:
```bash
deploy-vercel.bat
```

**Mac/Linux**:
```bash
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

#### Option B: Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

When prompted, enter your backend URL from Step 1.

---

### Step 3: Update Backend CORS (2 min)

1. Copy your Vercel URL (e.g., `https://spotmystar.vercel.app`)

2. Update `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://spotmystar.vercel.app',  // Your Vercel URL
    'https://spotmystar-*.vercel.app' // Preview deployments
  ],
  credentials: true
}));
```

3. Commit and push to redeploy:
```bash
cd backend
git add .
git commit -m "Update CORS for Vercel"
railway up
```

---

## ✅ Test Your Deployment

1. Visit your Vercel URL
2. Test backend: `https://your-backend.railway.app/health`
3. Register a test user
4. Try creating a booking

---

## 🔧 Configuration Files Created

All necessary files are already created:
- ✅ `frontend/vercel.json` - Vercel configuration
- ✅ `frontend/.vercelignore` - Files to ignore
- ✅ `vercel.json` - Root configuration
- ✅ `deploy-vercel.sh` - Unix deployment script
- ✅ `deploy-vercel.bat` - Windows deployment script

---

## 🌐 Environment Variables

### Backend (Railway)
Set in Railway dashboard:
```env
NODE_ENV=production
JWT_SECRET=<generate-32-char-secret>
JWT_REFRESH_SECRET=<generate-another-secret>
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
Set in Vercel dashboard or via CLI:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

**Generate Secrets**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔍 Troubleshooting

### CORS Error
- Add your Vercel URL to backend CORS config
- Redeploy backend: `railway up`

### API Not Connecting
- Check `VITE_API_URL` in Vercel settings
- Verify backend is running: `curl https://your-backend.railway.app/health`

### Build Failed
- Check Vercel build logs
- Verify all dependencies: `npm install`
- Check `package.json` scripts

---

## 📚 Detailed Documentation

For comprehensive guides, see:
- **Quick Guide**: [DEPLOY_TO_VERCEL.md](DEPLOY_TO_VERCEL.md)
- **Full Guide**: [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

## 🎨 Custom Domain (Optional)

1. Go to Vercel Project Settings → Domains
2. Add your domain (e.g., `spotmystar.com`)
3. Configure DNS as instructed
4. Update backend CORS with new domain

---

## 💰 Costs

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month (Free forever)
- **Railway**: $5 credit/month (Enough for small apps)

### Paid Plans (Optional)
- **Vercel Pro**: $20/month (More bandwidth)
- **Railway Developer**: $10/month (More resources)

---

## 🔄 Continuous Deployment

Once connected to GitHub:
- **Push to `main`** → Auto-deploy to production
- **Push to other branches** → Auto-deploy preview

---

## 📞 Need Help?

1. Check [DEPLOY_TO_VERCEL.md](DEPLOY_TO_VERCEL.md)
2. Review [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
3. Check Vercel logs in dashboard
4. Check Railway logs: `railway logs`

---

## ✨ Next Steps After Deployment

1. ✅ Change admin password (admin@spotmystar.com / admin123)
2. ✅ Test all features
3. ✅ Set up monitoring
4. ✅ Add custom domain (optional)
5. ✅ Enable analytics (optional)

---

## 🎉 Success!

Your SpotMYstar app is now live on Vercel!

**Frontend**: https://your-app.vercel.app
**Backend**: https://your-app.railway.app
**Admin**: admin@spotmystar.com / admin123

---

**Built with ❤️ for the creative community**

For questions, check the documentation or create an issue on GitHub.
