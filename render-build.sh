#!/bin/bash
# Install all dependencies
npm ci

# Install vite locally to ensure it's available during build
npm install vite --no-save

# Show directory structure before build
echo "Current directory: $(pwd)"
echo "Directory contents before build:"
ls -la

# Build client with Vite - this builds to dist directory
npx vite build --emptyOutDir

# Show directory structure after build
echo "Directory contents after Vite build:"
ls -la
echo "Dist directory contents:"
ls -la dist || echo "dist directory not found"

# Create a completely standalone server for production that doesn't import any Vite code
cat > server-prod.ts << EOF
// Production server entry point - completely standalone with no Vite dependencies
import express, { type Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import path from 'path';
import fs from 'fs';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import connectPg from 'connect-pg-simple';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import ws from 'ws';

// Setup the neon config for web sockets
import { neonConfig } from '@neondatabase/serverless';
neonConfig.webSocketConstructor = ws;

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure logging
function log(message) {
  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  console.log(\`\${formattedTime} [express] \${message}\`);
}

// Log requests
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = \`\${req.method} \${path} \${res.statusCode} in \${duration}ms\`;
      if (capturedJsonResponse) {
        logLine += \` :: \${JSON.stringify(capturedJsonResponse)}\`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + '…';
      }

      log(logLine);
    }
  });

  next();
});

// Setup database connection with error handling
let pool;
let db;
let sessionStore;

try {
  if (!process.env.DATABASE_URL) {
    console.error('WARNING: DATABASE_URL is not set. Some features will be limited.');
  } else {
    console.log('Attempting to connect to database...');
    
    // Database connection
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 5, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
      connectionTimeoutMillis: 10000, // Maximum time to wait for a connection
    });
    
    // Test database connection
    pool.query('SELECT NOW()')
      .then(res => console.log('Database connection successful:', res.rows[0]))
      .catch(err => console.error('Database connection test failed:', err));
    
    db = drizzle(pool);
    
    // Connect-pg-simple for session store 
    const PostgresSessionStore = connectPg(session);
    sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
    
    console.log('Database and session store initialized');
  }
} catch (error) {
  console.error('Error setting up database:', error);
  console.log('Continuing with limited functionality');
}

// Use memory store as fallback if database connection fails
if (!sessionStore) {
  console.log('Using memory session store (not persistent)');
  const MemoryStore = session.MemoryStore;
  sessionStore = new MemoryStore();
}

// Authentication setup
const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return \`\${buf.toString('hex')}.\${salt}\`;
}

async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Setup session and authentication
const sessionSettings = {
  secret: process.env.SESSION_SECRET || 'rate-my-locum-secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
};

app.set('trust proxy', 1);
app.use(session(sessionSettings));
app.use(passport.initialize());
app.use(passport.session());

// Database access functions with error handling
async function getUser(id) {
  try {
    if (!db) return undefined;
    const [user] = await db.execute(\`SELECT * FROM users WHERE id = \${id}\`);
    return user || undefined;
  } catch (error) {
    console.error('Error in getUser:', error);
    return undefined;
  }
}

async function getUserByUsername(username) {
  try {
    if (!db) return undefined;
    const [user] = await db.execute(\`SELECT * FROM users WHERE username = '\${username}'\`);
    return user || undefined;
  } catch (error) {
    console.error('Error in getUserByUsername:', error);
    return undefined;
  }
}

// Configure Passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// API Routes
app.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json(req.user);
});

app.post('/api/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
});

app.get('/api/user', (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  res.json(req.user);
});

// Add a basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    database: pool ? 'connected' : 'not connected'
  });
});

// Add essential API routes
app.get('/api/workplaces', async (req, res) => {
  try {
    if (!pool) {
      // Return mock empty data if no database connection
      console.warn('No database connection for /api/workplaces request');
      return res.json({ 
        workplaces: [], 
        isLimited: true,
        message: 'Database connection not available'
      });
    }
    
    // Basic workplaces endpoint for initial testing
    console.log('Executing workplaces query...');
    const query = 'SELECT * FROM workplaces LIMIT 10';
    
    const result = await pool.query(query);
    console.log('Query complete, returned', result.rows?.length || 0, 'rows');
    const workplaces = result.rows || [];
    
    // For non-authenticated users, return limited data
    if (!req.isAuthenticated()) {
      const limitedWorkplaces = workplaces.slice(0, 3);
      return res.json({ workplaces: limitedWorkplaces, isLimited: true });
    }
    
    res.json({ workplaces, isLimited: false });
  } catch (error) {
    console.error('Error fetching workplaces:', error);
    res.status(500).json({ 
      message: "Failed to fetch workplaces",
      error: error.message
    });
  }
});

// Middleware for error handling
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

// Check if we can find the static files
console.log('Current directory:', process.cwd());
console.log('Files in current directory:', fs.readdirSync('.'));
console.log('Files in dist directory (if exists):', fs.existsSync('./dist') ? fs.readdirSync('./dist') : 'dist directory not found');

// Serve static files in production - try different paths
if (fs.existsSync('./dist')) {
  console.log('Using ./dist for static files');
  app.use(express.static('./dist'));
} else if (fs.existsSync('/opt/render/project/src/dist')) {
  console.log('Using /opt/render/project/src/dist for static files');
  app.use(express.static('/opt/render/project/src/dist'));
} else {
  console.log('WARNING: Could not find dist directory');
}

// SPA support - serve index.html for all other routes with fallbacks
app.get('*', (req, res) => {
  const paths = [
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join('/opt/render/project/src/dist', 'index.html'),
    path.join('/opt/render/project/src/client/dist', 'index.html')
  ];
  
  // Try each path in sequence until we find one that exists
  for (const filePath of paths) {
    if (fs.existsSync(filePath)) {
      console.log('Serving index.html from:', filePath);
      return res.sendFile(filePath);
    }
  }
  
  // If no path works, send a helpful error
  res.status(500).send('Unable to find index.html. Check server logs for details.');
});

// Start server
const PORT = process.env.PORT || 10000;
createServer(app).listen(PORT, '0.0.0.0', () => {
  console.log(\`Production server running on port \${PORT}\`);
});
EOF

# Build the production server
npx esbuild server-prod.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js

# Check if we have prebuilt files
if [ -f "dist/public/index.html" ]; then
  echo "Found prebuilt files in dist/public, preserving them"
  # Make sure the server finds the index.html file
  cp dist/public/index.html dist/index.html
else
  # Create a fallback index.html if no prebuilt files
  echo "WARNING: index.html not found, creating a fallback version"
  cat > dist/index.html << HTML_EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rate My Locum</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
      }
      h1 {
        font-size: 2.5rem;
        color: #0070f3;
      }
      p {
        font-size: 1.25rem;
        line-height: 1.5;
      }
      .logo {
        font-size: 3rem;
        margin-bottom: 2rem;
      }
    </style>
  </head>
  <body>
    <div>
      <div class="logo">🏥</div>
      <h1>Rate My Locum</h1>
      <p>
        The site is currently in maintenance mode. Please check back shortly.
      </p>
      <p>
        <a href="/api/health">Check Server Health</a> | 
        <a href="/api/workplaces">View Workplaces API</a>
      </p>
    </div>
  </body>
</html>
HTML_EOF
fi

# Final check of dist directory
echo "Final dist directory contents:"
ls -la dist || echo "dist directory still not found - this is a critical error"