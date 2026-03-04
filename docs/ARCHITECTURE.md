# SpotMYstar - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  React Frontend (Vite + Tailwind CSS)                       │
│  ├── Landing Page                                            │
│  ├── Auth Pages (Login/Register for each role)              │
│  ├── User Dashboard                                          │
│  ├── Artist Dashboard                                        │
│  ├── Brand Dashboard                                         │
│  └── Admin Dashboard                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Node.js + Express Server                                   │
│  ├── Authentication Middleware (JWT)                        │
│  ├── Role-Based Access Control                              │
│  ├── Rate Limiting                                           │
│  ├── Input Validation                                        │
│  └── Error Handling                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                         │
│  ├── users, artists, brands, admins                         │
│  ├── bookings, categories, favorites                        │
│  ├── reviews, reports, refresh_tokens                       │
│  └── Indexes, Foreign Keys, Constraints                     │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

### User Registration Flow
```
User Browser
    │
    │ 1. Fill registration form
    ▼
React Component (UserRegister.jsx)
    │
    │ 2. POST /api/auth/user/register
    ▼
API Client (axios)
    │
    │ 3. HTTP Request with JSON body
    ▼
Express Server (server.js)
    │
    │ 4. Route to auth router
    ▼
Auth Router (routes/auth.js)
    │
    │ 5. Validate input
    ▼
Auth Controller (controllers/authController.js)
    │
    │ 6. Check if email exists
    │ 7. Generate unique user_id
    │ 8. Hash password
    ▼
Database (PostgreSQL)
    │
    │ 9. INSERT INTO users
    ▼
Auth Controller
    │
    │ 10. Generate JWT tokens
    │ 11. Return user data + tokens
    ▼
React Component
    │
    │ 12. Store in Zustand + localStorage
    │ 13. Redirect to dashboard
    ▼
User Dashboard
```

### Protected Route Access Flow
```
User Action (e.g., Browse Artists)
    │
    │ 1. GET /api/user/artists
    ▼
API Client
    │
    │ 2. Add Authorization header
    │    "Bearer <token>"
    ▼
Express Server
    │
    │ 3. Route to user router
    ▼
Auth Middleware (middleware/auth.js)
    │
    │ 4. Extract token
    │ 5. Verify JWT signature
    │ 6. Check token expiration
    │ 7. Decode user info
    ▼
Role Middleware
    │
    │ 8. Check if role === 'user'
    │ 9. If not, return 403 Forbidden
    ▼
User Controller
    │
    │ 10. Execute business logic
    │ 11. Query database
    ▼
Database
    │
    │ 12. Return artists data
    ▼
User Controller
    │
    │ 13. Format response
    ▼
React Component
    │
    │ 14. Display artists
    ▼
User Interface
```

## 🗂️ Component Architecture

### Frontend Components
```
App.jsx (Root)
├── Router
│   ├── Public Routes
│   │   ├── LandingPage
│   │   ├── UserLogin
│   │   ├── UserRegister
│   │   ├── ArtistLogin
│   │   ├── ArtistRegister
│   │   ├── BrandLogin
│   │   ├── BrandRegister
│   │   └── AdminLogin
│   │
│   └── Protected Routes (with role check)
│       ├── UserDashboard
│       │   ├── BrowseArtists
│       │   ├── MyBookings
│       │   └── Favorites
│       │
│       ├── ArtistDashboard
│       │   ├── BookingRequests
│       │   ├── Earnings
│       │   └── Profile
│       │
│       ├── BrandDashboard
│       │   └── (Future features)
│       │
│       └── AdminDashboard
│           ├── Dashboard (Analytics)
│           ├── ManageUsers
│           ├── ManageArtists
│           └── ManageBookings
```

