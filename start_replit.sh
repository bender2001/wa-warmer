#!/bin/bash
# Replit Start Script for WhatsApp Multi-Account Warmer
# Compatible with Replit's Node.js template

echo "=========================================="
echo "🚀 Starting WhatsApp Warmer on Replit..."
echo "=========================================="

# Set environment
export NODE_ENV=production
export HOSTNAME=0.0.0.0
export PORT=3000
export WHATSAPP_SERVICE_PORT=3030
export REPLIT=true

# Get home directory
HOME_DIR=$(pwd)
export DATABASE_URL="file:$HOME_DIR/data/whatsapp.db"

# Create necessary directories
mkdir -p $HOME_DIR/data
mkdir -p $HOME_DIR/sessions
mkdir -p $HOME_DIR/backups
mkdir -p $HOME_DIR/logs

echo "📁 Working directory: $HOME_DIR"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    exit 1
fi

# ============================================
# INSTALL DEPENDENCIES
# ============================================
echo ""
echo "📦 Installing dependencies..."

# Install main dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing main dependencies..."
    npm install
fi

# Install WhatsApp service dependencies
if [ -d "mini-services/whatsapp-service" ]; then
    if [ ! -d "mini-services/whatsapp-service/node_modules" ]; then
        echo "Installing WhatsApp service dependencies..."
        cd mini-services/whatsapp-service
        npm install
        cd ../..
    fi
fi

# ============================================
# DATABASE SETUP
# ============================================
echo ""
echo "🗄️ Setting up database..."

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push --skip-generate

echo "✅ Database ready"

# ============================================
# BUILD NEXT.JS
# ============================================
echo ""
echo "🔨 Building Next.js application..."

if [ ! -d ".next" ]; then
    npm run build
fi

echo "✅ Build complete"

# ============================================
# START SERVICES
# ============================================
echo ""
echo "🚀 Starting services..."
echo "=========================================="

# Create log files
NEXTJS_LOG="$HOME_DIR/logs/nextjs.log"
WHATSAPP_LOG="$HOME_DIR/logs/whatsapp.log"

# Function to handle shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $NEXTJS_PID 2>/dev/null
    kill $WHATSAPP_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start WhatsApp Service (background)
echo "Starting WhatsApp service on port $WHATSAPP_SERVICE_PORT..."
cd mini-services/whatsapp-service
node index.js > $WHATSAPP_LOG 2>&1 &
WHATSAPP_PID=$!
cd ../..

# Wait a bit for WhatsApp service to start
sleep 5

# Check if WhatsApp service is running
if kill -0 $WHATSAPP_PID 2>/dev/null; then
    echo "✅ WhatsApp service started (PID: $WHATSAPP_PID)"
else
    echo "⚠️ WhatsApp service may have failed to start. Check logs."
    echo "Last 10 lines of WhatsApp log:"
    tail -10 $WHATSAPP_LOG 2>/dev/null || echo "No log file yet"
fi

# Start Next.js (foreground)
echo "Starting Next.js on port $PORT..."
npm run start > $NEXTJS_LOG 2>&1 &
NEXTJS_PID=$!

# Wait a bit for Next.js to start
sleep 5

# Check if Next.js is running
if kill -0 $NEXTJS_PID 2>/dev/null; then
    echo "✅ Next.js started (PID: $NEXTJS_PID)"
else
    echo "⚠️ Next.js may have failed to start. Check logs."
    echo "Last 10 lines of Next.js log:"
    tail -10 $NEXTJS_LOG 2>/dev/null || echo "No log file yet"
fi

echo ""
echo "=========================================="
echo "✅ All services started!"
echo "=========================================="
echo ""
echo "📊 Service Status:"
echo "   - Next.js:      http://localhost:$PORT"
echo "   - WhatsApp API: http://localhost:$WHATSAPP_SERVICE_PORT"
echo ""
echo "📝 Logs location: $HOME_DIR/logs/"
echo ""
echo "🔄 Keep-alive: Use UptimeRobot to ping this repl every 5 minutes"
echo ""

# Keep the script running
wait $NEXTJS_PID $WHATSAPP_PID
