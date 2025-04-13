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
| **Start Command** | `./render-start.sh` |
| **Plan** | Select appropriate plan (Individual is $7/month) |

## 3. Environment Variables

Add the following environment variables:

| Variable | Description |
|----------|-------------|
| `SESSION_SECRET` | A random string for securing session cookies |
| `PORT` | `10000` (Render will use this internally) |

## 4. Database Setup

1. Create a new PostgreSQL database from your Render dashboard
2. In your Web Service settings, add the `DATABASE_URL` environment variable provided by Render for your database
3. Alternatively, you can use a Neon Database and add its connection string as the `DATABASE_URL` environment variable

## 5. Initial Deploy

1. Click "Create Web Service"
2. Wait for the build and deployment to complete
3. Once deployed, your app will be available at `https://[service-name].onrender.com`

## 6. Custom Domain Setup

1. In your Web Service settings, go to the "Settings" tab
2. Scroll to "Custom Domains"
3. Add your domains (ratemylocum.com and ratemylocum.co.uk)
4. Follow the instructions to verify domain ownership and configure DNS settings

## Troubleshooting

If you encounter a build error related to Vite or ESM modules:

1. Check the logs in the Render dashboard
2. Ensure the render-build.sh file is executable (`chmod +x render-build.sh`)
3. Try deploying again