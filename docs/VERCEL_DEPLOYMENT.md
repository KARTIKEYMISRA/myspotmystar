# Deploying SpotMYstar to Vercel

Complete guide for deploying SpotMYstar frontend to Vercel and backend to a hosting service.

## Overview

SpotMYstar deployment strategy:
- **Frontend**: Vercel (React app)
- **Backend**: Railway, Render, or Heroku (Node.js API)
- **Database**: Railway, Render, or Heroku Postgres

---

## Prerequisites

1. **Vercel Account** - [Sign up](https://vercel.com/signup)
2. **GitHub Account** - For repository connection
3. **Backend Hosting** - Railway, Render, or Heroku account
4. **Database Hosting** - PostgreSQL database

---

## Part 1: Deploy Backend First

### Option A: Deploy to Railway (Recommended)

#### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

#### 2. Create New Project
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Add PostgreSQL
railway add postgresql

# Deploy
railway up
```

#### 3. Configure Environment Variables
In Railway dashboard, add:
```env
NODE_ENV=production
PORT=5000
DB_HOST=<railway-postgres-host>
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=<railway-postgres-password>
JWT_SECRET=<generate-strong-secret-32-chars>
JWT_REFRESH_SECRET=<generate-another-strong-secret>
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=https://your-app.vercel.app
```

#### 4. Run Migrations
```bash
# Connect to Railway
railway run npm run migrate
```

#### 5. Get Backend URL
- Copy your Railway backend URL (e.g., `https://your-app.railway.app`)
- You'll need this for frontend configuration

---

### Option B: Deploy to Render

#### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

#### 2. Create PostgreSQL Database
- Click "New +" → "PostgreSQL"
- Name: spotmystar-db
- Copy connection details

#### 3. Create Web Service
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Configure:
  - **Name**: spotmystar-backend
  - **Root Directory**: backend
  - **Environment**: Node
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`

#### 4. Add Environment Variables
```env
NODE_ENV=production
PORT=5000
DB_HOST=<render-postgres-host>
DB_PORT=5432
DB_NAME=<render-db-name>
DB_USER=<render-db-user>
DB_PASSWORD=<render-db-password>
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-another-secret>
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=https://your-app.vercel.app
```

#### 5. Deploy
- Click "Create Web Service"
- Wait for deployment
- Copy your backend URL

---

### Option C: Deploy to Heroku

#### 1. Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

#### 2. Create Heroku App
```bash
cd backend
heroku create spotmystar-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini
```

#### 3. Configure Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key
heroku config:set JWT_REFRESH_SECRET=your_refresh_secret
heroku config:set JWT_EXPIRE=24h
heroku config:set JWT_REFRESH_EXPIRE=7d
heroku config:set FRONTEND_URL=https://your-app.vercel.app
```

#### 4. Deploy
```bash
git push heroku main

# Run migrations
heroku run npm run migrate
```

---

## Part 2: Deploy Frontend to Vercel

### Method 1: Deploy via Vercel Dashboard (Easiest)

#### 1. Push Code to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/spotmystar.git
git branch -M main
git push -u origin main
```

#### 2. Import to Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 3. Add Environment Variables
In Vercel project settings → Environment Variables:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

#### 4. Deploy
- Click "Deploy"
- Wait for deployment to complete
- Your app will be live at `https://your-app.vercel.app`

---

### Method 2: Deploy via Vercel CLI

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy Frontend
```bash
cd frontend

# First deployment
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? spotmystar
# - Directory? ./
# - Override settings? No

# Production deployment
vercel --prod
```

#### 4. Add Environment Variables
```bash
# Add environment variable
vercel env add VITE_API_URL production

# Enter value: https://your-backend.railway.app/api
```

#### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

---

## Part 3: Configure Backend CORS

Update your backend to allow Vercel domain:

```javascript
// backend/server.js
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-app.vercel.app',
  'https://your-app-*.vercel.app' // Preview deployments
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => 
      origin.match(new RegExp(allowed.replace('*', '.*')))
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Commit and redeploy backend.

---

## Part 4: Update Frontend API URL

Update `frontend/.env`:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

Or set in Vercel dashboard:
1. Go to Project Settings
2. Environment Variables
3. Add `VITE_API_URL` with your backend URL
4. Redeploy

---

## Part 5: Run Database Migrations

### Railway
```bash
railway run npm run migrate
```

### Render
```bash
# Connect to your database
psql <your-render-database-url>

# Run migration SQL manually or use Render shell
```

### Heroku
```bash
heroku run npm run migrate
```

---

## Part 6: Test Deployment

### 1. Test Backend
```bash
curl https://your-backend.railway.app/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Frontend
1. Visit `https://your-app.vercel.app`
2. Check landing page loads
3. Try user registration
4. Try login
5. Test booking flow

### 3. Test API Connection
1. Open browser console
2. Check for CORS errors
3. Verify API calls succeed
4. Check network tab

---

## Vercel Configuration Files

### frontend/vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Root vercel.json (if deploying both)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ]
}
```

---

## Environment Variables Summary

### Backend (Railway/Render/Heroku)
```env
NODE_ENV=production
PORT=5000
DB_HOST=<database-host>
DB_PORT=5432
DB_NAME=<database-name>
DB_USER=<database-user>
DB_PASSWORD=<database-password>
JWT_SECRET=<strong-secret-32-chars>
JWT_REFRESH_SECRET=<another-strong-secret>
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `spotmystar.com`)
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
4. Wait for DNS propagation (up to 48 hours)

