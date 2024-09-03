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

3. Copy the `.env.example` file and rename it to `.env`. Then, update the variables with the appropriate values. Make sure to fill out the required sections before proceeding.

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
