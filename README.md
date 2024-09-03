# UWindsor CSS Site

## Overview

This repository contains the source code for the University of Windsor Computer Science Society's website, developed with the Next.js framework. This site is designed to serve our student community by providing information on upcoming events, newsletters, and other resources. The site is integrated with Discord to verify student status and provide access to the society's Discord server.

![css-site-preview](https://github.com/uwindsorcss/css-site/assets/60056206/cc065bad-660a-462a-94ca-7bacfc022a53)

## Development Setup

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js**: [Download and Install Node.js](https://nodejs.org/)
- **pnpm**: [Download and Install pnpm](https://pnpm.io/installation)
- **Docker**: [Download and Install Docker](https://www.docker.com/)
- **Docker Compose**: [Download and Install Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. Clone this repository to your local machine.

2. Install project dependencies:

```bash
pnpm install
```

3. Copy the `.env.example` file and rename it to `.env`. Then, update the variables with the appropriate values. Make sure to generate and set a value for `NEXTAUTH_SECRET`, as it is required.

```env
# Set this to "production" for production environments and "development" for development environments
NODE_ENV="development"

# NextAuth Configuration (REQUIRED)
NEXTAUTH_URL="http://localhost:3000" # The URL of the site
NEXTAUTH_SECRET="" # Generate a secret using `openssl rand -base64 32`

# Postgres Database Configuration (REQUIRED)
# These variables are necessary to initialize the Database Docker container and to connect the site to the database
POSTGRES_PASSWORD=""
POSTGRES_USER=""
POSTGRES_DB=""
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}" # Leave this as is

# Database Seeding Options
SEED="true" # Set to "true" to seed the database with sample data
SEED_OLD_DATA="false" 

# Azure AD Configuration (Optional for Development - Required for authenticating users with the University's Azure AD)
AZURE_AD_CLIENT_ID=""
AZURE_AD_CLIENT_SECRET=""
AZURE_AD_TENANT_ID=

# Discord Configuration (Optional for Development - Required to link a user's account with their Discord, retrieve server information, and invite the user to the Discord server)
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
DISCORD_BOT_TOKEN=""
DISCORD_GUILD_ID=""
DISCORD_CALLBACK_URL="http://localhost:3000/api/discord/callback"
DISCORD_SUGGESTION_WEBHOOK_URL=""
```

4. Set up the database container using Docker Compose:

```bash
docker compose up -d db
```

5. Run the migrations using Prisma:

```bash
pnpx prisma migrate dev
```

6. Start the Next.js development server, which will automatically reload when changes are made:

```bash
pnpm run dev
```

Your development environment is now set up and running. Access the site at [http://localhost:3000](http://localhost:3000).

## Production

To build the site for production, run the following command:

```bash
pnpm run build
```

To start the production server, run the following command:

```bash
pnpm start
```

## License

This project is licensed under the [MIT License](LICENSE).