### Backend Structure
```
server.js (Entry Point)
├── Middleware Stack
│   ├── helmet (Security headers)
│   ├── cors (Cross-origin)
│   ├── rateLimit (Rate limiting)
│   ├── express.json (Body parser)
│   └── express.urlencoded
│
├── Routes
│   ├── /api/auth
│   │   └── authController
│   │       ├── registerUser
│   │       ├── registerArtist
│   │       ├── registerBrand
│   │       ├── loginUser
│   │       ├── loginArtist
│   │       ├── loginBrand
│   │       └── loginAdmin
│   │
│   ├── /api/user (Protected: User role)
│   │   └── userController
│   │       ├── getProfile
│   │       ├── updateProfile
│   │       ├── browseArtists
│   │       ├── getArtistDetails
│   │       ├── createBooking
│   │       ├── getBookings
│   │       ├── addFavorite
│   │       ├── removeFavorite
│   │       └── getFavorites
│   │
│   ├── /api/artist (Protected: Artist role)
│   │   └── artistController
│   │       ├── getProfile
│   │       ├── updateProfile
│   │       ├── getBookings
│   │       ├── acceptBooking
│   │       ├── rejectBooking
│   │       └── getEarnings
│   │
│   └── /api/admin (Protected: Admin role)
│       └── adminController
│           ├── getDashboard
│           ├── getAllUsers
│           ├── toggleUserStatus
│           ├── deleteUser
│           ├── getAllArtists
│           ├── toggleArtistStatus
│           ├── verifyArtist
│           ├── deleteArtist
│           ├── getAllBrands
│           ├── getAllBookings
│           ├── cancelBooking
│           ├── getCategories
│           └── addCategory
│
└── Error Handlers
    ├── 404 Handler
    └── Global Error Handler
```

## 🔐 Security Architecture

### Authentication Flow
```
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ 1. Login Request (email, password)
       ▼
┌──────────────────────────────────────┐
│   Auth Controller                    │
│   ├── Validate credentials           │
│   ├── Compare password (bcrypt)      │
│   └── Generate tokens                │
└──────┬───────────────────────────────┘
       │
       │ 2. Return tokens
       ▼
┌──────────────────────────────────────┐
│   Client Storage                     │
│   ├── Access Token (memory/state)    │
│   └── Refresh Token (localStorage)   │
└──────┬───────────────────────────────┘
       │
       │ 3. Subsequent requests
       ▼
┌──────────────────────────────────────┐
│   Request Headers                    │
│   Authorization: Bearer <token>      │
└──────┬───────────────────────────────┘
       │
       │ 4. Verify token
       ▼
┌──────────────────────────────────────┐
│   Auth Middleware                    │
│   ├── Extract token                  │
│   ├── Verify signature               │
│   ├── Check expiration               │
│   └── Decode payload                 │
└──────┬───────────────────────────────┘
       │
       │ 5. Check role
       ▼
┌──────────────────────────────────────┐
│   Role Middleware                    │
│   ├── Compare user role              │
│   └── Allow/Deny access              │
└──────────────────────────────────────┘
```

### Role-Based Access Control
```
┌─────────────────────────────────────────────────────────┐
│                    Request Received                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Has Token?   │
                  └──────┬───────┘
                         │
                    Yes  │  No
            ┌────────────┴────────────┐
            ▼                         ▼
    ┌───────────────┐         ┌─────────────┐
    │ Verify Token  │         │ Return 401  │
    └───────┬───────┘         └─────────────┘
            │
            ▼
    ┌───────────────┐
    │ Valid Token?  │
    └───────┬───────┘
            │
       Yes  │  No
   ┌────────┴────────┐
   ▼                 ▼
┌──────────┐   ┌─────────────┐
│Get Role  │   │ Return 401  │
└────┬─────┘   └─────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ Role Matches Required Role?         │
├─────────────────────────────────────┤
│ User → /api/user/*                  │
│ Artist → /api/artist/*              │
│ Brand → /api/brand/*                │
│ Admin → /api/admin/*                │
└────┬────────────────────────────────┘
     │
Yes  │  No
┌────┴────┐
▼         ▼
┌──────────────┐  ┌─────────────┐
│ Allow Access │  │ Return 403  │
└──────────────┘  └─────────────┘
```

## 💾 Database Architecture

