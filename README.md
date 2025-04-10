# Rate My Locum

A community-driven platform where locum healthcare professionals can rate and review workplaces and agencies.

## Deployment Instructions

### Deploying to Vercel with custom domains

1. Create a new project on Vercel by importing your GitHub repository
2. During setup, configure the following:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Framework Preset: Vite

3. Add environment variables in Vercel:
   - `DATABASE_URL`: Your PostgreSQL database connection string
   - `SESSION_SECRET`: A secure random string for session encryption

4. Connect your custom domains:
   - Go to Project Settings > Domains
   - Add your domains: `ratemylocum.com` and `ratemylocum.co.uk`
   - Follow Vercel's instructions to verify domain ownership (if needed)
   - Ensure DNS settings are properly configured to point to Vercel

### Database Setup

Before deploying, ensure your database is properly set up:

1. Create a PostgreSQL database (you can use Vercel Postgres)
2. Run migrations with `npm run db:push`

### Post-Deployment Verification

After deployment, verify:
1. The website is accessible via both domains
2. Database connections are working properly
3. User authentication functions as expected
4. All features are working as intended in the production environment