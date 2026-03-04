#!/bin/bash

echo "🚀 SpotMYstar Setup Script"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "✓ PostgreSQL is installed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✓ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✓ Frontend dependencies installed"
echo ""

cd ..

# Create database
echo "🗄️  Setting up database..."
echo "Please enter your PostgreSQL password when prompted:"
psql -U postgres -c "CREATE DATABASE spotmystar;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✓ Database created"
else
    echo "⚠️  Database might already exist or creation failed"
fi
echo ""

# Run migrations
echo "🔄 Running database migrations..."
cd backend
npm run migrate
if [ $? -ne 0 ]; then
    echo "❌ Failed to run migrations"
    exit 1
fi
echo "✓ Migrations completed"
echo ""

cd ..

echo "✅ Setup completed successfully!"
echo ""
echo "To start the application:"
echo "1. Start backend:  cd backend && npm run dev"
echo "2. Start frontend: cd frontend && npm run dev"
echo ""
echo "Default admin credentials:"
echo "Email: admin@spotmystar.com"
echo "Password: admin123"
echo ""
echo "Visit http://localhost:5173 to access the application"
