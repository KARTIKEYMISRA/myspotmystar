# Testing Guide

Comprehensive guide for testing SpotMYstar application.

## Table of Contents

- [Manual Testing](#manual-testing)
- [API Testing](#api-testing)
- [Database Testing](#database-testing)
- [Frontend Testing](#frontend-testing)
- [Security Testing](#security-testing)
- [Performance Testing](#performance-testing)

---

## Manual Testing

### User Registration & Login Flow

#### Test User Registration

1. Navigate to http://localhost:5173/user/register
2. Fill in the form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: password123
3. Click "Register"
4. Verify:
   - ✅ Redirected to user dashboard
   - ✅ User ID displayed (4-digit)
   - ✅ Token stored in localStorage
   - ✅ User record in database

#### Test User Login

1. Navigate to http://localhost:5173/user/login
2. Enter credentials
3. Click "Login"
4. Verify:
   - ✅ Redirected to dashboard
   - ✅ User data loaded
   - ✅ Protected routes accessible

### Artist Registration & Login Flow

#### Test Artist Registration

1. Navigate to http://localhost:5173/artist/register
2. Fill in the form:
   - Name: Test Artist
   - Email: artist@example.com
   - Password: password123
   - Category: Singer
   - City: Mumbai
   - Bio: Professional singer
   - Price Range: ₹10,000 - ₹50,000
3. Click "Register"
4. Verify:
   - ✅ Artist ID generated (5-digit)
   - ✅ Redirected to artist dashboard
   - ✅ Profile data saved

### Booking Flow

#### Test Booking Creation (User)

1. Login as user
2. Browse artists
3. Click on an artist
4. Click "Book Artist"
5. Fill booking form:
   - Event Date: Future date
   - Event Time: Valid time
   - Location: Test Location
   - Event Type: Wedding
   - Message: Test booking
6. Submit
7. Verify:
   - ✅ Booking ID generated (7-digit)
   - ✅ Status: requested
   - ✅ Appears in user's bookings
   - ✅ Appears in artist's bookings

#### Test Booking Acceptance (Artist)

1. Login as artist
2. Go to bookings
3. Find pending booking
4. Enter price: 25000
5. Click "Accept"
6. Verify:
   - ✅ Status changed to accepted
   - ✅ Price saved
   - ✅ User sees updated status

### Admin Functions

#### Test User Management

1. Login as admin
2. Go to Users section
3. Test:
   - ✅ View all users
   - ✅ Block user
   - ✅ Unblock user
   - ✅ Delete user
   - ✅ Verify blocked user cannot login

#### Test Artist Verification

1. Login as admin
2. Go to Artists section
3. Click "Verify" on an artist
4. Verify:
   - ✅ is_verified = true in database
   - ✅ Badge shows on artist profile

---

## API Testing

### Using curl

#### Health Check

```bash
curl http://localhost:5000/health
```

Expected:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### User Registration

```bash
curl -X POST http://localhost:5000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Expected:
```json
{
  "user": {
    "user_id": "1234",
    "email": "test@example.com",
    "name": "Test User"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### User Login

```bash
curl -X POST http://localhost:5000/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get User Profile (Protected)

```bash
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Browse Artists

```bash
curl http://localhost:5000/api/user/artists \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Create Booking

```bash
curl -X POST http://localhost:5000/api/user/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "artist_id": "12345",
    "event_date": "2024-12-31",
    "event_time": "18:00",
    "location": "Mumbai",
    "event_type": "Wedding",
    "message": "Looking forward to your performance"
  }'
```

### Using Postman

1. **Import Collection**
   - Create new collection "SpotMYstar"
   - Add environment variables:
     - `base_url`: http://localhost:5000/api
     - `token`: (will be set after login)

2. **Test Authentication**
   - POST {{base_url}}/auth/user/register
   - POST {{base_url}}/auth/user/login
   - Save token from response

3. **Test Protected Routes**
   - Add Authorization header: `Bearer {{token}}`
   - GET {{base_url}}/user/profile
   - GET {{base_url}}/user/artists

4. **Test CRUD Operations**
   - Create booking
   - Get bookings
   - Update profile
   - Add favorite

### API Test Checklist

#### Authentication Endpoints
- [ ] User registration works
- [ ] Artist registration works
- [ ] Brand registration works
- [ ] User login works
- [ ] Artist login works
- [ ] Admin login works
- [ ] Invalid credentials rejected
- [ ] Duplicate email rejected
- [ ] Weak password rejected

#### User Endpoints
- [ ] Get profile
- [ ] Update profile
- [ ] Browse artists
- [ ] Get artist details
- [ ] Create booking
- [ ] Get bookings
- [ ] Add favorite
- [ ] Remove favorite
- [ ] Get favorites

#### Artist Endpoints
- [ ] Get profile
- [ ] Update profile
- [ ] Get bookings
- [ ] Accept booking
- [ ] Reject booking
- [ ] Get earnings

#### Admin Endpoints
- [ ] Get dashboard stats
- [ ] Get all users
- [ ] Block/unblock user
- [ ] Delete user
- [ ] Get all artists
- [ ] Verify artist
- [ ] Get all bookings
- [ ] Cancel booking
- [ ] Add category

---

## Database Testing

### Test Data Integrity

```sql
-- Check unique constraints
SELECT email, COUNT(*) 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Check foreign keys
SELECT b.booking_id, b.user_id, b.artist_id
FROM bookings b
LEFT JOIN users u ON b.user_id = u.user_id
LEFT JOIN artists a ON b.artist_id = a.artist_id
WHERE u.user_id IS NULL OR a.artist_id IS NULL;

-- Check ID formats
SELECT user_id FROM users WHERE LENGTH(user_id::text) != 4;
SELECT artist_id FROM artists WHERE LENGTH(artist_id::text) != 5;
SELECT brand_id FROM brands WHERE LENGTH(brand_id::text) != 6;

-- Check timestamps
SELECT * FROM users WHERE created_at > NOW();
SELECT * FROM bookings WHERE event_date < created_at;
```

### Test Cascading Deletes

```sql
-- Create test user
INSERT INTO users (email, password, name) 
VALUES ('delete_test@test.com', 'hash', 'Delete Test');

-- Create test booking
INSERT INTO bookings (user_id, artist_id, event_date, event_time, location, event_type)
VALUES ('1234', '12345', '2024-12-31', '18:00', 'Test', 'Test');

-- Delete user
DELETE FROM users WHERE email = 'delete_test@test.com';

-- Verify bookings deleted
SELECT * FROM bookings WHERE user_id = '1234';
-- Should return 0 rows
```

### Test Indexes

```sql
-- Check if indexes exist
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'users';

-- Test query performance
EXPLAIN ANALYZE 
SELECT * FROM bookings WHERE status = 'pending';

-- Should use index scan, not sequential scan
```

---

## Frontend Testing

### Manual UI Testing

#### Responsive Design
- [ ] Test on mobile (320px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1024px+)
- [ ] Navigation works on all sizes
- [ ] Forms are usable on mobile
- [ ] Tables scroll horizontally on mobile

#### Form Validation
- [ ] Required fields show error
- [ ] Email validation works
- [ ] Password strength checked
- [ ] Date validation works
- [ ] Error messages clear
- [ ] Success messages show

#### Navigation
- [ ] All links work
- [ ] Back button works
- [ ] Protected routes redirect
- [ ] Logout works
- [ ] Role-based navigation correct

#### State Management
- [ ] Login persists on refresh
- [ ] Logout clears state
- [ ] Data updates reflect immediately
- [ ] No stale data shown

### Browser Testing

Test on:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Screen reader compatible

---

## Security Testing

### Authentication Security

#### Test JWT Security
```bash
# Test without token
curl http://localhost:5000/api/user/profile

# Should return 401 Unauthorized

# Test with invalid token
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer invalid_token"

# Should return 401 Invalid token

# Test with expired token
# (Use token from 25 hours ago)
# Should return 401 Token expired
```

#### Test Role-Based Access

```bash
# Login as user
USER_TOKEN="..."

# Try to access admin route
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer $USER_TOKEN"

# Should return 403 Forbidden
```

### Input Validation

#### Test SQL Injection

```bash
# Try SQL injection in login
curl -X POST http://localhost:5000/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com OR 1=1--",
    "password": "anything"
  }'

# Should be rejected, not execute SQL
```

#### Test XSS

```bash
# Try XSS in registration
curl -X POST http://localhost:5000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123",
    "name": "<script>alert(\"XSS\")</script>"
  }'

# Should be sanitized or rejected
```

### Rate Limiting

```bash
# Send 101 requests rapidly
for i in {1..101}; do
  curl http://localhost:5000/api/user/artists \
    -H "Authorization: Bearer $TOKEN"
done

# 101st request should return 429 Too Many Requests
```

---

## Performance Testing

### Load Testing with Apache Bench

```bash
# Install Apache Bench
# Ubuntu: sudo apt-get install apache2-utils
# Mac: brew install httpd

# Test health endpoint
ab -n 1000 -c 10 http://localhost:5000/health

# Test API endpoint
ab -n 100 -c 5 \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/user/artists
```

### Database Performance

```sql
-- Test query performance
EXPLAIN ANALYZE 
SELECT * FROM bookings 
WHERE status = 'pending' 
ORDER BY created_at DESC 
LIMIT 10;

-- Should complete in < 10ms with indexes
```

### Frontend Performance

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit
4. Check scores:
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

---

## Test Automation (Future)

### Backend Tests (Jest)

```javascript
// Example test
describe('User Registration', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/user/register')
      .send({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('user_id');
  });
});
```

### Frontend Tests (React Testing Library)

```javascript
// Example test
import { render, screen } from '@testing-library/react';
import UserLogin from './UserLogin';

test('renders login form', () => {
  render(<UserLogin />);
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
});
```

---

## Test Checklist

### Before Deployment

- [ ] All API endpoints tested
- [ ] All user flows tested
- [ ] Security tests passed
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Database integrity verified
- [ ] Responsive design works
- [ ] Cross-browser compatible
- [ ] Accessibility checked
- [ ] Documentation updated

---

**Happy Testing! 🧪**
