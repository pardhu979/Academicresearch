#!/bin/bash

# Academic Research Platform - Quick Deploy Script
# Usage: ./deploy.sh <platform>

set -e

PLATFORM=${1:-vercel}

echo "🚀 Academic Research Platform - Deployment Script"
echo "=================================================="
echo ""

# Build frontend
echo "📦 Building frontend..."
npm run build
echo "✓ Frontend built (dist/)"
echo ""

if [ "$PLATFORM" = "vercel" ]; then
    echo "📤 Deploying to Vercel..."
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    vercel --prod
    echo "✓ Frontend deployed to Vercel"
    
elif [ "$PLATFORM" = "netlify" ]; then
    echo "📤 Deploying to Netlify..."
    if ! command -v netlify &> /dev/null; then
        echo "Installing Netlify CLI..."
        npm install -g netlify-cli
    fi
    netlify deploy --prod --dir=dist
    echo "✓ Frontend deployed to Netlify"
    
elif [ "$PLATFORM" = "github-pages" ]; then
    echo "📤 Preparing for GitHub Pages deployment..."
    echo "Push the dist/ folder to gh-pages branch:"
    echo "  git subtree push --prefix dist origin gh-pages"
    
elif [ "$PLATFORM" = "docker" ]; then
    echo "🐳 Building Docker image..."
    docker build -t academic-research .
    echo "✓ Docker image built: academic-research"
    echo ""
    echo "To run locally:"
    echo "  docker run -p 5173:5173 -p 4000:4000 academic-research"
    
else
    echo "Unknown platform: $PLATFORM"
    echo ""
    echo "Supported platforms:"
    echo "  ./deploy.sh vercel      - Deploy frontend to Vercel"
    echo "  ./deploy.sh netlify     - Deploy frontend to Netlify"
    echo "  ./deploy.sh github-pages - Deploy to GitHub Pages"
    echo "  ./deploy.sh docker      - Build Docker image"
    exit 1
fi

echo ""
echo "✅ Deployment script complete!"
