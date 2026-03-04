# Environment Setup Guide

Complete setup instructions for Windows, macOS, and Linux.

## 📋 Prerequisites Installation

### Windows

#### 1. Install Node.js
```powershell
# Download from https://nodejs.org/
# Or use Chocolatey
choco install nodejs

# Verify installation
node --version
npm --version
```

#### 2. Install PostgreSQL
```powershell
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql

# Start PostgreSQL service
net start postgresql-x64-14

# Verify installation
psql --version
```

#### 3. Install Git
```powershell
# Download from https://git-scm.com/
# Or use Chocolatey
choco install git

# Verify installation
git --version
```

---

### macOS

#### 1. Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install Node.js
```bash
brew install node

# Verify installation
node --version
npm --version
```

#### 3. Install PostgreSQL
```bash
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14

# Verify installation
psql --version
```

#### 4. Install Git
```bash
brew install git

# Verify installation
git --version
```

---

### Linux (Ubuntu/Debian)

#### 1. Update Package Manager
```bash
sudo apt update
sudo apt upgrade -y
```

#### 2. Install Node.js
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### 3. Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

#### 4. Install Git
```bash
sudo apt install git

# Verify installation
git --version
```

---

## 🗄️ Database Setup

### Windows

```powershell
# Open Command Prompt or PowerShell as Administrator

# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE spotmystar;

# Create user (optional)
CREATE USER spotmystar_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE spotmystar TO spotmystar_user;

# Exit
\q
```

### macOS

```bash
# Login to PostgreSQL
psql postgres

# Create database
CREATE DATABASE spotmystar;

# Create user (optional)
CREATE USER spotmystar_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE spotmystar TO spotmystar_user;

# Exit
\q
```

### Linux

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE spotmystar;

# Create user (optional)
CREATE USER spotmystar_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE spotmystar TO spotmystar_user;

# Exit
\q
```

---

## 🔧 Project Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd spotmystar
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings
# Windows: notepad .env
# macOS/Linux: nano .env or vim .env
```

#### Configure .env file:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spotmystar
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_characters_long
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
```

#### Run Migrations:

```bash
npm run migrate
```

#### Start Backend:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 3. Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🧪 Verify Installation

### 1. Check Backend

```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected response:
# {"status":"OK","timestamp":"2024-01-01T00:00:00.000Z"}
```

### 2. Check Frontend

Open browser and navigate to:
```
http://localhost:5173
```

You should see the SpotMYstar landing page.

### 3. Test Database Connection

```bash
# Connect to database
psql -U postgres -d spotmystar

# List tables
\dt

# Expected output: users, artists, brands, bookings, etc.

# Exit
\q
```

---

## 🔍 Troubleshooting

### Issue: PostgreSQL not starting

#### Windows
```powershell
# Check service status
sc query postgresql-x64-14

# Start service
net start postgresql-x64-14

# If fails, check logs at:
# C:\Program Files\PostgreSQL\14\data\log\
```

#### macOS
```bash
# Check status
brew services list

# Restart service
brew services restart postgresql@14

# Check logs
tail -f /usr/local/var/log/postgres.log
```

#### Linux
```bash
# Check status
sudo systemctl status postgresql

# Restart service
sudo systemctl restart postgresql

# Check logs
sudo journalctl -u postgresql
```

### Issue: Port already in use

```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000

# Kill process
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

### Issue: Permission denied (PostgreSQL)

#### Windows
```powershell
# Run Command Prompt as Administrator
# Then try psql command again
```

#### macOS/Linux
```bash
# Add yourself to postgres group
sudo usermod -aG postgres $USER

# Or use sudo
sudo -u postgres psql
```

### Issue: npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Database connection refused

1. Check if PostgreSQL is running
2. Verify DB_HOST, DB_PORT in .env
3. Check firewall settings
4. Verify database exists: `psql -U postgres -l`

---

## 🔐 Security Setup

### 1. Generate Strong JWT Secrets

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### 2. Set Proper File Permissions

#### macOS/Linux
```bash
# Protect .env file
chmod 600 backend/.env

# Protect database credentials
chmod 600 ~/.pgpass  # if using .pgpass
```

#### Windows
```powershell
# Right-click .env file
# Properties > Security > Edit
# Remove all users except yourself
```

---

## 🚀 Development Workflow

### Recommended Terminal Setup

#### Option 1: Multiple Terminals
```
Terminal 1: Backend (cd backend && npm run dev)
Terminal 2: Frontend (cd frontend && npm run dev)
Terminal 3: Database (psql -U postgres -d spotmystar)
```

#### Option 2: Using tmux (macOS/Linux)
```bash
# Install tmux
# macOS: brew install tmux
# Linux: sudo apt install tmux

# Start tmux session
tmux new -s spotmystar

# Split panes
Ctrl+b then "  (horizontal split)
Ctrl+b then %  (vertical split)

# Navigate panes
Ctrl+b then arrow keys
```

#### Option 3: Using VS Code
```
1. Open integrated terminal
2. Click "+" to create new terminal
3. Split terminal using split icon
```

---

## 📦 Optional Tools

### Database GUI Tools

#### pgAdmin (All platforms)
```
Download: https://www.pgadmin.org/download/
```

#### DBeaver (All platforms)
```
Download: https://dbeaver.io/download/
```

#### Postico (macOS only)
```
Download: https://eggerapps.at/postico/
```

### API Testing Tools

#### Postman
```
Download: https://www.postman.com/downloads/
```

#### Insomnia
```
Download: https://insomnia.rest/download
```

#### Thunder Client (VS Code Extension)
```
Install from VS Code Extensions
```

---

## 🎓 Next Steps

After successful setup:

1. ✅ Read [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. ✅ Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. ✅ Check [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)
4. ✅ Test user registration flow
5. ✅ Test artist registration flow
6. ✅ Test booking creation
7. ✅ Explore admin panel

---

## 💡 Pro Tips

1. **Use nvm (Node Version Manager)**
   - Easily switch between Node.js versions
   - Windows: nvm-windows
   - macOS/Linux: nvm

2. **Use Docker (Optional)**
   - Containerize PostgreSQL
   - Consistent environment across team

3. **Use Git Hooks**
   - Run tests before commit
   - Format code automatically

4. **Use Environment Variables**
   - Never commit .env files
   - Use .env.example as template

5. **Regular Backups**
   - Backup database regularly
   - Use version control for code

---

## 📞 Getting Help

If you encounter issues:

1. Check this guide first
2. Review error messages carefully
3. Check logs (backend console, database logs)
4. Search for error online
5. Check project documentation
6. Create an issue on GitHub

---

**Happy Coding! 🚀**
