#!/bin/sh
set -e

echo "=========================================="
echo "Starting WhatsApp Warmer Service"
echo "=========================================="

# Ensure data directory exists
mkdir -p /app/data

# Run database migrations
echo "Running Prisma migrations..."
bunx prisma db push --skip-generate

# Create symlinks for Prisma in WhatsApp service
echo "Setting up Prisma symlinks..."
mkdir -p /app/mini-services/whatsapp-service/node_modules/@prisma
ln -sf /app/node_modules/@prisma/client /app/mini-services/whatsapp-service/node_modules/@prisma/client
ln -sf /app/node_modules/.prisma /app/mini-services/whatsapp-service/node_modules/.prisma

# Start Next.js in background with Bun
echo "Starting Next.js server..."
bun .next/standalone/server.js &
NEXTJS_PID=$!

# Wait for Next.js to start
sleep 3

# Start WhatsApp service with Node.js + tsx (NOT Bun - Baileys requires Node.js WebSocket)
echo "Starting WhatsApp service with Node.js..."
cd /app/mini-services/whatsapp-service
npx tsx index.ts &
WA_PID=$!

# Wait for WhatsApp service to start
sleep 2

echo "=========================================="
echo "All services started successfully!"
echo "- Next.js (Bun): http://localhost:3000"
echo "- WhatsApp Service (Node.js): http://localhost:3030"
echo "=========================================="

# Keep script running and handle signals
trap "kill $NEXTJS_PID $WA_PID 2>/dev/null; exit 0" SIGTERM SIGINT

# Wait for any process to exit
wait
