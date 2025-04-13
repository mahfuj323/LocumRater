#!/bin/bash
# Install all dependencies
npm ci

# Install vite locally to ensure it's available during build
npm install vite --no-save

# Build client with Vite - this builds to dist directory
npx vite build --emptyOutDir

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

// Setup database connection
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// Connect-pg-simple for session store 
const PostgresSessionStore = connectPg(session);
const sessionStore = new PostgresSessionStore({ 
  pool, 
  createTableIfMissing: true 
});

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

// Database access functions
async function getUser(id) {
  const [user] = await db.execute(\`SELECT * FROM users WHERE id = \${id}\`);
  return user || undefined;
}

async function getUserByUsername(username) {
  const [user] = await db.execute(\`SELECT * FROM users WHERE username = '\${username}'\`);
  return user || undefined;
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

// Add essential API routes
app.get('/api/workplaces', async (req, res) => {
  try {
    // Basic workplaces endpoint for initial testing
    const query = 'SELECT * FROM workplaces LIMIT 10';
    const result = await pool.query(query);
    const workplaces = result.rows || [];
    
    // For non-authenticated users, return limited data
    if (!req.isAuthenticated()) {
      const limitedWorkplaces = workplaces.slice(0, 3);
      return res.json({ workplaces: limitedWorkplaces, isLimited: true });
    }
    
    res.json({ workplaces, isLimited: false });
  } catch (error) {
    console.error('Error fetching workplaces:', error);
    res.status(500).json({ message: "Failed to fetch workplaces" });
  }
});

// Middleware for error handling
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

// Serve static files in production
app.use(express.static('./dist'));

// SPA support - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 10000;
createServer(app).listen(PORT, '0.0.0.0', () => {
  console.log(\`Production server running on port \${PORT}\`);
});
EOF

# Build the production server
npx esbuild server-prod.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js