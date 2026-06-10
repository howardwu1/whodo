#!/bin/bash
set -e

cd /home/howard/whodo

# Install dependencies
npm install

# Generate Prisma client with current schema
npx prisma generate

echo "Environment ready"
