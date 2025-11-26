#!/bin/bash

# OELP Frontend Deployment Script
# This script helps deploy the frontend to Vercel

echo "🚀 OELP Frontend Deployment"
echo "============================"
echo ""

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must be run from the frontend directory"
    echo "   Run: cd frontend && ./deploy.sh"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "🔨 Step 2: Building for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors above."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "📤 Step 3: Deploying to Vercel..."
echo ""
echo "Choose deployment option:"
echo "  1) Preview deployment (test first)"
echo "  2) Production deployment"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo "Deploying preview..."
    npx vercel
elif [ "$choice" = "2" ]; then
    echo "Deploying to production..."
    npx vercel --prod
else
    echo "Invalid choice. Run the script again."
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Important: Make sure to set these environment variables in Vercel Dashboard:"
echo "   - VITE_API_BASE_URL=https://oelp-backend.vercel.app"
echo "   - VITE_API_URL=https://oelp-backend.vercel.app/api"
echo "   - VITE_RAZORPAY_KEY_ID=rzp_test_RbMWNhRcT0lrpd"
echo ""
echo "🌐 Visit your Vercel dashboard to see the deployment:"
echo "   https://vercel.com/vivek-chaithanyas-projects/frontend"
