# SpotMYstar API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Routes

### User Registration
```
POST /auth/user/register
Body: { email, password, name, phone?, city? }
Response: { user, accessToken, refreshToken }
```

### User Login
```
POST /auth/user/login
Body: { email, password }
Response: { user, accessToken, refreshToken }
```

### Artist Registration
```
POST /auth/artist/register
Body: { email, password, name, phone?, city?, category, bio?, price_min?, price_max? }
Response: { artist, accessToken, refreshToken }
```

### Artist Login
```
POST /auth/artist/login
Body: { email, password }
Response: { artist, accessToken, refreshToken }
```

### Brand Registration
```
POST /auth/brand/register
Body: { email, password, company_name, contact_person?, phone?, city?, industry?, website? }
Response: { brand, accessToken, refreshToken }
```

### Brand Login
```
POST /auth/brand/login
Body: { email, password }
Response: { brand, accessToken, refreshToken }
```

### Admin Login
```
POST /auth/admin/login
Body: { email, password }
Response: { admin, accessToken, refreshToken }
```

---

## User Routes (Requires User Role)

### Get Profile
```
GET /user/profile
Response: { user_id, email, name, phone, city, profile_image, created_at }
```

### Update Profile
```
PUT /user/profile
Body: { name?, phone?, city? }
Response: { message, user }
```

### Browse Artists
```
GET /user/artists?category=&city=&search=&page=1&limit=12
Response: [{ artist_id, name, category, city, bio, price_min, price_max, profile_image, is_verified, rating, total_bookings }]
```

### Get Artist Details
```
GET /user/artists/:artist_id
Response: { artist: {...}, reviews: [...] }
```

### Create Booking
```
POST /user/bookings
Body: { artist_id, event_date, event_time?, event_location, event_type?, message? }
Response: { message, booking }
```

### Get User Bookings
```
GET /user/bookings?status=
Response: [{ booking details with artist info }]
```

### Add to Favorites
```
POST /user/favorites
Body: { artist_id }
Response: { message }
```

### Remove from Favorites
```
DELETE /user/favorites/:artist_id
Response: { message }
```

### Get Favorites
```
GET /user/favorites
Response: [{ artist details }]
```

---

## Artist Routes (Requires Artist Role)

### Get Profile
```
GET /artist/profile
Response: { artist_id, email, name, phone, city, category, bio, price_min, price_max, profile_image, portfolio_links, gallery_images, is_verified, rating, total_bookings, created_at }
```

### Update Profile
```
PUT /artist/profile
Body: { name?, phone?, city?, category?, bio?, price_min?, price_max?, portfolio_links?, gallery_images? }
Response: { message, artist }
```

### Get Bookings
```
GET /artist/bookings?status=
Response: [{ booking details with user info }]
```

### Accept Booking
```
PUT /artist/bookings/:booking_id/accept
Body: { price }
Response: { message, booking }
```

### Reject Booking
```
PUT /artist/bookings/:booking_id/reject
Response: { message, booking }
```

### Get Earnings
```
GET /artist/earnings
Response: { total_bookings, completed_bookings, total_earnings, avg_booking_price }
```

---

## Admin Routes (Requires Admin Role)

### Get Dashboard
```
GET /admin/dashboard
Response: { stats: {...}, recentBookings: [...] }
```

### Get All Users
```
GET /admin/users?page=1&limit=20&search=
Response: [{ user details }]
```

### Toggle User Status
```
PUT /admin/users/:user_id/toggle-status
Response: { message, user }
```

### Delete User
```
DELETE /admin/users/:user_id
Response: { message }
```

### Get All Artists
```
GET /admin/artists?page=1&limit=20&search=&category=
Response: [{ artist details }]
```

### Toggle Artist Status
```
PUT /admin/artists/:artist_id/toggle-status
Response: { message, artist }
```

### Verify Artist
```
PUT /admin/artists/:artist_id/verify
Response: { message, artist }
```

### Delete Artist
```
DELETE /admin/artists/:artist_id
Response: { message }
```

### Get All Brands
```
GET /admin/brands?page=1&limit=20&search=
Response: [{ brand details }]
```

### Get All Bookings
```
GET /admin/bookings?status=&page=1&limit=20
Response: [{ booking details with user and artist info }]
```

### Cancel Booking
```
PUT /admin/bookings/:booking_id/cancel
Response: { message, booking }
```

### Get Categories
```
GET /admin/categories
Response: [{ id, name, description, icon, is_active }]
```

### Add Category
```
POST /admin/categories
Body: { name, description?, icon? }
Response: { message, category }
```

---

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

---

## Booking Status Flow

1. `requested` - User sends booking request
2. `accepted` - Artist accepts with price
3. `confirmed` - User confirms payment
4. `completed` - Event completed
5. `cancelled` - Cancelled by any party
