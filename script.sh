# THESE SCRIPT ARE FOR DEVELOPER MODE.
# DO NOT USE THIS IN PROD.

#!/bin/bash

# Copy .env.example to .env
cp .env.example .env

# Run docker run for Postgres
docker run --name docker -e POSTGRES_PASSWORD=docker -d postgres

# Run yarn prisma migrate deploy
yarn prisma migrate deploy

# Run yarn run start:dev
yarn run start:dev