# 🚀 Tier-Based Event Showcase

A responsive web application that allows logged-in users to view events based on their user tier (Free, Silver, Gold, Platinum). Users can only see events available to their tier or any lower tier, with real-time tier upgrades and secure database access.

## Live Link - 
https://event-showcase-app.vercel.app/

## 🎯 Features

- **Authentication**: Secure login/signup with Clerk.dev
- **Tier-Based Access**: Events filtered by user tier with hierarchical access
- **Real-time Tier Upgrades**: Users can upgrade their tier instantly and see new events
- **Secure Database Access**: Row Level Security (RLS) with custom RPC functions
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Modern UI**: Clean, elegant design with loading states and error handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) with JavaScript
- **Authentication**: Clerk.dev
- **Database**: Supabase (PostgreSQL) with RLS
- **Styling**: Tailwind CSS
- **API Routes**: Next.js API routes for tier management
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Clerk.dev account
- Supabase account

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd tier-event-showcase
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 4. Clerk Setup

1. Go to [Clerk.dev](https://clerk.dev) and create an account
2. Create a new application
3. Copy your publishable key and secret key
4. Update your `.env.local` file with the keys

### 5. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > API to get your URL and keys
4. Update your `.env.local` file with the Supabase credentials
5. Run the database setup script in Supabase SQL Editor:

```sql
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

-- Insert sample events
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

-- Create RPC function for secure tier-based filtering
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

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Allow read access to events" ON events
    FOR SELECT USING (true);
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎭 How It Works

### Tier System
The application implements a hierarchical tier system where higher tiers have access to all lower tier content:

- **Free Tier**: 2 events (free events only)
- **Silver Tier**: 4 events (free + silver events)
- **Gold Tier**: 6 events (free + silver + gold events)
- **Platinum Tier**: 8 events (all events)

### Real-time Tier Upgrades
Users can instantly upgrade their tier using the tier buttons in the interface. The system:
1. Updates the user's tier in Clerk's public metadata
2. Refreshes the user data
3. Re-fetches events based on the new tier
4. Updates the UI immediately

## 🏗️ Project Structure

```
tier-event-showcase/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── upgrade-tier/
│   │   │       └── route.js    # API endpoint for tier upgrades
│   │   ├── layout.js           # Root layout with Clerk provider
│   │   ├── page.js             # Main page with authentication and events
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── EventCard.js        # Individual event card component
│   │   ├── TierBadge.js        # Tier badge component
│   │   └── LoadingSpinner.js   # Loading spinner component
│   └── lib/
│       └── supabase.js         # Supabase client configuration
├── middleware.js               # Clerk authentication middleware
└── README.md                   # This file
```

## 🔧 Key Features Explained

### Secure Database Access
- **Row Level Security (RLS)**: Enabled on the events table for security
- **Custom RPC Function**: `get_events_by_tier()` handles tier-based filtering securely
- **Optimized Queries**: Database-level filtering for better performance

### API Routes
- **`/api/upgrade-tier`**: POST endpoint that updates user tier in Clerk
- **Authentication**: Validates user authentication before processing
- **Error Handling**: Comprehensive error handling and logging

### Real-time Updates
- **User Reload**: Forces refresh of user data from Clerk after tier upgrade
- **Event Refetch**: Automatically refetches events with new tier permissions
- **UI Updates**: Immediate visual feedback for tier changes

### Security Features
- **Authentication Required**: All features require user authentication
- **Server-side Validation**: Tier upgrades validated on the server
- **Database Security**: RLS policies prevent unauthorized data access

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🔧 Customization

### Adding New Events
1. Go to your Supabase dashboard
2. Navigate to the `events` table
3. Add new events with appropriate tier values (`free`, `silver`, `gold`, `platinum`)

### Adding New Tiers
1. Update the tier hierarchy in the `fetchEvents` function
2. Update the `get_events_by_tier` RPC function in Supabase
3. Add new tier configuration in `TierBadge.js`
4. Update the tier upgrade buttons in the main component

### Modifying Tier Colors
Edit the `TierBadge.js` component to change the color scheme for different tiers.

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env.local` is in the root directory
   - Restart the development server after adding variables

2. **Database Connection Issues**
   - Verify Supabase URL and keys are correct
   - Check if the `events` table exists in your database
   - Ensure the RPC function `get_events_by_tier` is created

3. **Authentication Issues**
   - Verify Clerk keys are correct
   - Check if Clerk application is properly configured
   - Ensure middleware is properly set up

4. **Events Not Loading**
   - Check if Row Level Security is properly configured
   - Verify the RPC function exists and works
   - Check browser console for any errors
   - Ensure sample data was inserted correctly

5. **Tier Upgrades Not Working**
   - Check API route `/api/upgrade-tier` is accessible
   - Verify Clerk client is properly imported in API route
   - Check server logs for detailed error messages

### Debug Tips

- Check browser console for client-side errors
- Check server logs for API route errors
- Use Supabase dashboard to verify data and run queries manually
- Test the RPC function directly in Supabase SQL editor

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

---

**Happy Coding! 🎉**