### Entity Relationship Diagram
```
┌─────────────┐
│    users    │
│ (user_id)   │
└──────┬──────┘
       │
       │ 1:N
       ▼
┌─────────────┐      ┌──────────────┐
│  bookings   │◄────►│   artists    │
│(booking_id) │ N:1  │ (artist_id)  │
└──────┬──────┘      └──────┬───────┘
       │                    │
       │ 1:1                │ 1:N
       ▼                    ▼
┌─────────────┐      ┌──────────────┐
│   reviews   │      │  favorites   │
└─────────────┘      └──────────────┘
                            ▲
                            │ N:1
                            │
                     ┌──────┴───────┐
                     │    users     │
                     └──────────────┘

┌──────────────┐
│  categories  │
└──────────────┘

┌──────────────┐
│    brands    │
│  (brand_id)  │
└──────────────┘

┌──────────────┐
│    admins    │
└──────────────┘

┌──────────────┐
│   reports    │
└──────────────┘

┌──────────────┐
│refresh_tokens│
└──────────────┘
```

### Data Flow in Booking System
```
User Creates Booking
        │
        ▼
┌───────────────────────────┐
│ Status: "requested"       │
│ booking_id: BK7A92F       │
│ user_id: 1234             │
│ artist_id: 56789          │
│ price: NULL               │
└───────────┬───────────────┘
            │
            │ Artist Views
            ▼
┌───────────────────────────┐
│ Artist Accepts            │
│ Status: "accepted"        │
│ price: 5000               │
└───────────┬───────────────┘
            │
            │ User Confirms
            ▼
┌───────────────────────────┐
│ Status: "confirmed"       │
│ Payment processed         │
└───────────┬───────────────┘
            │
            │ Event Happens
            ▼
┌───────────────────────────┐
│ Status: "completed"       │
│ Review can be added       │
└───────────────────────────┘
```

## 🔄 State Management

### Frontend State (Zustand)
```
authStore
├── user (object | null)
├── role (string | null)
├── token (string | null)
├── setAuth(user, role, token)
├── logout()
└── isAuthenticated()
```

### State Persistence
```
Browser
├── localStorage
│   └── auth-storage (Zustand persist)
│       ├── user
│       ├── role
│       └── token
│
└── sessionStorage
    └── (not used currently)
```

## 📡 API Communication

### Request/Response Cycle
```
React Component
    │
    │ 1. User action
    ▼
Event Handler
    │
    │ 2. Call API function
    ▼
API Client (utils/api.js)
    │
    │ 3. Add auth header
    │ 4. Make HTTP request
    ▼
Axios Interceptor
    │
    │ 5. Attach token
    ▼
Backend Server
    │
    │ 6. Process request
    │ 7. Return response
    ▼
Axios Interceptor
    │
    │ 8. Handle errors
    │ 9. Check 401 (logout)
    ▼
React Component
    │
    │ 10. Update UI
    │ 11. Show feedback
    ▼
User Interface
```

## 🚀 Deployment Architecture

### Production Setup
```
┌─────────────────────────────────────────┐
│           Vercel (Frontend)             │
│  ├── React Build (Static Files)         │
│  ├── CDN Distribution                    │
│  └── HTTPS Certificate                   │
└────────────────┬────────────────────────┘
                 │
                 │ API Calls
                 ▼
┌─────────────────────────────────────────┐
│      Railway/Render (Backend)           │
│  ├── Node.js Server                     │
│  ├── Environment Variables              │
│  └── Auto-scaling                        │
└────────────────┬────────────────────────┘
                 │
                 │ Database Queries
                 ▼
┌─────────────────────────────────────────┐
│      PostgreSQL Database                │
│  ├── Managed Database Service           │
│  ├── Automated Backups                  │
│  └── Connection Pooling                 │
└─────────────────────────────────────────┘
```

## 📊 Performance Considerations

### Optimization Points
```
Frontend
├── Code Splitting (React Router)
├── Lazy Loading (Future)
├── Image Optimization (Future)
└── Bundle Size Optimization

Backend
├── Database Indexes
├── Query Optimization
├── Connection Pooling
└── Rate Limiting

Database
├── Indexed Foreign Keys
├── Indexed Search Fields
└── Query Performance Monitoring
```

---

This architecture is designed to be:
- **Scalable**: Can handle growing user base
- **Secure**: Multiple layers of security
- **Maintainable**: Clear separation of concerns
- **Extensible**: Easy to add new features
- **Production-Ready**: Follows best practices
