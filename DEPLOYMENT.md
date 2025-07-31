# 🚀 Deployment Guide

This guide will help you deploy the Tier-Based Event Showcase application to Vercel.

## Prerequisites

- GitHub account
- Vercel account
- Clerk.dev account
- Supabase account

## Step 1: Prepare Your Repository

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit: Tier-based event showcase"
git push origin main
```

## Step 2: Set Up Clerk.dev

1. Go to [Clerk.dev](https://clerk.dev) and sign in
2. Create a new application
3. Configure your application settings:
   - **Application Name**: Tier Event Showcase
   - **Environment**: Production
4. Copy your keys:
   - Publishable Key
   - Secret Key

## Step 3: Set Up Supabase

1. Go to [Supabase](https://supabase.com) and sign in
2. Create a new project
3. Go to Settings > API and copy:
   - Project URL
   - Anon Key
   - Service Role Key
4. Run the database setup script:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `database-setup.sql`
   - Execute the script

## Step 4: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

## Step 5: Configure Environment Variables

In your Vercel project dashboard, go to Settings > Environment Variables and add:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Step 6: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

## Step 7: Configure Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Configure DNS settings as instructed

## Step 8: Test Your Deployment

1. Visit your deployed application
2. Test the authentication flow
3. Verify that events are loading correctly
4. Test tier upgrades
5. Check responsive design on mobile devices

## Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Ensure all variables are set in Vercel dashboard
   - Redeploy after adding variables
   - Check variable names match exactly

2. **Database Connection Issues**
   - Verify Supabase URL and keys are correct
   - Check if the `events` table exists
   - Ensure RLS policies are configured correctly

3. **Authentication Issues**
   - Verify Clerk keys are correct
   - Check Clerk application settings
   - Ensure redirect URLs are configured

4. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are installed
   - Verify Next.js configuration

### Performance Optimization

1. **Enable Caching**
   - Configure Supabase caching policies
   - Use Next.js image optimization
   - Enable Vercel edge caching

2. **Monitor Performance**
   - Use Vercel Analytics
   - Monitor Supabase query performance
   - Check Core Web Vitals

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive keys to Git
   - Use Vercel's environment variable encryption
   - Rotate keys regularly

2. **Database Security**
   - Enable Row Level Security (RLS)
   - Use least privilege principle
   - Monitor database access logs

3. **Authentication Security**
   - Configure Clerk security settings
   - Enable MFA for admin accounts
   - Monitor authentication logs

## Maintenance

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor for security vulnerabilities
   - Update environment variables as needed

2. **Backup Strategy**
   - Regular database backups
   - Version control for code
   - Document configuration changes

3. **Monitoring**
   - Set up error tracking
   - Monitor application performance
   - Track user engagement metrics

---

**Your application is now deployed and ready to use! 🎉** 