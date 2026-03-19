# Build v11 - Hybrid: Bun for Next.js, Node.js for WhatsApp service (Baileys compatibility)
FROM oven/bun:1-alpine

WORKDIR /app

# Install Node.js alongside Bun for WhatsApp service
# Baileys requires Node.js WebSocket implementation (Bun WebSocket has compatibility issues)
RUN apk add --no-cache \
    nodejs \
    npm \
    git \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

RUN mkdir -p /app/data && chmod 777 /app/data

ENV DATABASE_URL="file:/app/data/whatsapp.db"

# Copy package files
COPY package.json bun.lock ./
COPY mini-services/whatsapp-service/package.json ./mini-services/whatsapp-service/

# Install main dependencies with Bun
RUN bun install

# Copy prisma and generate
COPY prisma ./prisma
RUN bunx prisma generate

# Install WhatsApp service dependencies with npm (Node.js compatibility)
RUN cd mini-services/whatsapp-service && npm install

COPY . .

# Build Next.js with Bun
RUN bun run build

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 3000 3030

CMD ["/app/start.sh"]
