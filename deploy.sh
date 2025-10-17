#!/bin/bash
# 🚀 Quick Deploy Script for BSM Carton Box

echo "🏗️  BSM Carton Box - Production Deployment"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "Commit your changes first? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        git add .
        echo "📝 Enter commit message:"
        read -r commit_msg
        git commit -m "$commit_msg"
        git push origin main
    fi
fi

echo ""
echo "🚀 Choose deployment method:"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) Manual instructions only"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "🔥 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo "🌐 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "📦 Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod
        ;;
    3)
        echo "📖 Opening deployment instructions..."
        if command -v code &> /dev/null; then
            code DEPLOYMENT.md
        else
            cat DEPLOYMENT.md
        fi
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment process initiated!"
echo ""
echo "📋 Next steps:"
echo "1. Add environment variables to your hosting platform"
echo "2. Test the deployed application"
echo "3. Verify authentication works"
echo ""
echo "🔗 Environment variables needed:"
echo "   - NEXT_PUBLIC_FIREBASE_* (7 variables)"
echo "   - FIREBASE_ADMIN_* (2 variables)"  
echo "   - BLOB_READ_WRITE_TOKEN"
echo ""
echo "📖 Full instructions: ./DEPLOYMENT.md"