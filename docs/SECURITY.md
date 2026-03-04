# Security Best Practices

Comprehensive security guide for SpotMYstar application.

## Table of Contents

- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [API Security](#api-security)
- [Database Security](#database-security)
- [Frontend Security](#frontend-security)
- [Production Security](#production-security)
- [Security Checklist](#security-checklist)

---

## Authentication & Authorization

### JWT Token Security

#### Current Implementation ✅

```javascript
// Token generation with expiration
const token = jwt.sign(
  { id: user.user_id, role: 'user' },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

#### Best Practices

1. **Use Strong Secrets**
   ```env
   # Bad
   JWT_SECRET=secret123
   
   # Good
   JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
   ```

2. **Token Expiration**
   - Access tokens: 15 minutes - 24 hours
   - Refresh tokens: 7 days - 30 days
   - Implement token refresh mechanism

3. **Token Storage**
   ```javascript
   // Frontend - Use httpOnly cookies (more secure) or localStorage
   // Current: localStorage (acceptable for development)
   // Production: Consider httpOnly cookies
   ```

4. **Token Validation**
   ```javascript
   // Always verify token on protected routes
   const verifyToken = (req, res, next) => {
     const token = req.headers.authorization?.split(' ')[1];
     if (!token) return res.status(401).json({ error: 'No token' });
     
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
     } catch (error) {
       return res.status(401).json({ error: 'Invalid token' });
     }
   };
   ```

### Password Security

#### Current Implementation ✅

```javascript
// Password hashing with bcrypt (10 rounds)
const hashedPassword = await bcrypt.hash(password, 10);

// Password verification
const validPassword = await bcrypt.compare(password, user.password);
```

#### Best Practices

1. **Password Requirements**
   ```javascript
   // Implement strong password policy
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   
   // Minimum 8 characters
   // At least one uppercase letter
   // At least one lowercase letter
   // At least one number
   // At least one special character
   ```

2. **Password Storage**
   - ✅ Never store plain text passwords
   - ✅ Use bcrypt with salt rounds >= 10
   - ✅ Never log passwords
   - ✅ Never send passwords in responses

3. **Password Reset**
   ```javascript
   // Generate secure reset token
   const resetToken = crypto.randomBytes(32).toString('hex');
   const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
   
   // Store hashed token with expiration
   // Send plain token via email
   // Verify and expire after use
   ```

### Role-Based Access Control (RBAC)

#### Current Implementation ✅

```javascript
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};
```

#### Best Practices

1. **Principle of Least Privilege**
   - Grant minimum necessary permissions
   - Separate roles clearly
   - Validate role on every request

2. **Role Validation**
   ```javascript
   // Always check role in middleware
   // Never trust client-side role checks
   // Validate role from JWT token, not request body
   ```

---

## Data Protection

### Input Validation

#### Current Implementation ✅

```javascript
const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty()
];
```

#### Best Practices

1. **Validate All Inputs**
   ```javascript
   // Validate type, format, length, range
   body('email').isEmail().normalizeEmail(),
   body('age').isInt({ min: 18, max: 120 }),
   body('phone').matches(/^\d{10}$/),
   body('url').isURL()
   ```

2. **Sanitize Inputs**
   ```javascript
   // Remove dangerous characters
   body('name').trim().escape(),
   body('bio').trim().escape()
   ```

3. **Whitelist Approach**
   ```javascript
   // Only accept expected fields
   const allowedFields = ['name', 'email', 'bio'];
   const sanitizedData = {};
   allowedFields.forEach(field => {
     if (req.body[field]) sanitizedData[field] = req.body[field];
   });
   ```

### SQL Injection Prevention

#### Current Implementation ✅

```javascript
// Using parameterized queries
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
```

#### Best Practices

1. **Always Use Parameterized Queries**
   ```javascript
   // Bad - Vulnerable to SQL injection
   const query = `SELECT * FROM users WHERE email = '${email}'`;
   
   // Good - Safe from SQL injection
   const query = 'SELECT * FROM users WHERE email = $1';
   const result = await pool.query(query, [email]);
   ```

2. **Never Concatenate User Input**
   ```javascript
   // Bad
   const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
   
   // Good
   const query = 'SELECT * FROM users WHERE id = $1';
   await pool.query(query, [req.params.id]);
   ```

### XSS Prevention

#### Current Implementation ✅

```javascript
// Input sanitization with express-validator
body('name').trim().escape()
```

#### Best Practices

1. **Sanitize Output**
   ```javascript
   // Frontend - React automatically escapes
   <div>{user.name}</div> // Safe
   
   // Dangerous - Don't use dangerouslySetInnerHTML
   <div dangerouslySetInnerHTML={{__html: user.bio}} /> // Unsafe
   ```

2. **Content Security Policy**
   ```javascript
   // Add CSP headers
   app.use(helmet.contentSecurityPolicy({
     directives: {
       defaultSrc: ["'self'"],
       scriptSrc: ["'self'", "'unsafe-inline'"],
       styleSrc: ["'self'", "'unsafe-inline'"],
       imgSrc: ["'self'", "data:", "https:"],
     }
   }));
   ```

---

## API Security

### Rate Limiting

#### Current Implementation ✅

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

#### Best Practices

1. **Different Limits for Different Endpoints**
   ```javascript
   // Strict limit for auth endpoints
   const authLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5 // 5 attempts per 15 minutes
   });
   app.use('/api/auth/login', authLimiter);
   
   // Moderate limit for API
   const apiLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   app.use('/api/', apiLimiter);
   ```

2. **Account-Based Rate Limiting**
   ```javascript
   // Limit per user, not just per IP
   const userLimiter = rateLimit({
     keyGenerator: (req) => req.user?.id || req.ip,
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   ```

### CORS Configuration

#### Current Implementation ✅

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

#### Best Practices

1. **Whitelist Specific Origins**
   ```javascript
   const allowedOrigins = [
     'https://spotmystar.com',
     'https://www.spotmystar.com',
     'http://localhost:5173'
   ];
   
   app.use(cors({
     origin: (origin, callback) => {
       if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials: true
   }));
   ```

2. **Limit Methods and Headers**
   ```javascript
   app.use(cors({
     origin: allowedOrigins,
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization'],
     credentials: true
   }));
   ```

### Security Headers

#### Current Implementation ✅

```javascript
app.use(helmet());
```

#### Best Practices

1. **Configure Helmet Properly**
   ```javascript
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         styleSrc: ["'self'", "'unsafe-inline'"],
         scriptSrc: ["'self'"],
         imgSrc: ["'self'", "data:", "https:"],
       },
     },
     hsts: {
       maxAge: 31536000,
       includeSubDomains: true,
       preload: true
     }
   }));
   ```

---

## Database Security

### Connection Security

#### Best Practices

1. **Use Environment Variables**
   ```env
   # Never commit database credentials
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=strong_password_here
   ```

2. **Use SSL/TLS**
   ```javascript
   const pool = new Pool({
     host: process.env.DB_HOST,
     ssl: process.env.NODE_ENV === 'production' ? {
       rejectUnauthorized: true
     } : false
   });
   ```

3. **Limit Database User Permissions**
   ```sql
   -- Create app-specific user
   CREATE USER spotmystar_app WITH PASSWORD 'strong_password';
   
   -- Grant only necessary permissions
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO spotmystar_app;
   
   -- Don't grant DROP, CREATE, ALTER
   ```

### Data Encryption

#### Best Practices

1. **Encrypt Sensitive Data**
   ```javascript
   const crypto = require('crypto');
   
   // Encrypt sensitive fields
   const encrypt = (text) => {
     const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
     let encrypted = cipher.update(text, 'utf8', 'hex');
     encrypted += cipher.final('hex');
     return encrypted;
   };
   
   // Decrypt when needed
   const decrypt = (encrypted) => {
     const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
     let decrypted = decipher.update(encrypted, 'hex', 'utf8');
     decrypted += decipher.final('utf8');
     return decrypted;
   };
   ```

2. **Backup Encryption**
   ```bash
   # Encrypt database backups
   pg_dump spotmystar | gpg --encrypt --recipient admin@spotmystar.com > backup.sql.gpg
   ```

---

## Frontend Security

### Token Storage

#### Current Implementation

```javascript
// Stored in localStorage via Zustand persist
localStorage.setItem('auth-storage', JSON.stringify(state));
```

#### Best Practices

1. **Consider httpOnly Cookies**
   ```javascript
   // More secure than localStorage
   // Immune to XSS attacks
   // Backend sets cookie:
   res.cookie('token', token, {
     httpOnly: true,
     secure: true,
     sameSite: 'strict',
     maxAge: 24 * 60 * 60 * 1000
   });
   ```

2. **Clear Sensitive Data**
   ```javascript
   // Clear on logout
   const logout = () => {
     localStorage.clear();
     sessionStorage.clear();
     // Clear cookies if used
   };
   ```

### API Request Security

#### Best Practices

1. **Always Use HTTPS in Production**
   ```javascript
   // Redirect HTTP to HTTPS
   if (process.env.NODE_ENV === 'production' && req.protocol === 'http') {
     return res.redirect(301, `https://${req.headers.host}${req.url}`);
   }
   ```

2. **Validate Responses**
   ```javascript
   // Don't trust API responses blindly
   api.interceptors.response.use(
     response => {
       // Validate response structure
       if (!response.data) throw new Error('Invalid response');
       return response;
     },
     error => {
       // Handle errors securely
       if (error.response?.status === 401) {
         logout();
       }
       return Promise.reject(error);
     }
   );
   ```

---

## Production Security

### Environment Variables

```env
# Production .env
NODE_ENV=production
PORT=5000

