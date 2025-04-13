# Deploying to Render

Follow these steps to deploy your Rate My Locum application to Render:

## 1. Create a Web Service

1. Sign up for a Render account at [render.com](https://render.com/) if you don't already have one
2. From your dashboard, click "New" and select "Web Service"
3. Connect your GitHub repository or upload your code directly

## 2. Configure the Web Service

Enter the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `rate-my-locum` (or your preferred name) |
| **Environment** | `Node` |
| **Region** | Choose the closest to your target users (e.g., `EU West` for UK users) |
| **Branch** | `main` (or your production branch) |
| **Build Command** | `./render-build.sh` |
| **Start Command** | `./render-start.sh` (IMPORTANT: Make sure there are no extra spaces or characters) |
| **Plan** | Select appropriate plan (Individual is $7/month) |

## 3. Environment Variables

Add the following environment variables:

| Variable | Description |
|----------|-------------|
| `SESSION_SECRET` | A random string for securing session cookies (e.g., generate with `openssl rand -hex 32`) |
| `NODE_ENV` | Set to `production` |
| `PORT` | `10000` (Render will use this internally) |

## 4. Database Setup

1. Create a new PostgreSQL database from your Render dashboard:
   - Click "New" and select "PostgreSQL"
   - Name it `rate-my-locum-db` (or similar)
   - Choose the region closest to your users
   - Select appropriate plan (Starter is $7/month with 1GB storage)
   - Click "Create Database"

2. Link the database to your web service:
   - In your Web Service settings, go to the "Environment" tab
   - Add the `DATABASE_URL` environment variable provided by Render for your database
   - Format: `postgres://username:password@host:port/database_name`

3. Run database migrations after first deploy:
   - SSH into your instance or use the Render Shell
   - Run `node db-migrate.js` to apply the schema

## 5. Initial Deploy

1. Click "Create Web Service"
2. Wait for the build and deployment to complete (this may take several minutes)
3. Monitor the logs for any issues during the build process
4. Once deployed, your app will be available at `https://[service-name].onrender.com`

## 6. Custom Domain Setup

1. In your Web Service settings, go to the "Settings" tab
2. Scroll to "Custom Domains"
3. Add your domains (ratemylocum.com and ratemylocum.co.uk)
4. Follow the instructions to verify domain ownership:
   - Add the provided DNS records through your domain registrar
   - For CNAME records: Point to `[service-name].onrender.com`
   - For TXT records: Add the verification value exactly as shown
5. Wait for DNS propagation (can take up to 48 hours, but often much faster)
6. Once verified, Render will automatically provision SSL certificates

## 7. Production Checklist

Before final launch, verify:

- [ ] Authentication works properly
- [ ] Database connections are stable
- [ ] All API endpoints respond correctly
- [ ] Proper error handling is in place
- [ ] Session cookies and security settings are configured
- [ ] SSL certificates are valid for your custom domains

## Troubleshooting

### Common Issues and Solutions

#### Bad Gateway Error
If your site shows a "Bad Gateway" error after deployment:
1. Check if the server is actually running by viewing the logs in the Render dashboard
2. Try accessing the health check endpoint directly: `https://[your-service-name].onrender.com/api/health`
3. If the health check returns a response, your server is running but might have issues with serving the static files
4. If the health check fails, there might be a database connection issue. Check the DATABASE_URL environment variable

The updated server implementation now includes:
- Error handling for database connection issues
- A health check endpoint at `/api/health`
- Fallback to memory-based session store if database is unavailable
- Better logging for debugging

#### Error: ENOENT: no such file or directory, stat '/opt/render/project/src/dist/index.html'
If you get this error, it indicates that the static files aren't being found in the expected location. The updated build script:
1. Adds additional debugging information to locate where files are being created
2. Tries multiple paths to find and serve the index.html file
3. Creates a fallback index.html file if the Vite build process fails

#### Error: Cannot find package 'vite'
If you see this error in the build logs or during runtime:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vite' imported from ...
```
This issue has been addressed with a completely new production server implementation that doesn't depend on Vite at all. The updated `render-build.sh` creates a standalone server-prod.ts file with all necessary code for production without any Vite dependencies.

#### Error: "nd ./render-start.sh" command not found
If you see this error:
```
bash: line 1: nd: command not found
```
There may be invisible characters or spaces in your Start Command field. Go to your Web Service settings and:
1. Delete the entire Start Command value
2. Type it again fresh as: `./render-start.sh`
3. Make sure there are no extra spaces before or after

#### Database Connection Issues
If your application deploys but can't connect to the database:
1. Verify the DATABASE_URL environment variable is set correctly
2. Check if your database is in the same region as your web service
3. Make sure your IP allowlist in the database settings includes your web service

#### General Troubleshooting Steps
1. Check the logs in the Render dashboard for specific error messages
2. Ensure the render-build.sh and render-start.sh files are executable (`chmod +x render-*.sh`)
3. Verify that the build command in render-build.sh is using the correct paths
4. If required, use "Manual Deploy" in the Render dashboard to retry a failed deployment