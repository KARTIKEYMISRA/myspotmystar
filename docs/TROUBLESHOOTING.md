# Troubleshooting Guide

This guide helps you resolve common issues when setting up or running SpotMYstar.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Database Issues](#database-issues)
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [Authentication Issues](#authentication-issues)
- [API Issues](#api-issues)
- [Performance Issues](#performance-issues)

---

## Installation Issues

### Node.js Not Found

**Error**: `'node' is not recognized as an internal or external command`

**Solution**:
1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Restart your terminal
3. Verify installation: `node -v`

### npm Install Fails

**Error**: `npm ERR! code EACCES` or permission errors

**Solution**:
```bash
# Windows (Run as Administrator)
npm install

# Mac/Linux
sudo npm install
# or fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Package Version Conflicts

**Error**: `npm ERR! peer dependency conflict`

**Solution**:
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Or use --legacy-peer-deps
npm install --legacy-peer-deps
```

---

## Database Issues

### PostgreSQL Not Running

**Error**: `ECONNREFUSED` or `Connection refused`

**Solution**:

**Windows**:
```bash
# Check status
sc query postgresql-x64-14

# Start service
net start postgresql-x64-14
```

**Mac**:
```bash
# Check status
brew services list

# Start PostgreSQL
brew services start postgresql
```

**Linux**:
```bash
# Check status
sudo systemctl status postgresql

# Start service
sudo systemctl start postgresql
```

### Database Does Not Exist

**Error**: `database "spotmystar" does not exist`

**Solution**:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE spotmystar;

# Exit
\q

# Run migrations
cd backend && npm run migrate
```

### Authentication Failed

**Error**: `password authentication failed for user "postgres"`

**Solution**:
1. Check password in `backend/.env`
2. Reset PostgreSQL password:
   ```bash
   # Windows
   psql -U postgres
   ALTER USER postgres PASSWORD 'new_password';
   
   # Mac/Linux
   sudo -u postgres psql
   ALTER USER postgres PASSWORD 'new_password';
   ```
3. Update `.env` file with new password

### Migration Fails

**Error**: `relation already exists` or migration errors

**Solution**:
```bash
# Backup existing data
pg_dump -U postgres spotmystar > backup.sql

# Drop and recreate database
psql -U postgres -c "DROP DATABASE spotmystar;"
psql -U postgres -c "CREATE DATABASE spotmystar;"

# Run migrations again
cd backend && npm run migrate

# Restore data if needed
psql -U postgres spotmystar < backup.sql
```

### Connection Pool Exhausted

**Error**: `sorry, too many clients already`

**Solution**:
1. Check for connection leaks in code
2. Increase max connections in PostgreSQL:
   ```bash
   # Edit postgresql.conf
   max_connections = 200
   
   # Restart PostgreSQL
   ```
3. Use connection pooling properly

---

## Backend Issues

### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:

**Windows**:
```bash
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

**Mac/Linux**:
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port
PORT=5001
```

### Environment Variables Not Loaded

**Error**: `undefined` values or missing config

**Solution**:
1. Ensure `.env` file exists in backend directory
2. Check file name (not `.env.txt`)
3. Restart server after changes
4. Verify with:
   ```javascript
   console.log(process.env.JWT_SECRET);
   ```

### Module Not Found

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
cd backend
npm install
# or install specific package
npm install express
```

### JWT Secret Not Set

**Error**: `JWT_SECRET is not defined`

**Solution**:
1. Check `backend/.env` file
2. Add JWT_SECRET:
   ```env
   JWT_SECRET=your_secret_key_min_32_characters_long
   ```
3. Restart server

### CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
1. Check `FRONTEND_URL` in `backend/.env`
2. Verify CORS configuration in `server.js`:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
     credentials: true
   }));
   ```
3. Restart backend server

---

## Frontend Issues

### Vite Server Won't Start

**Error**: Port 5173 in use or Vite errors

**Solution**:
```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>

# Or change port in vite.config.js
server: {
  port: 5174
}
```

### Blank Page / White Screen

**Error**: Nothing displays on frontend

**Solution**:
1. Check browser console for errors
2. Verify backend is running
3. Check API URL in `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Clear browser cache
5. Check network tab for failed requests

### API Calls Failing

**Error**: `Network Error` or `404 Not Found`

**Solution**:
1. Verify backend is running on port 5000
2. Check proxy configuration in `vite.config.js`
3. Verify API endpoints in `frontend/src/utils/api.js`
4. Check browser console for errors
5. Test API directly: `curl http://localhost:5000/health`

### Routing Not Working

**Error**: 404 on page refresh or navigation

**Solution**:
1. Ensure React Router is configured correctly
2. For production, configure server redirects
3. Check `App.jsx` routes
4. Verify protected route logic

### Tailwind Styles Not Applied

**Error**: No styling or plain HTML

**Solution**:
1. Check `index.css` has Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
2. Verify `tailwind.config.js` content paths
3. Restart Vite dev server
4. Clear browser cache

---

## Authentication Issues

### Login Fails with Correct Credentials

**Error**: `Invalid credentials` but password is correct

**Solution**:
1. Check if user exists in database:
   ```sql
   SELECT * FROM users WHERE email = 'user@example.com';
   ```
2. Verify password is hashed in database
3. Check bcrypt comparison in controller
4. Verify JWT_SECRET is set
5. Check for typos in email

### Token Invalid or Expired

**Error**: `Invalid token` or `Token expired`

**Solution**:
1. Clear localStorage in browser:
   ```javascript
   localStorage.clear();
   ```
2. Login again to get new token
3. Check token expiration in `.env`:
   ```env
   JWT_EXPIRE=24h
   ```
4. Verify token format: `Bearer <token>`

### Cannot Access Protected Routes

**Error**: `Access denied` or redirected to login

**Solution**:
1. Check if token is stored:
   ```javascript
   console.log(localStorage.getItem('auth-storage'));
   ```
2. Verify role matches route requirement
3. Check middleware in backend
4. Verify token is sent in headers
5. Check protected route logic in `App.jsx`

### Role Mismatch

**Error**: `Insufficient permissions` or wrong dashboard

**Solution**:
1. Verify user role in database
2. Check role in JWT token payload
3. Ensure role is stored in Zustand state
4. Verify middleware checks correct role
5. Clear state and re-login

---

## API Issues

### 404 Not Found

**Error**: API endpoint returns 404

**Solution**:
1. Verify endpoint URL is correct
2. Check route is registered in `server.js`
3. Verify HTTP method (GET, POST, PUT, DELETE)
4. Check for typos in route path
5. Test with curl:
   ```bash
   curl http://localhost:5000/api/user/profile \
     -H "Authorization: Bearer <token>"
   ```

### 500 Internal Server Error

**Error**: Server error on API call

**Solution**:
1. Check backend console for error details
2. Verify database connection
3. Check for missing required fields
4. Verify data types match schema
5. Check for null/undefined values
6. Review controller error handling

### Rate Limit Exceeded

**Error**: `Too many requests`

**Solution**:
1. Wait 15 minutes for limit reset
2. Reduce request frequency
3. Adjust rate limit in `server.js`:
   ```javascript
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 200 // increase limit
   });
   ```

### Request Timeout

**Error**: Request takes too long or times out

**Solution**:
1. Check database query performance
2. Add indexes to frequently queried fields
3. Optimize complex queries
4. Check network connection
5. Increase timeout in Axios:
   ```javascript
   axios.defaults.timeout = 10000; // 10 seconds
   ```

---

## Performance Issues

### Slow Database Queries

**Problem**: Queries take too long

**Solution**:
1. Add indexes:
   ```sql
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_bookings_status ON bookings(status);
   ```
2. Use EXPLAIN to analyze queries:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM bookings WHERE status = 'pending';
   ```
3. Limit result sets with pagination
4. Avoid SELECT * when possible

### High Memory Usage

**Problem**: Application uses too much memory

**Solution**:
1. Check for memory leaks
2. Close database connections properly
3. Limit result set sizes
4. Use pagination
5. Monitor with:
   ```bash
   node --inspect server.js
   ```

### Slow Frontend Loading

**Problem**: Pages load slowly

**Solution**:
1. Build for production:
   ```bash
   npm run build
   ```
2. Enable code splitting
3. Lazy load components
4. Optimize images
5. Use CDN for static assets
6. Enable compression

---

## General Debugging Tips

### Enable Debug Logging

**Backend**:
```javascript
// Add to server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

**Frontend**:
```javascript
// Add to api.js
api.interceptors.request.use(config => {
  console.log('Request:', config);
  return config;
});
```

### Check Logs

**Backend**:
```bash
# View server logs
tail -f logs/app.log

# Or console output
npm run dev
```

**Frontend**:
- Open browser DevTools (F12)
- Check Console tab
- Check Network tab
- Check Application tab (localStorage)

### Test API with curl

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test"}'

# Login
curl -X POST http://localhost:5000/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Protected route
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer <token>"
```

### Database Debugging

```sql
-- Check table exists
\dt

-- View table structure
\d users

-- Count records
SELECT COUNT(*) FROM users;

-- Check recent records
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;

-- Check for duplicates
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;
```

---

## Still Having Issues?

1. Check the [documentation](../README.md)
2. Review [API Documentation](API_DOCUMENTATION.md)
3. Check [Setup Guide](SETUP_GUIDE.md)
4. Search [closed issues](https://github.com/yourusername/spotmystar/issues?q=is%3Aissue+is%3Aclosed)
5. Create a [new issue](https://github.com/yourusername/spotmystar/issues/new)

---

**Remember**: Always backup your database before making major changes!
