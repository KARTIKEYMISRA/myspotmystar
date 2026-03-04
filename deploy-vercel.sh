#!/bin/bash

echo "🚀 SpotMYstar Vercel Deployment Script"
echo "======================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✓ Vercel CLI ready"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for Vercel deployment"
    echo "✓ Git initialized"
else
    echo "✓ Git repository exists"
fi

echo ""
echo "📋 Deployment Checklist:"
echo ""
echo "Before deploying, ensure you have:"
echo "1. ✓ Backend deployed (Railway/Render/Heroku)"
echo "2. ✓ Database created and migrated"
echo "3. ✓ Backend URL ready"
echo ""

read -p "Do you have your backend URL? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "⚠️  Please deploy your backend first!"
    echo ""
    echo "Quick backend deployment options:"
    echo "1. Railway: railway up"
    echo "2. Render: Connect GitHub repo"
    echo "3. Heroku: git push heroku main"
    echo ""
    exit 1
fi

echo ""
read -p "Enter your backend URL (e.g., https://your-app.railway.app): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Backend URL is required"
    exit 1
fi

echo ""
echo "🔧 Configuring frontend..."

# Update frontend .env
cat > frontend/.env << EOF
VITE_API_URL=${BACKEND_URL}/api
EOF

echo "✓ Frontend configured with backend URL"
echo ""

# Login to Vercel
echo "🔐 Logging into Vercel..."
vercel login

echo ""
echo "🚀 Deploying to Vercel..."
echo ""

cd frontend

# Deploy to Vercel
vercel --prod

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "Next steps:"
echo "1. Wait for deployment to complete"
echo "2. Copy your Vercel URL"
echo "3. Update backend CORS with Vercel URL"
echo "4. Test your application"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - DEPLOY_TO_VERCEL.md"
echo "   - docs/VERCEL_DEPLOYMENT.md"
echo ""
