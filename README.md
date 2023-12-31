# CSS Site

## Overview

This repository contains the source code for the University of Windsor Computer Science Society's website, developed with the Next.js framework. A key feature is the integration of Discord authorization, which is specifically designed to allow only University of Windsor students to join our Discord server, ensuring a secure and student-exclusive community. The site also provides up-to-date information on events and activities, alongside regularly published newsletters.

![css-site-preview](https://github.com/uwindsorcss/css-site/assets/60056206/cc065bad-660a-462a-94ca-7bacfc022a53)

## Development Setup

### Prerequisites

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- Docker: [Download and Install Docker](https://www.docker.com/)
- Docker Compose: [Download and Install Docker Compose](https://docs.docker.com/compose/install/)
- pnpm: [Download and Install pnpm](https://pnpm.io/installation)

### Installation

1. Clone this repository to your local machine.

2. Install project dependencies:

```bash
pnpm install
```

3. Copy the `.env.example` file and rename it to `.env`. Update the variables with appropriate values:

```env
NODE_ENV="development"
SEED="true"
SEED_OLD_DATA="false"

NEXTAUTH_URL="http://localhost:3000"
# You can generate a secret using `openssl rand -hex 32`
NEXTAUTH_SECRET="your-nextauth-secret"

# The following variables are required for authentication
AZURE_AD_CLIENT_ID="your-azure-ad-client-id"
AZURE_AD_CLIENT_SECRET="your-azure-ad-client-secret"
AZURE_AD_TENANT_ID="your-azure-ad-tenant-id"

DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
DISCORD_BOT_TOKEN="your-discord-bot-token"
DISCORD_GUILD_ID="your-discord-guild-id"
DISCORD_CALLBACK_URL="http://localhost:3000/api/discord/callback"
DISCORD_SUGGESTION_WEBHOOK_URL="your-discord-suggestion-webhook-url"

# The following variables are required for the database
POSTGRES_PASSWORD="your-postgres-password"
POSTGRES_USER="your-postgres-user"
POSTGRES_DB="your-postgres-db"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"
```

4. Set up the database container using Docker Compose:

```bash
docker compose up -d --build db
```

5. Run the migrations using Prisma:

```bash
pnpx prisma migrate dev
```

### Development

Start the Next.js development server:

```bash
pnpm run dev
```

Your development environment is now set up and running. Access the site at [http://localhost:3000](http://localhost:3000).

## License

This project is licensed under the [MIT License](LICENSE).
