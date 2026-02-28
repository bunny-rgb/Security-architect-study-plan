#!/bin/bash
set -e

echo "🔨 Building Security Architect Training Platform..."

# Build Hono API
echo "📦 Building API (Hono)..."
cd /home/user/webapp && npm run build:api

# Build Next.js frontend
echo "🎨 Building Frontend (Next.js)..."
cd /home/user/webapp && npm run build:frontend

# Copy Next.js output to dist
echo "📋 Combining outputs..."
rm -rf dist
mkdir -p dist
cp -r out/* dist/
cp dist/_worker.js dist/_worker.js.backup 2>/dev/null || true

echo "✅ Build complete!"
echo "   - API: dist/_worker.js"
echo "   - Frontend: dist/*"
