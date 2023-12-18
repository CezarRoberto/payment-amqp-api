# THESE SCRIPT ARE FOR DEVELOPER MODE.
# DO NOT USE THIS IN PROD.

#!/bin/bash


# Run yarn 
yarn 

# Copy .env.example to .env
cp .env.example .env

# Run docker run for Postgres
docker run --name docker -e POSTGRES_PASSWORD=docker -d postgres


# Run docker run for RabbitMQ
docker run --name rabbitmq -it -p 5672:5672 -p 15672:15672 -d rabbitmq:3.10.5-management


# Run yarn prisma migrate deploy
yarn prisma migrate deploy

# Run yarn run start:dev
yarn run start:dev