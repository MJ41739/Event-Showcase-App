# 🚀 Tier-Based Event Showcase

A responsive web application that allows logged-in users to view events based on their user tier (Free, Silver, Gold, Platinum). Users can only see events available to their tier or any lower tier.

## 🎯 Features

- **Authentication**: Secure login/signup with Clerk.dev
- **Tier-Based Access**: Events filtered by user tier with hierarchical access
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Real-time Tier Updates**: Simulate tier upgrades to see different events
- **Modern UI**: Clean, elegant design with loading states and error handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) with JavaScript
- **Authentication**: Clerk.dev
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
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
5. Run the database setup script:

```sql
-- Copy and paste the contents of database-setup.sql into your Supabase SQL editor
-- Or use the Supabase CLI to run the script
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎭 Demo User Credentials

For testing purposes, you can create accounts with different tiers:

### Free Tier User
- **Email**: free@example.com
- **Password**: password123
- **Tier**: Free (default)
- **Access**: Free events only

### Silver Tier User
- **Email**: silver@example.com
- **Password**: password123
- **Tier**: Silver
- **Access**: Free + Silver events

### Gold Tier User
- **Email**: gold@example.com
- **Password**: password123
- **Tier**: Gold
- **Access**: Free + Silver + Gold events

### Platinum Tier User
- **Email**: platinum@example.com
- **Password**: password123
- **Tier**: Platinum
- **Access**: All events (Free + Silver + Gold + Platinum)

## 🏗️ Project Structure

```
tier-event-showcase/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout with Clerk provider
│   │   ├── page.js            # Main page with authentication and events
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── EventCard.js       # Individual event card component
│   │   └── TierBadge.js       # Tier badge component
│   └── lib/
│       └── supabase.js        # Supabase client configuration
├── middleware.js              # Clerk authentication middleware
├── database-setup.sql         # Database schema and sample data
└── README.md                  # This file
```

## 🎨 Features Explained

### Tier-Based Filtering
The application implements a hierarchical tier system:
- **Free**: Access to free events only
- **Silver**: Access to free + silver events
- **Gold**: Access to free + silver + gold events
- **Platinum**: Access to all events

### Authentication Flow
1. Users must sign in to access the event listing
2. User tier is stored in Clerk's public metadata
3. Events are filtered based on the user's tier
4. Users can simulate tier upgrades using the tier buttons

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Grid layout that adapts to screen size
- Touch-friendly interface elements

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
3. Add new events with appropriate tier values

### Modifying Tier Colors
Edit the `TierBadge.js` component to change the color scheme for different tiers.

### Adding New Tiers
1. Update the tier hierarchy in `page.js`
2. Add new tier configuration in `TierBadge.js`
3. Update the database schema if needed

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env.local` is in the root directory
   - Restart the development server after adding variables

2. **Database Connection Issues**
   - Verify Supabase URL and keys are correct
   - Check if the `events` table exists in your database

3. **Authentication Issues**
   - Verify Clerk keys are correct
   - Check if Clerk application is properly configured

4. **Events Not Loading**
   - Ensure the database setup script has been run
   - Check browser console for any errors

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
