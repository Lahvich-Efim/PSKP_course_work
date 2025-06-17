FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY . .

RUN corepack enable && pnpm install --frozen-lockfile
RUN npx prisma generate

RUN pnpm build
RUN chmod +x start.sh

CMD ["./start.sh"]
