#!/bin/sh

echo "🚀 Running migrations..."
npx prisma migrate deploy

echo "🌱 Seeding initial data..."
pnpm exec node dist/prisma/seed.js

echo "✅ Starting server..."
pnpm start:prod
