🚀 Deployment Guide
This guide will help you deploy the Tier-Based Event Showcase application to Vercel with all the latest features including real-time tier upgrades and secure database access.

Prerequisites
GitHub account
Vercel account
Clerk.dev account
Supabase account
Node.js 18+ installed locally
Step 1: Prepare Your Repository
Ensure your code is ready for deployment:
bash
# Test the build locally first
npm run build

# Push your code to GitHub
git add .
git commit -m "Complete tier-based event showcase with RLS and real-time upgrades"
git push origin main
Step 2: Set Up Clerk.dev
Go to Clerk.dev and sign in
Create a new application
Configure your application settings:
Application Name: Tier Event Showcase
Environment: Production
Configure authentication methods:
Enable Email/Password
Enable Google OAuth (optional)
Enable GitHub OAuth (optional)
Copy your keys from the API Keys section:
Publishable Key (starts with pk_live_ or pk_test_)
Secret Key (starts with sk_live_ or sk_test_)
Step 3: Set Up Supabase
Go to Supabase and sign in
Create a new project:
Project Name: tier-event-showcase
Database Password: Create a strong password
Region: Choose closest to your users
Wait for project setup to complete
Go to Settings > API and copy:
Project URL
Anon Key (public)
Service Role Key (secret)
Set up the database:
sql
-- Go to SQL Editor in your Supabase dashboard and run this complete setup:

-- Create the events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url TEXT,
    tier TEXT NOT NULL CHECK (tier IN ('free', 'silver', 'gold', 'platinum')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_tier ON events(tier);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);