# Strong secrets (min 32 characters)
JWT_SECRET=use_a_very_long_random_string_here_min_32_chars
JWT_REFRESH_SECRET=another_very_long_random_string_different_from_above

# Database with SSL
DB_HOST=production-db.example.com
DB_SSL=true

# HTTPS only
FRONTEND_URL=https://spotmystar.com
```

### HTTPS Configuration

```javascript
// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### Logging & Monitoring

```javascript
// Log security events
const logSecurityEvent = (event, details) => {
  console.log({
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: details.ip,
    userAgent: details.userAgent
  });
};

// Log failed login attempts
logSecurityEvent('FAILED_LOGIN', {
  email: req.body.email,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});
```

### Regular Updates

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

---

## Security Checklist

### Development
- [ ] Use environment variables for secrets
- [ ] Never commit .env files
- [ ] Use parameterized queries
- [ ] Validate all inputs
- [ ] Sanitize outputs
- [ ] Implement rate limiting
- [ ] Use HTTPS in development
- [ ] Hash passwords with bcrypt
- [ ] Implement JWT properly
- [ ] Use security headers (Helmet)

### Production
- [ ] Change all default credentials
- [ ] Use strong JWT secrets (32+ chars)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Enable database SSL
- [ ] Implement logging
- [ ] Set up monitoring
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Implement CSP headers
- [ ] Use httpOnly cookies
- [ ] Enable HSTS
- [ ] Implement 2FA (future)
- [ ] Regular penetration testing

### Monitoring
- [ ] Monitor failed login attempts
- [ ] Track API usage
- [ ] Alert on suspicious activity
- [ ] Log security events
- [ ] Monitor database queries
- [ ] Track error rates
- [ ] Monitor server resources

---

## Security Incident Response

### If Breach Detected

1. **Immediate Actions**
   - Isolate affected systems
   - Change all credentials
   - Revoke all JWT tokens
   - Enable maintenance mode

2. **Investigation**
   - Review logs
   - Identify breach vector
   - Assess damage
   - Document findings

3. **Recovery**
   - Patch vulnerabilities
   - Restore from clean backup
   - Reset all passwords
   - Notify affected users

4. **Prevention**
   - Implement additional security
   - Update security policies
   - Train team
   - Regular security audits

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Security is an ongoing process, not a one-time task!** 🔒
