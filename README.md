# 🚀 Tier-Based Event Showcase

A responsive web application that allows logged-in users to view events based on their user tier (Free, Silver, Gold, Platinum). Users can only see events available to their tier or any lower tier, with real-time tier upgrades, secure database access, powerful search functionality, and advanced sorting options.

## Live Link - 
https://event-showcase-app.vercel.app/

## Demo User Credentials
   # Free Tier
   - Username - freeuser123
   - Email ID - freeuser@example.com
   - Password - password123

   # Silver Tier
   - Username - silveruser123
   - Email ID - silveruser@example.com
   - Password - password123

   # Gold Tier
   - Username - golduser123
   - Email ID - golduser@example.com
   - Password - password123

   # Platinum Tier
   - Username - platinumuser123
   - Email ID - platinumuser@example.com
   - Password - password123
   
## 🎯 Features

### Core Features
- **Authentication**: Secure login/signup with Clerk.dev
- **Tier-Based Access**: Events filtered by user tier with hierarchical access
- **Real-time Tier Upgrades**: Users can upgrade their tier instantly and see new events
- **Secure Database Access**: Row Level Security (RLS) with custom RPC functions
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Modern UI**: Clean, elegant design with loading states and error handling

### 🔍 Advanced Search & Filter Features
- **Real-time Search**: Instant search results as you type
- **Multi-field Search**: Search across event titles, descriptions, locations, categories, and tiers
- **Case-insensitive Search**: Search works regardless of capitalization
- **Search Results Counter**: Shows number of matching events
- **Clear Search**: Quick clear button to reset search
- **No Results Handling**: Helpful messages when no events match search criteria

### 📊 Advanced Sorting Features
- **Multiple Sort Options**: 
  - **By Title**: A-Z and Z-A alphabetical sorting
  - **By Date**: Earliest first or Latest first (chronological)
  - **By Location**: A-Z and Z-A location sorting  
  - **By Tier**: Free to Platinum or Platinum to Free hierarchy
  - **By Category**: A-Z and Z-A category sorting
  - **Default Order**: Original database order
- **Combined Search & Sort**: Sorting works on both all events and search results
- **Smart Sorting Logic**: Proper handling of dates, tier hierarchy, and text sorting
- **Visual Sort Indicator**: Shows current sorting method
- **Organized Options**: Sort options grouped by category for better UX

