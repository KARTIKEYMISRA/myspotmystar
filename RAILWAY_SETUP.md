# 🚂 Railway Setup Guide - Deploy Backend in 5 Minutes

Complete guide to deploy your SpotMYstar backend to Railway.

---

## 📋 Prerequisites

1. Railway account - [Sign up free](https://railway.app)
2. Node.js installed
3. Your backend code ready

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

This will open your browser to authenticate.

### Step 3: Navigate to Backend

```bash
cd backend
```

### Step 4: Initialize Railway Project

```bash
# Initialize new project
railway init

# When prompted:
# - Project name: spotmystar-backend
# - Select: Create new project
```

### Step 5: Add PostgreSQL Database

```bash
railway add postgresql
```

This automatically creates and connects a PostgreSQL database.

### Step 6: Deploy Backend

```bash
railway up
```

Wait for deployment to complete (~2-3 minutes).

### Step 7: Set Environment Variables

Go to Railway dashboard and add these variables:

```env
NODE_ENV=production
JWT_SECRET=<generate-32-char-secret>
JWT_REFRESH_SECRET=<generate-another-32-char-secret>
FRONTEND_URL=https://your-app.vercel.app
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 8: Run Database Migrations

```bash
railway run npm run migrate
```

### Step 9: Get Your Backend URL

```bash
railway open
```

Or check Railway dashboard for your deployment URL.

---

## 🎯 Alternative: Railway Dashboard (No CLI)

### Method 1: Deploy from GitHub

1. Go to [railway.app/new](https://railway.app/new)
2. Click "Deploy from GitHub repo"
3. Select your repository: `KARTIKEYMISRA/myspotmystar`
4. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
5. Add PostgreSQL:
   - Click "New" → "Database" → "PostgreSQL"
6. Set environment variables (see Step 7 above)
7. Deploy!

### Method 2: Deploy from Local

1. Go to [railway.app/new](https://railway.app/new)
2. Click "Empty Project"
3. Click "Deploy from GitHub repo"
4. Follow steps above

---

## 🔧 Environment Variables Setup

### Required Variables

In Railway dashboard → Variables tab:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_32_character_secret_key_here
JWT_REFRESH_SECRET=another_32_character_secret_key
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=https://spotmystar.vercel.app
```

### Database Variables (Auto-Set by Railway)

These are automatically set when you add PostgreSQL:
- `DATABASE_URL`
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`

---

## 📝 Update Backend Code for Railway

Railway uses `DATABASE_URL` instead of separate DB variables. Update `backend/config/database.js`:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

pool.on('connect', () => {
  console.log('✓ Database connected');
});

pool.on('error', (err) => {
  console.error('Database error:', err);
  process.exit(-1);
});

module.exports = pool;
```

---

## 🧪 Test Your Deployment

### Test Health Endpoint

```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test API Endpoint

```bash
curl https://your-app.railway.app/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test User"}'
```

---

## 🔄 Update CORS for Vercel

After deploying, update `backend/server.js`:

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

Commit and redeploy:
```bash
git add .
git commit -m "Update CORS for Vercel"
git push
railway up
```

---

## 📊 Railway Dashboard Features

### View Logs
```bash
railway logs
```

Or in dashboard: Deployments → View Logs

### View Metrics
- CPU usage
- Memory usage
- Network traffic
- Request count

### Manage Database
- View tables
- Run queries
- Backup database
- View connection info

---

## 💰 Railway Pricing

### Free Tier
- $5 credit per month
- Enough for small apps
- PostgreSQL included
- Automatic deployments

### Developer Plan ($10/month)
- More resources
- Better performance
- Priority support

---

## 🔍 Troubleshooting

### Deployment Failed

**Check logs:**
```bash
railway logs
```

**Common issues:**
- Missing dependencies: Run `npm install` locally first
- Port issues: Railway auto-assigns PORT
- Database connection: Check DATABASE_URL is set

### Database Connection Failed

**Check connection:**
```bash
railway run psql $DATABASE_URL
```

**Verify migrations:**
```bash
railway run npm run migrate
```

### Environment Variables Not Working

**List variables:**
```bash
railway variables
```

**Set variable:**
```bash
railway variables set JWT_SECRET=your_secret
```

---

## 📋 Deployment Checklist

- [ ] Railway CLI installed
- [ ] Logged into Railway
- [ ] Project initialized
- [ ] PostgreSQL added
- [ ] Code deployed
- [ ] Environment variables set
- [ ] Migrations run
- [ ] Health endpoint tested
- [ ] Backend URL copied
- [ ] CORS updated

---

## 🎯 Next Steps

1. ✅ Copy your Railway backend URL
2. ✅ Add it to Vercel as `VITE_API_URL`
3. ✅ Update backend CORS with Vercel URL
4. ✅ Test full application

---

## 📞 Quick Commands Reference

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add postgresql

# Deploy
railway up

# Run migrations
railway run npm run migrate

# View logs
railway logs

# Open dashboard
railway open

# Set environment variable
railway variables set KEY=value

# List variables
railway variables

# Connect to database
railway run psql $DATABASE_URL
```

---

## 🆘 Need Help?

- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

**Your backend will be live in ~5 minutes!** 🚀
