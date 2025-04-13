#!/bin/bash
# Install all dependencies
npm ci
# Install vite and esbuild globally
npm install -g vite esbuild
# Run the build
npm run build