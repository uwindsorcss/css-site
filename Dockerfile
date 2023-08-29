FROM node:20-slim AS base
RUN apt-get update -y && apt-get install -y openssl
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod
RUN pnpx prisma migrate deploy
RUN pnpx prisma generate
RUN pnpx prisma db seed
RUN pnpm run build

FROM base as production
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app
USER app

COPY --chown=app:app --from=build /app/.next/standalone src/
COPY --chown=app:app --from=build /app/public src/public
COPY --chown=app:app --from=build /app/.next/static src/.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "src/server.js"]