# SpotMYstar Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

---

## Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd spotmystar

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Step 2: Database Setup

### Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE spotmystar;

# Exit
\q
```

### Configure Environment

```bash
# In backend folder
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=spotmystar
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_REFRESH_SECRET=your_refresh_secret_key_change_this
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

### Run Migrations

```bash
cd backend
npm run migrate
```

This will:
- Create all tables
- Set up indexes
- Insert default categories
- Create default admin account

---

## Step 3: Create Admin Account

The migration creates a default admin. To create a custom admin:

```bash
# Connect to database
psql -U postgres -d spotmystar

# Insert admin (password will be hashed)
INSERT INTO admins (email, password, name) 
VALUES ('admin@spotmystar.com', '$2a$10$...', 'Admin');
```

Or use bcrypt to hash password:
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your_password', 10);
console.log(hash);
```

---

## Step 4: Start Development Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

---

## Step 5: Test the Application

### Test User Flow
1. Go to http://localhost:5173
2. Click "Find Artists"
3. Register as User
4. Browse artists
5. Create booking

### Test Artist Flow
1. Click "Join as Artist"
2. Register as Artist
3. View booking requests
4. Accept/Reject bookings

### Test Admin Flow
1. Go to http://localhost:5173/admin/login
2. Login with admin credentials
3. View dashboard
4. Manage users/artists

---

## Folder Structure

```
spotmystar/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── artistController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── artist.js
│   │   └── admin.js
│   ├── scripts/
│   │   └── migrate.js
│   ├── utils/
│   │   └── idGenerator.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboards/
│   │   │   └── LandingPage.jsx
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT.md
│   └── SETUP_GUIDE.md
└── README.md
```

---

## Database Schema

### Tables
- `users` - User accounts (4-digit ID)
- `artists` - Artist profiles (5-digit ID)
- `brands` - Brand accounts (6-digit ID)
- `admins` - Admin accounts
- `bookings` - Booking requests (7-digit alphanumeric ID)
- `categories` - Artist categories
- `favorites` - User favorites
- `reviews` - Artist reviews
- `reports` - Content reports
- `refresh_tokens` - JWT refresh tokens

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
Solution: Ensure PostgreSQL is running
```bash
# Windows
net start postgresql-x64-14

# Mac
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
Solution: Change PORT in .env or kill process
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Migration Fails
```
Error: relation "users" already exists
```
Solution: Drop and recreate database
```bash
psql -U postgres
DROP DATABASE spotmystar;
CREATE DATABASE spotmystar;
\q
npm run migrate
```

---

## Next Steps

1. Customize categories in database
2. Add more artist fields as needed
3. Implement payment integration
4. Add email notifications
5. Implement file upload for images
6. Add search filters
7. Implement rating system
8. Add admin analytics charts

---

## Support

For issues or questions:
- Check API documentation
- Review error logs
- Check database connections
- Verify environment variables
