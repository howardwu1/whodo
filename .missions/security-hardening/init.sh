#!/bin/bash
set -e

cd /home/howard/whodo

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations (creates session table)
npx prisma migrate dev --skip-seed --name add_session_model

echo "Environment ready"