-- Insert sample events with 2025 dates
INSERT INTO events (title, description, event_date, image_url, tier) VALUES
-- Free Tier Events
('Community Meetup', 'Join us for a casual community meetup where you can network with fellow enthusiasts and share your experiences.', '2025-03-15 18:00:00+00', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop', 'free'),
('Introduction to Web Development', 'Learn the basics of HTML, CSS, and JavaScript in this beginner-friendly workshop.', '2025-03-20 14:00:00+00', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop', 'free'),

-- Silver Tier Events
('Advanced JavaScript Workshop', 'Deep dive into modern JavaScript features including ES6+, async/await, and functional programming concepts.', '2025-03-25 10:00:00+00', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', 'silver'),
('React Fundamentals', 'Master React basics including components, props, state, and hooks in this comprehensive workshop.', '2025-04-01 15:00:00+00', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop', 'silver'),

-- Gold Tier Events
('Full-Stack Development Bootcamp', 'Intensive 3-day bootcamp covering frontend, backend, and database development with real-world projects.', '2025-04-10 09:00:00+00', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop', 'gold'),
('System Design Workshop', 'Learn to design scalable systems and architecture patterns used by top tech companies.', '2025-04-15 13:00:00+00', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', 'gold'),

-- Platinum Tier Events
('AI/ML Masterclass', 'Exclusive masterclass on artificial intelligence and machine learning with hands-on projects.', '2025-04-25 11:00:00+00', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop', 'platinum'),
('Tech Leadership Summit', 'Premium event featuring industry leaders sharing insights on technology leadership and innovation.', '2025-05-01 16:00:00+00', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop', 'platinum');

-- Create the secure RPC function for tier-based filtering
CREATE OR REPLACE FUNCTION get_events_by_tier(user_tier TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  event_date TIMESTAMPTZ,
  image_url TEXT,
  tier TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT e.id, e.title, e.description, e.event_date, e.image_url, e.tier, e.created_at
  FROM events e
  WHERE 
    CASE user_tier
      WHEN 'free' THEN e.tier = 'free'
      WHEN 'silver' THEN e.tier IN ('free', 'silver')
      WHEN 'gold' THEN e.tier IN ('free', 'silver', 'gold')
      WHEN 'platinum' THEN e.tier IN ('free', 'silver', 'gold', 'platinum')
      ELSE e.tier = 'free'
    END
  ORDER BY e.event_date ASC;
END;
$$;

-- Enable Row Level Security for enhanced security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create RLS policy that allows reading events
CREATE POLICY "Allow read access to events" ON events
    FOR SELECT USING (true);

-- Verify setup
SELECT tier, COUNT(*) as count 
FROM events 
GROUP BY tier 
ORDER BY 
  CASE tier 
    WHEN 'free' THEN 1 
    WHEN 'silver' THEN 2 
    WHEN 'gold' THEN 3 
    WHEN 'platinum' THEN 4 
  END;
Step 4: Deploy to Vercel
Go to Vercel and sign in with GitHub
Click "New Project"
Import your GitHub repository
Configure the project:
Framework Preset: Next.js (should auto-detect)
Root Directory: ./ (default)
Build Command: npm run build (default)
Output Directory: .next (default)
Install Command: npm install (default)
Step 5: Configure Environment Variables
⚠️ Critical Step: In your Vercel project dashboard, go to Settings > Environment Variables and add these exactly:

Production Environment Variables:
env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
Environment Variable Setup Tips:
Set environment to Production for all variables
Double-check each key for typos
Use the live keys from Clerk for production
Keep the service role key secure (never expose publicly)
Step 6: Configure Clerk for Production
In your Clerk dashboard, go to Domains
Add your Vercel domain: https://your-project.vercel.app
If using a custom domain, add that too
Configure redirect URLs:
Sign-in redirect: https://your-project.vercel.app
Sign-up redirect: https://your-project.vercel.app
After sign-out: https://your-project.vercel.app
Update CORS settings to allow your domain
Step 7: Deploy and Test
Click "Deploy" in Vercel
Monitor the build process in the deployment logs
Once deployed, your app will be available at https://your-project.vercel.app
Post-Deployment Testing Checklist:
✅ Authentication Flow

 Sign up with new account works
 Sign in with existing account works
 Sign out functionality works
 User data persists correctly
✅ Tier System

 Free tier shows 2 events
 Silver tier shows 4 events (free + silver)
 Gold tier shows 6 events (free + silver + gold)
 Platinum tier shows 8 events (all events)
✅ Real-time Features

 Tier upgrade buttons work
 Events update immediately after tier change
 UI reflects new tier correctly
 No page refresh required
✅ Responsive Design

 Works on mobile devices
 Works on tablets
 Works on desktop
 All interactive elements are touch-friendly
Step 8: Configure Custom Domain (Optional)
In your Vercel project dashboard, go to Settings > Domains
Add your custom domain (e.g., events.yourdomain.com)
Configure DNS settings:
Add CNAME record pointing to cname.vercel-dns.com
Or add A record pointing to Vercel's IP
Update Clerk domain settings to include your custom domain
Test SSL certificate is working correctly
Step 9: Set Up Monitoring and Analytics
Vercel Analytics (Recommended)
In your Vercel dashboard, go to Analytics
Enable Web Analytics
Add the analytics code to your Next.js app
Error Monitoring
Consider integrating Sentry for error tracking
Set up Vercel's built-in error reporting
Monitor API route performance
Troubleshooting
Common Deployment Issues
Build Failures
bash
# Check these common issues:
- Missing dependencies in package.json
- TypeScript errors (if using TS)
- Environment variables not set
- API route import errors
Environment Variables Not Working
Verify all variable names match exactly
Ensure no trailing spaces in values
Redeploy after adding variables
Check that public variables start with NEXT_PUBLIC_
Database Connection Issues
Test Supabase connection in local development first
Verify RPC function exists: SELECT * FROM get_events_by_tier('free');
Check RLS policies are not blocking queries
Ensure service role key has correct permissions
Authentication Issues
Add production domain to Clerk dashboard
Check redirect URLs are configured correctly
Verify publishable key is for correct environment
Test auth flow in incognito mode
API Routes Not Working
Check /api/upgrade-tier route exists
Verify Clerk client import in API route
Check server logs in Vercel Functions tab
Test API endpoints independently
Debug Commands
bash
# Test locally with production environment
npm run build
npm run start

# Check Supabase connection
npx supabase status

# Test Clerk authentication
# Use Clerk dashboard's test mode

# Verify environment variables
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Performance Optimization
Database Optimization
Ensure indexes are created on frequently queried columns
Monitor query performance in Supabase dashboard
Use connection pooling for high traffic
Next.js Optimization
Enable Next.js image optimization
Use static generation where possible
Implement proper caching headers
Vercel Optimization
Enable Edge Functions for global performance
Configure proper caching strategies
Use Vercel's CDN for static assets
Security Checklist
Production Security
 Row Level Security (RLS) enabled on database
 Environment variables properly secured
 HTTPS enforced on all routes
 API routes have proper authentication
 No sensitive data in client-side code
 Regular security updates scheduled
Access Control
 User tiers properly validated server-side
 Database queries use parameterized statements
 Rate limiting implemented (consider Vercel's built-in protection)
 Input validation on all forms
Maintenance and Updates
Regular Maintenance Tasks
Weekly
Monitor error rates and performance
Check for dependency updates
Review user activity and tier upgrades
Monthly
Update dependencies with security patches
Review and rotate API keys if needed
Backup database and test restore procedures
Quarterly
Performance optimization review
Security audit
User experience improvements
Scaling Considerations
Monitor Vercel function execution limits
Consider Supabase connection limits
Plan for database scaling as users grow
Implement caching strategies for high traffic
🎉 Your Tier-Based Event Showcase is now live and ready for users!

Live URLs:

Application: https://your-project.vercel.app
Vercel Dashboard: https://vercel.com/your-username/your-project
Supabase Dashboard: https://app.supabase.com/projects/your-project-id
Clerk Dashboard: https://dashboard.clerk.com/apps/your-app-id
