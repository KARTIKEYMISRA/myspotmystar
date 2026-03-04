# Database Schema

## Tables Overview

1. users - User accounts
2. artists - Artist profiles
3. brands - Brand accounts
4. admins - Admin accounts
5. bookings - Booking transactions
6. categories - Artist categories
7. favorites - User favorites
8. reviews - Artist reviews
9. reports - Content moderation
10. refresh_tokens - JWT tokens

---

## Detailed Schema

### users
```sql
id              SERIAL PRIMARY KEY
user_id         VARCHAR(4) UNIQUE NOT NULL      -- Auto-generated 4-digit
email           VARCHAR(255) UNIQUE NOT NULL
password        VARCHAR(255) NOT NULL           -- Bcrypt hashed
name            VARCHAR(255) NOT NULL
phone           VARCHAR(20)
city            VARCHAR(100)
profile_image   VARCHAR(500)
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### artists
```sql
id              SERIAL PRIMARY KEY
artist_id       VARCHAR(5) UNIQUE NOT NULL      -- Auto-generated 5-digit
email           VARCHAR(255) UNIQUE NOT NULL
password        VARCHAR(255) NOT NULL
name            VARCHAR(255) NOT NULL
phone           VARCHAR(20)
city            VARCHAR(100)
category        VARCHAR(100)
bio             TEXT
price_min       DECIMAL(10,2)
price_max       DECIMAL(10,2)
profile_image   VARCHAR(500)
portfolio_links TEXT[]                          -- Array of URLs
gallery_images  TEXT[]                          -- Array of image URLs
is_verified     BOOLEAN DEFAULT false           -- Admin verification
is_active       BOOLEAN DEFAULT true
rating          DECIMAL(3,2) DEFAULT 0
total_bookings  INTEGER DEFAULT 0
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### brands
```sql
id              SERIAL PRIMARY KEY
brand_id        VARCHAR(6) UNIQUE NOT NULL      -- Auto-generated 6-digit
email           VARCHAR(255) UNIQUE NOT NULL
password        VARCHAR(255) NOT NULL
company_name    VARCHAR(255) NOT NULL
contact_person  VARCHAR(255)
phone           VARCHAR(20)
city            VARCHAR(100)
industry        VARCHAR(100)
website         VARCHAR(255)
profile_image   VARCHAR(500)
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### admins
```sql
id              SERIAL PRIMARY KEY
email           VARCHAR(255) UNIQUE NOT NULL
password        VARCHAR(255) NOT NULL
name            VARCHAR(255) NOT NULL
role            VARCHAR(50) DEFAULT 'admin'
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### bookings
```sql
id              SERIAL PRIMARY KEY
booking_id      VARCHAR(7) UNIQUE NOT NULL      -- Auto-generated alphanumeric
user_id         VARCHAR(4) REFERENCES users(user_id) ON DELETE CASCADE
artist_id       VARCHAR(5) REFERENCES artists(artist_id) ON DELETE CASCADE
event_date      DATE NOT NULL
event_time      TIME
event_location  VARCHAR(255)
event_type      VARCHAR(100)
message         TEXT
status          VARCHAR(50) DEFAULT 'requested'  -- requested, accepted, confirmed, completed, cancelled
price           DECIMAL(10,2)
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### categories
```sql
id              SERIAL PRIMARY KEY
name            VARCHAR(100) UNIQUE NOT NULL
description     TEXT
icon            VARCHAR(100)
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### favorites
```sql
id              SERIAL PRIMARY KEY
user_id         VARCHAR(4) REFERENCES users(user_id) ON DELETE CASCADE
artist_id       VARCHAR(5) REFERENCES artists(artist_id) ON DELETE CASCADE
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
UNIQUE(user_id, artist_id)
```

### reviews
```sql
id              SERIAL PRIMARY KEY
booking_id      VARCHAR(7) REFERENCES bookings(booking_id) ON DELETE CASCADE
user_id         VARCHAR(4) REFERENCES users(user_id) ON DELETE CASCADE
artist_id       VARCHAR(5) REFERENCES artists(artist_id) ON DELETE CASCADE
rating          INTEGER CHECK (rating >= 1 AND rating <= 5)
comment         TEXT
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### reports
```sql
id              SERIAL PRIMARY KEY
reporter_id     VARCHAR(10) NOT NULL
reporter_type   VARCHAR(20) NOT NULL            -- user, artist, brand
reported_id     VARCHAR(10) NOT NULL
reported_type   VARCHAR(20) NOT NULL            -- user, artist, brand
reason          TEXT NOT NULL
status          VARCHAR(50) DEFAULT 'pending'   -- pending, reviewed, resolved
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### refresh_tokens
```sql
id              SERIAL PRIMARY KEY
token           TEXT NOT NULL
user_id         VARCHAR(10) NOT NULL
user_type       VARCHAR(20) NOT NULL            -- user, artist, brand, admin
expires_at      TIMESTAMP NOT NULL
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

---

## Indexes

```sql
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_artist ON bookings(artist_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_artists_category ON artists(category);
CREATE INDEX idx_artists_city ON artists(city);
CREATE INDEX idx_favorites_user ON favorites(user_id);
```

---

## Relationships

### One-to-Many
- users → bookings (one user can have many bookings)
- artists → bookings (one artist can have many bookings)
- users → favorites (one user can favorite many artists)
- artists → reviews (one artist can have many reviews)
- bookings → reviews (one booking can have one review)

### Cascade Deletes
- Delete user → deletes their bookings, favorites, reviews
- Delete artist → deletes their bookings, favorites, reviews
- Delete booking → deletes associated review

---

## ID Generation Logic

### User ID (4-digit)
```javascript
Math.floor(1000 + Math.random() * 9000).toString()
// Examples: 1234, 5678, 9012
```

### Artist ID (5-digit)
```javascript
Math.floor(10000 + Math.random() * 90000).toString()
// Examples: 12345, 67890, 45678
```

### Brand ID (6-digit)
```javascript
Math.floor(100000 + Math.random() * 900000).toString()
// Examples: 123456, 789012, 456789
```

### Booking ID (7-digit alphanumeric)
```javascript
'BK' + 5 random chars from 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
// Examples: BK7A92F, BKXYZ12, BK3M4N5
```

---

## Default Data

### Categories
- Musician
- Dancer
- Singer
- DJ
- Comedian
- Magician
- Photographer
- Makeup Artist

### Admin
- Email: admin@spotmystar.com
- Password: (set during migration)

---

## Future Enhancements

1. Add `notifications` table
2. Add `payments` table
3. Add `artist_availability` table
4. Add `brand_campaigns` table
5. Add `messages` table for chat
6. Add `artist_portfolio_items` table
7. Add `user_preferences` table
8. Add audit logs table
