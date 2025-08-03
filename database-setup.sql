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
(
    'Community Meetup',
 'Join us for a casual community meetup where you can network with fellow enthusiasts and share your experiences.',
  '2025-03-15 18:00:00+00',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop',
   'free'
   ),
(
    'Introduction to Web Development',
 'Learn the basics of HTML, CSS, and JavaScript in this beginner-friendly workshop.',
  '2025-03-20 14:00:00+00',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
   'free'
   ),

-- Silver Tier Events
(
    'Advanced JavaScript Workshop',
 'Deep dive into modern JavaScript features including ES6+, async/await, and functional programming concepts.',
 '2025-03-25 10:00:00+00',
 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
 'silver'
),
(
    'React Fundamentals',
 'Master React basics including components, props, state, and hooks in this comprehensive workshop.',
 '2025-04-01 15:00:00+00',
 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
 'silver'
),

-- Gold Tier Events
(
    'Full-Stack Development Bootcamp',
 'Intensive 3-day bootcamp covering frontend, backend, and database development with real-world projects.',
 '2025-04-10 09:00:00+00',
 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
 'gold'
),

(
    'System Design Workshop',
 'Learn to design scalable systems and architecture patterns used by top tech companies.',
 '2025-04-15 13:00:00+00',
 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
 'gold'
),

-- Platinum Tier Events
(
    'AI/ML Masterclass',
 'Exclusive masterclass on artificial intelligence and machine learning with hands-on projects.',
 '2025-04-25 11:00:00+00',
 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
 'platinum'
),
(
    'Tech Leadership Summit',
'Premium event featuring industry leaders sharing insights on technology leadership and innovation.',
 '2025-05-01 16:00:00+00',
 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop',
 'platinum'
);

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