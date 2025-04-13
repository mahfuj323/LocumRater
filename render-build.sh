#!/bin/bash
# Install all dependencies
npm ci

# Install vite locally to ensure it's available during build
npm install vite --no-save

# Build client with Vite
npx vite build --emptyOutDir

# Build server with esbuild
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist