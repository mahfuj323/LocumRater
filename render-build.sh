#!/bin/bash
# Install all dependencies
npm ci

# Build client with Vite
npx vite build --emptyOutDir

# Build server with esbuild
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist