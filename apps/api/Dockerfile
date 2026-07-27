FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json pnpm-workspace.yaml turbo.json ./
COPY packages/database ./packages/database
COPY packages/shared-types ./packages/shared-types
COPY apps/api ./apps/api

RUN npm install
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
RUN npm run build --filter=@trustfundx/api

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/index.js"]
