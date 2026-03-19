#!/bin/bash
# Replit Start Script for WhatsApp Multi-Account Warmer
# This script sets up and runs both services

echo "=========================================="
echo "🚀 Starting WhatsApp Warmer on Replit..."
echo "=========================================="

# Set environment
export NODE_ENV=production
export HOSTNAME=0.0.0.0
export PORT=3000
export WHATSAPP_SERVICE_PORT=3030
export DATABASE_URL="file:$HOME/data/whatsapp.db"

# Replit specific
export REPLIT=true

# Create necessary directories
mkdir -p $HOME/data
mkdir -p $HOME/sessions
mkdir -p $HOME/backups
mkdir -p $HOME/logs

# Set working directory
cd $HOME

# Check if we're in the project directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Make sure you imported the correct GitHub repository"
    exit 1
fi

echo "📁 Working directory: $(pwd)"

# ============================================
# INSTALL DEPENDENCIES
# ============================================
echo ""
echo "📦 Installing dependencies..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing main dependencies with Bun..."
    bun install
fi

# Install WhatsApp service dependencies
if [ -d "mini-services/whatsapp-service" ]; then
    if [ ! -d "mini-services/whatsapp-service/node_modules" ]; then
        echo "Installing WhatsApp service dependencies with npm..."
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

# Generate Prisma client and push schema
bunx prisma generate
bunx prisma db push --skip-generate

echo "✅ Database ready"

# ============================================
# BUILD NEXT.JS
# ============================================
echo ""
echo "🔨 Building Next.js application..."

if [ ! -d ".next" ]; then
    bun run build
fi

echo "✅ Build complete"

# ============================================
# START SERVICES
# ============================================
echo ""
echo "🚀 Starting services..."
echo "=========================================="

# Create log files
NEXTJS_LOG="$HOME/logs/nextjs.log"
WHATSAPP_LOG="$HOME/logs/whatsapp.log"

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
node --experimental-modules index.js > $WHATSAPP_LOG 2>&1 &
WHATSAPP_PID=$!
cd ../..

# Wait a bit for WhatsApp service to start
sleep 3

# Check if WhatsApp service is running
if kill -0 $WHATSAPP_PID 2>/dev/null; then
    echo "✅ WhatsApp service started (PID: $WHATSAPP_PID)"
else
    echo "⚠️ WhatsApp service may have failed to start. Check logs."
    echo "Last 10 lines of WhatsApp log:"
    tail -10 $WHATSAPP_LOG
fi

# Start Next.js (foreground - this is the main service Replit exposes)
echo "Starting Next.js on port $PORT..."
bun run start > $NEXTJS_LOG 2>&1 &
NEXTJS_PID=$!

# Wait a bit for Next.js to start
sleep 3

# Check if Next.js is running
if kill -0 $NEXTJS_PID 2>/dev/null; then
    echo "✅ Next.js started (PID: $NEXTJS_PID)"
else
    echo "⚠️ Next.js may have failed to start. Check logs."
    echo "Last 10 lines of Next.js log:"
    tail -10 $NEXTJS_LOG
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
echo "📝 Logs:"
echo "   - Next.js:  $NEXTJS_LOG"
echo "   - WhatsApp: $WHATSAPP_LOG"
echo ""
echo "💡 Tips:"
echo "   - View Next.js logs:  tail -f $NEXTJS_LOG"
echo "   - View WhatsApp logs: tail -f $WHATSAPP_LOG"
echo "   - View all logs:      tail -f $NEXTJS_LOG $WHATSAPP_LOG"
echo ""
echo "🔄 Keep-alive: Use UptimeRobot to ping this repl every 5 minutes"
echo ""

# Keep the script running and show logs
wait $NEXTJS_PID $WHATSAPP_PID
