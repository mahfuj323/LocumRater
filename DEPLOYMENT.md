# Deployment Guide for Rate My Locum

This guide will help you deploy the Rate My Locum application to your domains (ratemylocum.com and ratemylocum.co.uk) using Vercel.

## Prerequisites

- GitHub account
- Vercel account
- Access to domain DNS settings for ratemylocum.com and ratemylocum.co.uk
- PostgreSQL database (can be provisioned through Vercel)

## Step 1: Export Project from Replit to GitHub

1. From your Replit project, go to the "Version Control" tab in the sidebar
2. Initialize a Git repository if you haven't already
3. Commit all changes with a message like "Prepare for deployment"
4. Connect to GitHub and push the repository

## Step 2: Import Project to Vercel

1. Log in to your Vercel account
2. Click "Add New..." > "Project"
3. Select the GitHub repository you pushed from Replit
4. Configure the following settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Expand "Environment Variables" and add:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A random secure string for session management

## Step 3: Configure Database

1. In Vercel dashboard, go to "Storage" tab
2. Click "Connect Database" and select PostgreSQL
3. Follow the setup wizard to create a new database
4. Once created, Vercel will automatically add the DATABASE_URL environment variable
5. After deployment, run database migrations with:
   ```
   npm run db:push
   ```

## Step 4: Connect Your Domains

1. In your Vercel project, go to "Settings" > "Domains"
2. Add both domains:
   - ratemylocum.com
   - ratemylocum.co.uk
3. Follow Vercel's instructions to verify domain ownership:
   - Option 1: Add DNS records through your domain registrar
   - Option 2: Change nameservers to Vercel's (recommended)
4. Wait for DNS propagation (can take up to 48 hours, but usually faster)

## Step 5: Verify Deployment

1. Visit both domains in your browser
2. Check that all features are working:
   - User registration and login
   - Workplace and agency listings
   - Reviews functionality
   - Search functionality
3. Monitor Vercel logs for any errors

## Troubleshooting

If you encounter issues after deployment:

1. Check Vercel's deployment logs
2. Verify environment variables are set correctly
3. Make sure the database connection is working
4. Test DNS configuration using tools like [dnschecker.org](https://dnschecker.org)

## Ongoing Maintenance

For future updates:
1. Make changes in your GitHub repository or via Replit
2. Push changes to GitHub
3. Vercel will automatically deploy new changes

Need help? Refer to Vercel's documentation at https://vercel.com/docs