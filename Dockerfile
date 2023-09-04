FROM node:20-slim AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod

EXPOSE 3000
ENV PORT 3000

CMD ["pnpm", "run", "start:docker"]