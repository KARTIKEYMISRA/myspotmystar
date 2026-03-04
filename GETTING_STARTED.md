# Getting Started with SpotMYstar

This guide will help you set up and run SpotMYstar on your local machine in minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)

## Quick Start (Automated Setup)

### Windows Users

1. Open Command Prompt or PowerShell in the project directory
2. Run the setup script:
   ```bash
   setup.bat
   ```
3. Start the development servers:
   ```bash
   start-dev.bat
   ```

### Mac/Linux Users

1. Open Terminal in the project directory
2. Make scripts executable:
   ```bash
   chmod +x setup.sh start-dev.sh
   ```
3. Run the setup script:
   ```bash
   ./setup.sh
   ```
4. Start the development servers:
   ```bash
   ./start-dev.sh
   ```

## Manual Setup

If you prefer to set up manually or the automated scripts don't work:

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables

The `.env` files are already created with default values. Update them if needed:

**Backend** (`backend/.env`):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spotmystar
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secret_key
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE spotmystar;

# Exit
\q
```

### Step 4: Run Migrations

```bash
cd backend
npm run migrate
```

This will:
- Create all database tables
- Set up relationships and indexes
- Insert default categories
- Create a default admin account

### Step 5: Start Development Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Access the Application

Once both servers are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Default Admin Credentials

After running migrations, you can log in as admin:

- **Email**: admin@spotmystar.com
- **Password**: admin123

⚠️ **Important**: Change the admin password after first login in production!

## Testing the Setup

### 1. Test Backend Health

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test User Registration

```bash
curl -X POST http://localhost:5000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 3. Test Frontend

Open http://localhost:5173 in your browser and you should see the landing page.

## Common Issues & Solutions

### Issue: Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000

# Kill the process or change PORT in backend/.env
```

### Issue: Database Connection Failed

**Error**: `Database connection failed`

**Solutions**:
1. Ensure PostgreSQL is running:
   ```bash
   # Windows
   net start postgresql-x64-14
   
   # Mac
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

2. Check credentials in `backend/.env`
3. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

### Issue: Migration Failed

**Error**: `Migration script failed`

**Solutions**:
1. Drop and recreate database:
   ```bash
   psql -U postgres -c "DROP DATABASE spotmystar;"
   psql -U postgres -c "CREATE DATABASE spotmystar;"
   ```

2. Run migration again:
   ```bash
   cd backend
   npm run migrate
   ```

### Issue: CORS Error

**Error**: `CORS policy blocked`

**Solution**: Update `FRONTEND_URL` in `backend/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

### Issue: JWT Token Invalid

**Error**: `Invalid token`

**Solutions**:
1. Clear browser localStorage
2. Ensure `JWT_SECRET` is set in `backend/.env`
3. Re-login to get a new token

## Development Workflow

### Making Changes

1. **Backend Changes**: Server auto-restarts with nodemon
2. **Frontend Changes**: Vite hot-reloads automatically
3. **Database Changes**: Update `backend/scripts/migrate.js` and re-run

### Adding New Features

1. Create controller in `backend/controllers/`
2. Add routes in `backend/routes/`
3. Create frontend pages in `frontend/src/pages/`
4. Update routing in `frontend/src/App.jsx`

### Database Management

**View all tables:**
```bash
psql -U postgres -d spotmystar -c "\dt"
```

**View table structure:**
```bash
psql -U postgres -d spotmystar -c "\d users"
```

**Query data:**
```bash
psql -U postgres -d spotmystar -c "SELECT * FROM users;"
```

## Project Structure

```
spotmystar/
├── backend/              # Node.js + Express API
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation
│   ├── routes/          # API endpoints
│   ├── scripts/         # Migration scripts
│   └── utils/           # Helper functions
│
├── frontend/            # React application
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── store/      # State management
│   │   └── utils/      # API client
│   └── public/         # Static assets
│
└── docs/               # Documentation
```

## Next Steps

1. **Explore the Application**
   - Register as a user, artist, or brand
   - Browse artists and create bookings
   - Log in as admin to manage the platform

2. **Read Documentation**
   - [API Documentation](docs/API_DOCUMENTATION.md)
   - [Database Schema](docs/DATABASE_SCHEMA.md)
   - [Features Guide](docs/FEATURES.md)
   - [Deployment Guide](docs/DEPLOYMENT.md)

3. **Customize**
   - Update branding and colors
   - Add new features
   - Integrate payment gateways
   - Add email notifications

## Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm start           # Start production server
npm run migrate     # Run database migrations

# Frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build

# Database
psql -U postgres -d spotmystar    # Connect to database
\dt                                # List tables
\d table_name                      # Describe table
\q                                 # Quit
```

## Getting Help

- Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for common tasks
- Review [docs/](docs/) folder for detailed documentation
- Check [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for feature list

## Production Deployment

When ready to deploy:

1. Update environment variables for production
2. Set `NODE_ENV=production`
3. Use strong JWT secrets
4. Enable HTTPS
5. Set up database backups
6. Configure monitoring

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

---

**Happy Coding! 🚀**

If you encounter any issues not covered here, check the troubleshooting section in the documentation or review the error logs.
