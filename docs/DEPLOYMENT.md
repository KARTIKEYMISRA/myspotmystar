# Deployment Guide

## Backend Deployment

### Option 1: Railway / Render

1. Create account on Railway.app or Render.com
2. Create new PostgreSQL database
3. Create new Web Service
4. Connect your GitHub repository
5. Set environment variables:
   ```
   DB_HOST=<your-db-host>
   DB_PORT=5432
   DB_NAME=<your-db-name>
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   JWT_SECRET=<generate-random-string>
   JWT_REFRESH_SECRET=<generate-random-string>
   NODE_ENV=production
   FRONTEND_URL=<your-vercel-url>
   ```
6. Set build command: `cd backend && npm install`
7. Set start command: `cd backend && npm run migrate && npm start`
8. Deploy

### Option 2: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create spotmystar-api`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
5. Set environment variables: `heroku config:set JWT_SECRET=...`
6. Create Procfile in backend:
   ```
   web: npm run migrate && npm start
   ```
7. Deploy: `git push heroku main`

---

## Frontend Deployment (Vercel)

### Step 1: Prepare for Deployment

1. Update `frontend/src/utils/api.js` baseURL:
   ```javascript
   const api = axios.create({
     baseURL: process.env.VITE_API_URL || '/api',
   });
   ```

2. Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

### Step 2: Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Navigate to frontend: `cd frontend`
4. Deploy: `vercel`
5. Follow prompts
6. Set environment variable in Vercel dashboard:
   - VITE_API_URL = your backend URL

### Step 3: Configure Custom Domain (Optional)

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain
5. Update DNS records as instructed

---

## Database Migration

After deploying backend, run migrations:

```bash
# If using Railway/Render
# Migrations run automatically on start

# If manual migration needed
node backend/scripts/migrate.js
```

---

## Environment Variables Checklist

### Backend
- [x] DB_HOST
- [x] DB_PORT
- [x] DB_NAME
- [x] DB_USER
- [x] DB_PASSWORD
- [x] JWT_SECRET
- [x] JWT_REFRESH_SECRET
- [x] NODE_ENV
- [x] FRONTEND_URL

### Frontend
- [x] VITE_API_URL

---

## Post-Deployment

1. Test all authentication flows
2. Test role-based access
3. Create admin account manually in database
4. Test booking flow
5. Monitor error logs
6. Set up monitoring (optional: Sentry, LogRocket)

---

## Troubleshooting

### CORS Issues
- Ensure FRONTEND_URL is set correctly in backend
- Check CORS configuration in server.js

### Database Connection
- Verify all DB credentials
- Check if database allows external connections
- Ensure SSL is configured if required

### JWT Issues
- Ensure JWT_SECRET is set
- Check token expiration settings
- Verify Authorization header format

---

## Scaling Considerations

1. Use connection pooling for database
2. Implement Redis for session management
3. Add CDN for static assets
4. Enable gzip compression
5. Implement rate limiting
6. Add monitoring and logging
7. Set up automated backups
