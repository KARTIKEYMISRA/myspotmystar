# 🚀 Quick Deploy to Vercel

Fast guide to deploy SpotMYstar to Vercel in 10 minutes.

---

## Step 1: Deploy Backend (5 minutes)

### Using Railway (Easiest)

1. **Create Account**: Go to [railway.app](https://railway.app)

2. **Create Project**:
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

3. **Set Environment Variables** in Railway dashboard:
   ```env
   NODE_ENV=production
   JWT_SECRET=your_very_long_secret_key_min_32_characters
   JWT_REFRESH_SECRET=another_very_long_secret_key_different
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Run Migrations**:
   ```bash
   railway run npm run migrate
   ```

5. **Copy Backend URL**: `https://your-app.railway.app`

---

## Step 2: Deploy Frontend to Vercel (5 minutes)

### Method 1: GitHub + Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/spotmystar.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure:
     - **Root Directory**: `frontend`
     - **Framework**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variable**:
   - Go to Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend.railway.app/api`

4. **Deploy**: Click "Deploy"

---

### Method 2: Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod

# Add environment variable
vercel env add VITE_API_URL production
# Enter: https://your-backend.railway.app/api

# Redeploy
vercel --prod
```

---

## Step 3: Update Backend CORS

Update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app',
    'https://your-app-*.vercel.app'
  ],
  credentials: true
}));
```

Commit and push to redeploy backend.

---

## Step 4: Test Your Deployment

1. **Visit**: `https://your-app.vercel.app`
2. **Test Backend**: `https://your-backend.railway.app/health`
3. **Try Features**:
   - Register a user
   - Login
   - Browse artists
   - Create booking

---

## Environment Variables Needed

### Backend (Railway)
```env
NODE_ENV=production
JWT_SECRET=<generate-32-char-secret>
JWT_REFRESH_SECRET=<generate-another-secret>
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## Generate Strong Secrets

```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Troubleshooting

### CORS Error
- Add your Vercel URL to backend CORS config
- Redeploy backend

### API Not Connecting
- Check `VITE_API_URL` in Vercel settings
- Verify backend is running
- Test: `curl https://your-backend.railway.app/health`

### Build Failed
- Check build logs in Vercel dashboard
- Verify all dependencies installed
- Check `package.json` scripts

---

## Quick Links

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Railway Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
- **Full Guide**: See `docs/VERCEL_DEPLOYMENT.md`

---

## Next Steps

1. ✅ Change admin password
2. ✅ Add custom domain (optional)
3. ✅ Set up monitoring
4. ✅ Enable analytics
5. ✅ Test all features

---

**Done!** Your app is live on Vercel! 🎉

For detailed instructions, see [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)
