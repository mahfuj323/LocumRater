#!/bin/bash
# Use PORT provided by Render or default to 10000
export PORT=${PORT:-10000}
# Always set NODE_ENV to production for consistency
export NODE_ENV=production
# Start the server
node dist/index.js