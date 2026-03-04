# SpotMYstar - Talent Discovery and Booking Platform

A production-ready full-stack web application connecting Artists, Users, and Brands with strict role-based isolation, unique ID generation, and comprehensive booking management.

## 🎯 Core Objective

Build a scalable, secure platform where:
- **Users** can discover and book talented artists
- **Artists** can showcase their work and manage bookings
- **Brands** can collaborate with artists for campaigns
- **Admins** have full control over the platform

## 🚀 Tech Stack

- **Frontend**: React 18 + Tailwind CSS + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT with refresh tokens
- **State Management**: Zustand
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend)

## ✨ Key Features

### Role-Based System (4 Roles)
- ✅ Separate login/register for each role
- ✅ Isolated dashboards
- ✅ Role-based middleware protection
- ✅ Cannot access other role routes/APIs

### Unique ID Generation
- User ID: 4-digit numeric (e.g., `4832`)
- Artist ID: 5-digit numeric (e.g., `59384`)
- Brand ID: 6-digit numeric (e.g., `123456`)
- Booking ID: 7-digit alphanumeric (e.g., `BK7A92F`)

### User Features
- Browse artists by category/city
- Search and filter
- View artist profiles with ratings
- Send booking requests
- Track booking status
- Save favorite artists

### Artist Features
- Comprehensive profile (bio, portfolio, gallery, pricing)
- Manage booking requests
- Accept/Reject bookings
- Earnings dashboard
- Verification badge system

### Admin Panel
- Full platform analytics
- Manage users, artists, brands
- Block/Unblock accounts
- Verify artists
- Cancel bookings
- Category management

### Security
- JWT authentication
- Password hashing (bcrypt)
- Role-based access control
- Rate limiting
- Input validation
- Protected routes

## 📁 Project Structure

```
spotmystar/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation
│   ├── routes/          # API routes
│   ├── scripts/         # Migration scripts
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── store/       # State management
│   │   ├── utils/       # API client
│   │   └── App.jsx      # Main component
│   └── index.html
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEPLOYMENT.md
│   ├── FEATURES.md
│   └── SETUP_GUIDE.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- PostgreSQL v12+
- npm or yarn

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd spotmystar
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 4. Access the Application
- Landing Page: `http://localhost:5173`
- User Login: `http://localhost:5173/user/login`
- Artist Login: `http://localhost:5173/artist/login`
- Admin Login: `http://localhost:5173/admin/login`

## 📚 Documentation

- **[Setup Guide](docs/SETUP_GUIDE.md)** - Detailed installation instructions
- **[API Documentation](docs/API_DOCUMENTATION.md)** - Complete API reference
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - Database structure
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment
- **[Features](docs/FEATURES.md)** - Complete feature list

## 🗄️ Database Schema

### Tables
- `users` - User accounts (4-digit ID)
- `artists` - Artist profiles (5-digit ID)
- `brands` - Brand accounts (6-digit ID)
- `admins` - Admin accounts
- `bookings` - Booking transactions (7-digit ID)
- `categories` - Artist categories
- `favorites` - User favorites
- `reviews` - Artist reviews
- `reports` - Content moderation
- `refresh_tokens` - JWT tokens

## 🔐 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control
- Rate limiting (100 req/15min)
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration

## 🎨 UI/UX

- Modern, clean design
- Fully responsive (mobile-first)
- Tailwind CSS styling
- Smooth animations
- Professional color scheme
- Intuitive navigation

## 📱 Mobile App Ready

The API is designed to be consumed by mobile applications:
- RESTful architecture
- Token-based authentication
- JSON responses
- Stateless design
- CORS enabled

## 🚀 Deployment

### Quick Deploy to Vercel (10 minutes)

**Automated Deployment**:
```bash
# Windows
deploy-vercel.bat

# Mac/Linux
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

**Manual Deployment**:
```bash
# 1. Deploy backend to Railway
cd backend
railway up

# 2. Deploy frontend to Vercel
cd frontend
vercel --prod
```

### Deployment Resources
- 📖 [Quick Vercel Guide](README_VERCEL.md) - 10-minute setup
- 📖 [Deploy to Vercel](DEPLOY_TO_VERCEL.md) - Step-by-step
- 📖 [Full Deployment Guide](docs/VERCEL_DEPLOYMENT.md) - Comprehensive
- 📋 [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Complete checklist

### Hosting Options

**Frontend**:
- Vercel (Recommended - Free tier)
- Netlify
- GitHub Pages

**Backend**:
- Railway (Recommended - Free $5/month)
- Render
- Heroku

See [Deployment Guide](docs/DEPLOYMENT.md) for details.

## 🔮 Future Enhancements

- Payment integration (Razorpay/Stripe)
- Email notifications
- Real-time chat
- File upload for images
- Artist availability calendar
- Advanced analytics
- Mobile applications
- Social media integration

## 📄 License

MIT License - feel free to use for your projects

## 🤝 Contributing

Contributions welcome! Please read the documentation before submitting PRs.

## 📞 Support

For issues or questions, please check the documentation or create an issue.

---

Built with ❤️ for connecting talent with opportunities