### Update Backend CORS
```javascript
const allowedOrigins = [
  'https://spotmystar.com',
  'https://www.spotmystar.com',
  'https://your-app.vercel.app'
];
```

---

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

1. **Production**: Push to `main` branch
2. **Preview**: Push to any other branch

### Manual Deployment
```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

---

## Monitoring & Logs

### Vercel Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on a deployment
5. View "Build Logs" and "Function Logs"

### Backend Logs

**Railway**:
```bash
railway logs
```

**Render**:
- View logs in Render dashboard

**Heroku**:
```bash
heroku logs --tail
```

---

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in backend env
- Check CORS configuration in `server.js`
- Ensure Vercel domain is allowed

### API Connection Failed
- Verify `VITE_API_URL` in Vercel env
- Check backend is running
- Test backend health endpoint

### Build Failures
- Check build logs in Vercel
- Verify all dependencies in `package.json`
- Ensure build command is correct

### Database Connection Failed
- Verify database credentials
- Check database is running
- Ensure migrations ran successfully

### Environment Variables Not Working
- Redeploy after adding env vars
- Check env var names (case-sensitive)
- Verify values are correct

---

## Performance Optimization

### Enable Caching
```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Enable Compression
Vercel automatically compresses responses.

### CDN
Vercel automatically uses CDN for static assets.

---

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure CORS properly
- [ ] Set secure environment variables
- [ ] Enable rate limiting
- [ ] Regular security updates

---

## Deployment Checklist

### Pre-Deployment
- [ ] All features tested locally
- [ ] Database migrations ready
- [ ] Environment variables documented
- [ ] CORS configured
- [ ] Build succeeds locally

### Backend Deployment
- [ ] Backend deployed
- [ ] Database created
- [ ] Environment variables set
- [ ] Migrations run
- [ ] Health check passes

### Frontend Deployment
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] Site accessible

### Post-Deployment
- [ ] Test all features
- [ ] Verify API connection
- [ ] Check error logs
- [ ] Test on mobile
- [ ] Monitor performance

---

## Costs

### Vercel
- **Hobby**: Free
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS

- **Pro**: $20/month
  - More bandwidth
  - Team features
  - Analytics

### Railway
- **Free**: $5 credit/month
- **Developer**: $10/month
- **Team**: $20/month

### Render
- **Free**: Limited resources
- **Starter**: $7/month
- **Standard**: $25/month

---

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Render Docs**: [render.com/docs](https://render.com/docs)

---

## Quick Commands Reference

```bash
# Vercel
vercel login
vercel --prod
vercel env add
vercel logs

# Railway
railway login
railway up
railway logs
railway run npm run migrate

# Git
git add .
git commit -m "Deploy to production"
git push origin main
```

---

**Deployment Complete!** 🚀

Your SpotMYstar application is now live on Vercel!
