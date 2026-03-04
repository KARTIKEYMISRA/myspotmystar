# SpotMYstar - Quick Reference Guide

## 🚀 Quick Commands

### Development
```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Run migrations
cd backend && npm run migrate

# Install all dependencies
cd backend && npm install && cd ../frontend && npm install
```

### Database
```bash
# Create database
psql -U postgres -c "CREATE DATABASE spotmystar;"

# Drop database
psql -U postgres -c "DROP DATABASE spotmystar;"

# Connect to database
psql -U postgres -d spotmystar

# View tables
\dt

# View table structure
\d users
```

### Testing
```bash
# Test backend health
curl http://localhost:5000/health

# Test user registration
curl -X POST http://localhost:5000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test User"}'
```

## 📋 Common Tasks

### Add New Admin
```sql
-- Connect to database
psql -U postgres -d spotmystar

-- Hash password first (use bcrypt online or in Node.js)
-- Then insert
INSERT INTO admins (email, password, name) 
VALUES ('admin@example.com', '$2a$10$...hashed...', 'Admin Name');
```

### Reset User Password
```sql
-- Generate hash for new password
-- Then update
UPDATE users SET password = '$2a$10$...new_hash...' WHERE email = 'user@example.com';
```

### Add New Category
```sql
INSERT INTO categories (name, description, icon) 
VALUES ('Actor', 'Acting and theater performances', 'theater');
```

### View All Bookings
```sql
SELECT b.booking_id, u.name as user_name, a.name as artist_name, b.status, b.created_at
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN artists a ON b.artist_id = a.artist_id
ORDER BY b.created_at DESC;
```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spotmystar
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
```

## 🌐 API Endpoints Quick Reference

### Authentication
```
POST /api/auth/user/register
POST /api/auth/user/login
POST /api/auth/artist/register
POST /api/auth/artist/login
POST /api/auth/brand/register
POST /api/auth/brand/login
POST /api/auth/admin/login
```

### User Routes (Requires User Token)
```
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/user/artists
GET    /api/user/artists/:artist_id
POST   /api/user/bookings
GET    /api/user/bookings
POST   /api/user/favorites
DELETE /api/user/favorites/:artist_id
GET    /api/user/favorites
```

### Artist Routes (Requires Artist Token)
```
GET /api/artist/profile
PUT /api/artist/profile
GET /api/artist/bookings
PUT /api/artist/bookings/:booking_id/accept
PUT /api/artist/bookings/:booking_id/reject
GET /api/artist/earnings
```

### Admin Routes (Requires Admin Token)
```
GET    /api/admin/dashboard
GET    /api/admin/users
PUT    /api/admin/users/:user_id/toggle-status
DELETE /api/admin/users/:user_id
GET    /api/admin/artists
PUT    /api/admin/artists/:artist_id/toggle-status
PUT    /api/admin/artists/:artist_id/verify
DELETE /api/admin/artists/:artist_id
GET    /api/admin/brands
GET    /api/admin/bookings
PUT    /api/admin/bookings/:booking_id/cancel
GET    /api/admin/categories
POST   /api/admin/categories
```

## 🔑 Default Credentials

### Admin (After Migration)
```
Email: admin@spotmystar.com
Password: (set during migration - check migrate.js)
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### Database Connection Failed
```bash
# Check if PostgreSQL is running
# Windows
net start postgresql-x64-14

# Mac
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Check connection
psql -U postgres -c "SELECT version();"
```

### CORS Error
```javascript
// In backend/server.js, update CORS origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### JWT Token Invalid
```javascript
// Check if JWT_SECRET is set in .env
// Verify token format: "Bearer <token>"
// Check token expiration
```

## 📊 Database Queries

### Get User Statistics
```sql
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_users_week
FROM users;
```

### Get Artist Statistics
```sql
SELECT 
  category,
  COUNT(*) as count,
  AVG(rating) as avg_rating,
  SUM(total_bookings) as total_bookings
FROM artists
WHERE is_active = true
GROUP BY category
ORDER BY count DESC;
```

### Get Booking Statistics
```sql
SELECT 
  status,
  COUNT(*) as count,
  SUM(price) as total_value
FROM bookings
GROUP BY status;
```

### Top Artists by Bookings
```sql
SELECT 
  a.name,
  a.category,
  a.city,
  COUNT(b.booking_id) as booking_count,
  AVG(b.price) as avg_price
FROM artists a
LEFT JOIN bookings b ON a.artist_id = b.artist_id
WHERE b.status = 'completed'
GROUP BY a.artist_id, a.name, a.category, a.city
ORDER BY booking_count DESC
LIMIT 10;
```

## 🎨 UI Customization

### Change Primary Color
```javascript
// frontend/tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#6366f1',  // Change this
      secondary: '#8b5cf6', // Change this
    }
  }
}
```

### Update Logo
```jsx
// In navigation components, replace
<h1 className="text-2xl font-bold text-primary">SpotMYstar</h1>
// with
<img src="/logo.png" alt="SpotMYstar" className="h-8" />
```

## 📱 Mobile Testing

### Test Responsive Design
```bash
# Open in browser and use DevTools
# Chrome: F12 > Toggle Device Toolbar
# Test breakpoints: 320px, 768px, 1024px, 1440px
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Update environment variables
- [ ] Test all authentication flows
- [ ] Test role-based access
- [ ] Run database migrations
- [ ] Update CORS settings
- [ ] Set NODE_ENV=production
- [ ] Test API endpoints
- [ ] Check error handling

### Post-Deployment
- [ ] Verify database connection
- [ ] Test user registration
- [ ] Test booking flow
- [ ] Check admin panel
- [ ] Monitor error logs
- [ ] Set up monitoring
- [ ] Configure backups

## 📞 Quick Links

- **API Docs**: `/docs/API_DOCUMENTATION.md`
- **Setup Guide**: `/docs/SETUP_GUIDE.md`
- **Deployment**: `/docs/DEPLOYMENT.md`
- **Database Schema**: `/docs/DATABASE_SCHEMA.md`
- **Features**: `/docs/FEATURES.md`

## 💡 Pro Tips

1. **Use Postman/Insomnia** for API testing
2. **Enable auto-save** in your editor
3. **Use database GUI** (pgAdmin, DBeaver)
4. **Keep .env.example updated**
5. **Document new features**
6. **Test on multiple browsers**
7. **Use Git branches** for features
8. **Regular database backups**
9. **Monitor server logs**
10. **Keep dependencies updated**

---

**Need more help?** Check the full documentation in `/docs` folder!