### 🎨 Enhanced User Interface
- **Flexible Layout**: Search and sort controls adapt to screen size
- **Visual Icons**: Search and sort icons for better visual clarity
- **Status Feedback**: Real-time information about search results and sorting
- **Mobile Responsive**: Optimized experience across all devices
- **Intuitive Controls**: Clean, accessible interface elements

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
    location TEXT,
    category TEXT,
    image_url TEXT,
    tier TEXT NOT NULL CHECK (tier IN ('free', 'silver', 'gold', 'platinum')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_tier ON events(tier);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_title ON events(title);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- Insert sample events with enhanced data for search and sorting
INSERT INTO events (title, description, event_date, location, category, image_url, tier) VALUES
-- Free Tier Events
('Community Meetup', 'Join us for a casual community meetup where you can network with fellow enthusiasts and share your experiences.', '2025-03-15 18:00:00+00', 'Community Center, New York', 'Networking', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop', 'free'),
('Introduction to Web Development', 'Learn the basics of HTML, CSS, and JavaScript in this beginner-friendly workshop.', '2025-03-20 14:00:00+00', 'Tech Hub, San Francisco', 'Education', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop', 'free'),
('Open Source Friday', 'Contribute to open source projects and learn from experienced developers in our weekly meetup.', '2025-03-22 17:00:00+00', 'Library, Austin', 'Development', 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop', 'free'),

-- Silver Tier Events
('Advanced JavaScript Workshop', 'Deep dive into modern JavaScript features including ES6+, async/await, and functional programming concepts.', '2025-03-25 10:00:00+00', 'Innovation Lab, Boston', 'Programming', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', 'silver'),
('React Fundamentals', 'Master React basics including components, props, state, and hooks in this comprehensive workshop.', '2025-04-01 15:00:00+00', 'Tech Campus, Seattle', 'Frontend', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop', 'silver'),
('Database Design Patterns', 'Learn advanced database design patterns and optimization techniques for modern applications.', '2025-04-03 13:00:00+00', 'Data Center, Chicago', 'Database', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop', 'silver'),

-- Gold Tier Events
('Full-Stack Development Bootcamp', 'Intensive 3-day bootcamp covering frontend, backend, and database development with real-world projects.', '2025-04-10 09:00:00+00', 'Bootcamp Center, Los Angeles', 'Intensive', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop', 'gold'),
('System Design Workshop', 'Learn to design scalable systems and architecture patterns used by top tech companies.', '2025-04-15 13:00:00+00', 'Architecture Hub, Denver', 'Architecture', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', 'gold'),
('DevOps Masterclass', 'Master containerization, CI/CD, and cloud deployment strategies for modern applications.', '2025-04-18 11:00:00+00', 'Cloud Center, Miami', 'DevOps', 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=300&fit=crop', 'gold'),

-- Platinum Tier Events
('AI/ML Masterclass', 'Exclusive masterclass on artificial intelligence and machine learning with hands-on projects.', '2025-04-25 11:00:00+00', 'AI Research Lab, Palo Alto', 'Artificial Intelligence', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop', 'platinum'),
('Tech Leadership Summit', 'Premium event featuring industry leaders sharing insights on technology leadership and innovation.', '2025-05-01 16:00:00+00', 'Executive Center, New York', 'Leadership', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop', 'platinum'),
('Blockchain & Web3 Conference', 'Cutting-edge conference on blockchain technology, DeFi, and the future of web3.', '2025-05-05 10:00:00+00', 'Innovation Hub, Austin', 'Blockchain', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop', 'platinum');

-- Create RPC function for secure tier-based filtering
CREATE OR REPLACE FUNCTION get_events_by_tier(user_tier TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  event_date TIMESTAMPTZ,
  location TEXT,
  category TEXT,
  image_url TEXT,
  tier TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT e.id, e.title, e.description, e.event_date, e.location, e.category, e.image_url, e.tier, e.created_at
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

### 6. Next.js Image Configuration

Create or update your `next.config.js` file in the root directory:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎭 How It Works

### Tier System
The application implements a hierarchical tier system where higher tiers have access to all lower tier content:

- **Free Tier**: 3 events (free events only)
- **Silver Tier**: 6 events (free + silver events)
- **Gold Tier**: 9 events (free + silver + gold events)
- **Platinum Tier**: 12 events (all events)

### Search & Sort System
The application features a powerful client-side search and sort system:

#### Search Functionality
- **Real-time filtering**: Events filter instantly as you type
- **Multi-field search**: Searches across title, description, location, category, and tier
- **Case-insensitive**: Works regardless of text casing
- **Visual feedback**: Shows search results count and clear options

#### Sort Functionality
- **Multiple criteria**: Sort by title, date, location, tier, or category
- **Bidirectional sorting**: Both ascending and descending options
- **Smart sorting**: Proper date parsing and tier hierarchy handling
- **Combined with search**: Sorting applies to search results
- **Visual indicators**: Shows current sort method

### Real-time Tier Upgrades
Users can instantly upgrade their tier using the tier buttons in the interface. The system:
1. Updates the user's tier in Clerk's public metadata
2. Refreshes the user data
3. Re-fetches events based on the new tier
4. Updates the UI immediately
5. Maintains search and sort preferences

## 🏗️ Project Structure

```
tier-event-showcase/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── upgrade-tier/
│   │   │       └── route.js    # API endpoint for tier upgrades
│   │   ├── layout.js           # Root layout with Clerk provider
│   │   ├── page.js             # Main page with auth, events, search & sort
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── EventCard.js        # Individual event card component
│   │   ├── TierBadge.js        # Tier badge component
│   │   └── LoadingSpinner.js   # Loading spinner component
│   └── lib/
│       └── supabase.js         # Supabase client configuration
├── middleware.js               # Clerk authentication middleware
├── next.config.js              # Next.js configuration with image domains
└── README.md                   # This file
```

## 🔧 Key Features Explained

### Secure Database Access
- **Row Level Security (RLS)**: Enabled on the events table for security
- **Custom RPC Function**: `get_events_by_tier()` handles tier-based filtering securely
- **Optimized Queries**: Database-level filtering for better performance
- **Enhanced Indexing**: Multiple indexes for fast search and sort operations

### Advanced Search Implementation
- **Client-side Processing**: Fast, responsive search without server requests
- **Debounced Updates**: Efficient processing of search input changes
- **Multi-field Matching**: Comprehensive search across all relevant event fields
- **State Management**: Proper handling of search state and results

### Smart Sorting System
- **Multiple Sort Criteria**: Comprehensive sorting options for different use cases
- **Intelligent Sorting**: Proper handling of dates, text, and custom tier hierarchy
- **Combined Operations**: Search and sort work together seamlessly
- **Performance Optimized**: Efficient sorting algorithms for smooth user experience

### API Routes
- **`/api/upgrade-tier`**: POST endpoint that updates user tier in Clerk
- **Authentication**: Validates user authentication before processing
- **Error Handling**: Comprehensive error handling and logging

### Real-time Updates
- **User Reload**: Forces refresh of user data from Clerk after tier upgrade
- **Event Refetch**: Automatically refetches events with new tier permissions
- **UI Updates**: Immediate visual feedback for tier changes
- **State Preservation**: Maintains search and sort preferences during updates

### Security Features
- **Authentication Required**: All features require user authentication
- **Server-side Validation**: Tier upgrades validated on the server
- **Database Security**: RLS policies prevent unauthorized data access
- **XSS Protection**: Proper input sanitization and output encoding

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
4. Include location and category data for enhanced search functionality

### Adding New Search Fields
1. Update the search logic in the main page component
2. Add new fields to the search filter function
3. Update the search placeholder text if needed

### Adding New Sort Options
1. Add new sort cases to the sort switch statement
2. Update the sort dropdown options
3. Add corresponding labels to the `getSortLabel` function

### Adding New Tiers
1. Update the tier hierarchy in the search and sort logic
2. Update the `get_events_by_tier` RPC function in Supabase
3. Add new tier configuration in `TierBadge.js`
4. Update the tier upgrade buttons in the main component
5. Update tier-based sorting logic

### Modifying UI Elements
- **Tier Colors**: Edit the `TierBadge.js` component
- **Search Styling**: Update search bar classes in the main component
- **Sort Options**: Modify the sort dropdown structure and styling

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env.local` is in the root directory
   - Restart the development server after adding variables

2. **Database Connection Issues**
   - Verify Supabase URL and keys are correct
   - Check if the `events` table exists with all required columns
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

5. **Search Not Working**
   - Verify event data has the required fields (title, description, location, category)
   - Check browser console for JavaScript errors
   - Ensure search state is properly managed

6. **Sort Not Working**
   - Check if event data has proper date formats
   - Verify tier values match expected hierarchy
   - Ensure sort state is properly updated

7. **Image Loading Issues**
   - Verify `next.config.js` includes Unsplash domain
   - Check if image URLs are valid
   - Ensure Next.js Image component has proper width/height props

8. **Tier Upgrades Not Working**
   - Check API route `/api/upgrade-tier` is accessible
   - Verify Clerk client is properly imported in API route
   - Check server logs for detailed error messages

### Debug Tips

- Check browser console for client-side errors
- Check server logs for API route errors
- Use Supabase dashboard to verify data and run queries manually
- Test the RPC function directly in Supabase SQL editor
- Use browser dev tools to inspect search and sort state changes
- Verify event data structure matches expected format

### Performance Optimization

- **Search Performance**: Consider implementing debounced search for very large datasets
- **Sort Performance**: For datasets with 1000+ events, consider server-side sorting
- **Image Loading**: Use Next.js Image component for automatic optimization
- **State Management**: Consider using useCallback for search and sort handlers

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test search and sort functionality thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

## 🎉 Recent Updates

### Version 2.0 Features
- **🔍 Advanced Search**: Real-time search across multiple event fields
- **📊 Smart Sorting**: Multiple sorting options with intelligent handling
- **🎨 Enhanced UI**: Improved layout with search and sort controls
- **📱 Mobile Optimization**: Better responsive design for all screen sizes
- **⚡ Performance**: Optimized search and sort operations
- **🔒 Security**: Enhanced data validation and error handling

---

**Happy Coding! 🎉**