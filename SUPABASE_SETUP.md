# 🚀 Supabase Setup Guide - Deploy Backend in 10 Minutes

Complete guide to deploy SpotMYstar backend using Supabase for database and Vercel for API.

---

## 🎯 Architecture

- **Database**: Supabase PostgreSQL (Free tier)
- **Backend API**: Vercel Serverless Functions
- **Frontend**: Vercel

---

## 📋 Prerequisites

1. Supabase account - [Sign up free](https://supabase.com)
2. Vercel account - [Sign up free](https://vercel.com)
3. GitHub repository ready

---

## 🚀 Quick Setup (3 Parts)

### Part 1: Setup Supabase Database (5 minutes)

#### Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Name**: spotmystar
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait 2-3 minutes for setup

#### Step 2: Get Database Connection Details

1. Go to Project Settings → Database
2. Copy these values:
   - **Host**: `db.xxx.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: (your password from Step 1)
   - **Connection String**: `postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres`

#### Step 3: Run Database Migrations

**Option A: Using Supabase SQL Editor**

1. Go to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy the migration SQL from `backend/scripts/migrate.js`
4. Run the query

**Option B: Using Local Connection**

```bash
# Install PostgreSQL client
# Then connect and run migrations
psql "postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres" -f backend/scripts/migrate.sql
```

---

### Part 2: Deploy Backend to Vercel (3 minutes)

Since you already have your backend as Express API, we'll deploy it to Vercel.

#### Step 1: Update Backend for Vercel

The backend is already configured. Just ensure `backend/server.js` exports the app:

```javascript
// At the end of backend/server.js
module.exports = app;
```

#### Step 2: Create Vercel Configuration for Backend

Already created! The `vercel.json` in root handles this.

#### Step 3: Deploy Backend to Vercel

**Option A: Vercel Dashboard**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Configure:
   - **Project Name**: spotmystar-backend
   - **Root Directory**: `backend`
   - **Framework**: Other
4. Add Environment Variables (see below)
5. Deploy!

**Option B: Vercel CLI**

```bash
cd backend
vercel --prod
```

---

### Part 3: Configure Environment Variables (2 minutes)

#### Backend Environment Variables (Vercel)

Add these in Vercel project settings:

```env
NODE_ENV=production
PORT=5000

# Supabase Database
DB_HOST=db.xxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password

# Or use connection string
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# JWT Secrets
JWT_SECRET=your_32_character_secret_key_here
JWT_REFRESH_SECRET=another_32_character_secret_key
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Frontend URL
FRONTEND_URL=https://spotmystar.vercel.app
```

**Generate JWT secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Frontend Environment Variables (Vercel)

```env
VITE_API_URL=https://spotmystar-backend.vercel.app/api
```

---

## 🔧 Update Database Configuration

Update `backend/config/database.js` to work with Supabase:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('✓ Database connected to Supabase');
});

pool.on('error', (err) => {
  console.error('Database error:', err);
  process.exit(-1);
});

module.exports = pool;
```

---

## 📊 Supabase Features You Can Use

### 1. Database Management
- Visual table editor
- SQL editor
- Database backups
- Real-time subscriptions

### 2. Authentication (Optional - Future)
- Built-in auth system
- Social logins
- Email verification
- Row-level security

### 3. Storage (Optional - Future)
- File storage
- Image optimization
- CDN delivery

### 4. API Auto-generation
- REST API
- GraphQL API
- Real-time subscriptions

---

## 🧪 Test Your Setup

### Test Database Connection

```bash
# Test from local
psql "postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres" -c "SELECT version();"
```

### Test Backend API

```bash
# Health check
curl https://spotmystar-backend.vercel.app/health

# Test registration
curl -X POST https://spotmystar-backend.vercel.app/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test User"}'
```

---

## 💰 Supabase Pricing

### Free Tier (Perfect for Starting)
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 2GB bandwidth
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests
- ✅ Social OAuth providers

### Pro Plan ($25/month)
- 8GB database
- 100GB file storage
- 250GB bandwidth
- 100,000 monthly active users

---

## 🔍 Supabase Dashboard Features

### Database
- **Table Editor**: Visual interface to manage tables
- **SQL Editor**: Run custom queries
- **Database**: View schema and relationships
- **Backups**: Automatic daily backups (Pro plan)

### API
- **API Docs**: Auto-generated API documentation
- **Authentication**: User management
- **Storage**: File management

### Monitoring
- **Logs**: View database logs
- **Reports**: Usage statistics
- **Performance**: Query performance

---

## 🔄 Database Migrations

### Create Migration SQL File

Convert your `migrate.js` to SQL:

```sql
-- backend/scripts/migrate.sql

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(4) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  city VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create artists table
CREATE TABLE IF NOT EXISTS artists (
  artist_id VARCHAR(5) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  city VARCHAR(100),
  bio TEXT,
  price_range VARCHAR(100),
  portfolio_links TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  brand_id VARCHAR(6) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(20),
  city VARCHAR(100),
  industry VARCHAR(100),
  website VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  admin_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  booking_id VARCHAR(7) PRIMARY KEY,
  user_id VARCHAR(4) REFERENCES users(user_id) ON DELETE CASCADE,
  artist_id VARCHAR(5) REFERENCES artists(artist_id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  event_type VARCHAR(100),
  message TEXT,
  status VARCHAR(20) DEFAULT 'requested',
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  favorite_id SERIAL PRIMARY KEY,
  user_id VARCHAR(4) REFERENCES users(user_id) ON DELETE CASCADE,
  artist_id VARCHAR(5) REFERENCES artists(artist_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, artist_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  review_id SERIAL PRIMARY KEY,
  booking_id VARCHAR(7) REFERENCES bookings(booking_id) ON DELETE CASCADE,
  user_id VARCHAR(4) REFERENCES users(user_id) ON DELETE CASCADE,
  artist_id VARCHAR(5) REFERENCES artists(artist_id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  report_id SERIAL PRIMARY KEY,
  reporter_id VARCHAR(10) NOT NULL,
  reported_id VARCHAR(10) NOT NULL,
  report_type VARCHAR(50),
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  token_id SERIAL PRIMARY KEY,
  user_id VARCHAR(10) NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_artist ON bookings(artist_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_artist ON favorites(artist_id);
CREATE INDEX IF NOT EXISTS idx_reviews_artist ON reviews(artist_id);

-- Insert default categories
INSERT INTO categories (name, description, icon) VALUES
  ('Singer', 'Professional singers for events', 'mic'),
  ('Dancer', 'Professional dancers and choreographers', 'music'),
  ('Musician', 'Instrumentalists and bands', 'guitar'),
  ('DJ', 'DJs and music producers', 'disc'),
  ('Comedian', 'Stand-up comedians and entertainers', 'laugh'),
  ('Magician', 'Magicians and illusionists', 'wand')
ON CONFLICT (name) DO NOTHING;

-- Insert default admin
INSERT INTO admins (email, password, name) VALUES
  ('admin@spotmystar.com', '$2a$10$rQ8YvVZK5vZK5vZK5vZK5uZK5vZK5vZK5vZK5vZK5vZK5vZK5vZK5', 'Admin')
ON CONFLICT (email) DO NOTHING;
```

### Run Migration in Supabase

1. Go to SQL Editor
2. Paste the SQL above
3. Click "Run"

---

## 🔒 Security Best Practices

### Row Level Security (RLS)

Enable RLS in Supabase for additional security:

```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies (example)
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = user_id);
```

### API Keys

Supabase provides:
- **anon key**: For client-side (public)
- **service_role key**: For server-side (secret)

Use service_role key in your backend.

---

## 📋 Deployment Checklist

- [ ] Supabase project created
- [ ] Database password saved
- [ ] Connection string copied
- [ ] Migrations run successfully
- [ ] Backend deployed to Vercel
- [ ] Environment variables set
- [ ] Frontend deployed to Vercel
- [ ] CORS configured
- [ ] Health endpoint tested
- [ ] API endpoints tested

---

## 🆘 Troubleshooting

### Database Connection Failed

**Check connection string:**
```bash
psql "your_connection_string" -c "SELECT 1;"
```

**Verify SSL:**
Supabase requires SSL. Ensure `ssl: { rejectUnauthorized: false }` in pool config.

### Migrations Failed

**Check SQL syntax:**
- Run queries one by one in SQL Editor
- Check for syntax errors
- Verify table names

### API Not Working

**Check Vercel logs:**
```bash
vercel logs
```

**Verify environment variables:**
- All variables set correctly
- No typos in variable names
- Secrets properly generated

---

## 🎯 Next Steps

1. ✅ Complete Supabase setup
2. ✅ Deploy backend to Vercel
3. ✅ Deploy frontend to Vercel
4. ✅ Test all features
5. ✅ Monitor usage in Supabase dashboard

---

## 📞 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Vercel Docs](https://vercel.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Your backend will be live with Supabase in ~10 minutes!** 🚀
