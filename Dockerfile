# Stage 1: Dependency Installation
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Stage 2: Code Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Final Production Image (Runner)
FROM node:22-alpine AS runner
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Automatically create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy the static assets and public folder
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set the user to the non-root user
USER nextjs

EXPOSE 3000

ENV PORT 3000

# Start the Next.js server
CMD ["node", "server.js"]