FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock tsconfig.json src ./

RUN yarn install --frozen-lockfile --ignore-scripts --production  && \
  yarn run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]
