'use client';
import { useUser, useClerk, SignIn, SignUp } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import EventCard from "@/components/EventCard";
import TierBadge from "@/components/TierBadge";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  // Simplified useEffect - no dependencies on functions
  useEffect(() => {
    if (!isLoaded || !user) {
      setLoading(false);
      return;
    }

    // Define function inside useEffect to avoid dependency issues
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userTier = user?.publicMetadata?.tier || 'free';
        console.log("Loading events for tier:", userTier);
        
        const { data, error: fetchError } = await supabase
          .rpc('get_events_by_tier', { user_tier: userTier });
        
        if (fetchError) {
          console.error("Supabase error:", fetchError);
          throw fetchError;
        }
        
        console.log("Events loaded:", data?.length || 0);
        setEvents(data || []);
        setFilteredEvents(data || []); // Initialize filtered events
        
      } catch (err) {
        console.error("Error loading events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [isLoaded, user]); // Only depend on basic values

  // Search functionality
  useEffect(() => {
    let filtered = events;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = events.filter(event => {
        return (
          event.title?.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.category?.toLowerCase().includes(query) ||
          event.tier?.toLowerCase().includes(query)
        );
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'date-earliest':
          return new Date(a.date || 0) - new Date(b.date || 0);
        case 'date-latest':
          return new Date(b.date || 0) - new Date(a.date || 0);
        case 'location-asc':
          return (a.location || '').localeCompare(b.location || '');
        case 'location-desc':
          return (b.location || '').localeCompare(a.location || '');
        case 'tier-asc':
          const tierOrder = { 'free': 1, 'silver': 2, 'gold': 3, 'platinum': 4 };
          return (tierOrder[a.tier] || 0) - (tierOrder[b.tier] || 0);
        case 'tier-desc':
          const tierOrderDesc = { 'free': 1, 'silver': 2, 'gold': 3, 'platinum': 4 };
          return (tierOrderDesc[b.tier] || 0) - (tierOrderDesc[a.tier] || 0);
        case 'category-asc':
          return (a.category || '').localeCompare(b.category || '');
        case 'category-desc':
          return (b.category || '').localeCompare(a.category || '');
        default:
          return 0; // Default order
      }
    });

    setFilteredEvents(sorted);
  }, [searchQuery, events, sortBy]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const getSortLabel = (sortValue) => {
    const sortOptions = {
      'default': 'Default Order',
      'title-asc': 'Title (A-Z)',
      'title-desc': 'Title (Z-A)',
      'date-earliest': 'Date (Earliest First)',
      // 'date-latest': 'Date (Latest First)',
      'location-asc': 'Location (A-Z)',
      'location-desc': 'Location (Z-A)',
      'tier-asc': 'Tier (Free to Platinum)',
      'tier-desc': 'Tier (Platinum to Free)',
      'category-asc': 'Category (A-Z)',
      'category-desc': 'Category (Z-A)'
    };
    return sortOptions[sortValue] || 'Default Order';
  };

  // Simplified upgrade function
  const handleUpgrade = async (newTier) => {
    try {
      console.log("Upgrading to:", newTier);
      
      const response = await fetch("/api/upgrade-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: newTier }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Reload user data
        await user.reload();
        
        // Simple page reload as fallback
        window.location.reload();
      } else {
        console.error("Upgrade failed:", result);
        setError("Failed to upgrade tier");
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      setError("Failed to upgrade tier");
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" color="gray" />
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Tier-Based Event Showcase
          </h1>
          <p className="text-center mb-8 text-gray-600">
            Sign in to view events based on your user tier
          </p>
          
          {!showSignUp ? (
            // Sign In View
            <div className="space-y-4 flex flex-wrap items-center justify-center ">
              <SignIn routing="hash" />
              <div className="text-center">
                <span className="text-gray-500">Don&apos;t have an account? </span>
                <button
                  onClick={() => setShowSignUp(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign up
                </button>
              </div>
            </div>
          ) : (
            // Sign Up View
            <div className="space-y-4">
              <SignUp routing="hash" />
              <div className="text-center">
                <span className="text-gray-500">Already have an account? </span>
                <button
                  onClick={() => setShowSignUp(false)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Event Showcase
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Your Tier:</span>
                <TierBadge tier={user?.publicMetadata?.tier || 'free'} />
              </div>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Sort Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search events by title, description, location, category..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg 
                      className="h-5 w-5 text-gray-400 hover:text-gray-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" 
                    />
                  </svg>
                </div>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="block w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-w-64"
                >
                  <option value="default">Default Order</option>
                  <optgroup label="By Title">
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                  </optgroup>
                  <optgroup label="By Date">
                    <option value="date-earliest">Date (Earliest First)</option>
                    {/* <option value="date-latest">Date (Latest First)</option> */}
                  </optgroup>
                  <optgroup label="By Location">
                    <option value="location-asc">Location (A-Z)</option>
                    <option value="location-desc">Location (Z-A)</option>
                  </optgroup>
                  <optgroup label="By Tier">
                    <option value="tier-asc">Tier (Free to Platinum)</option>
                    <option value="tier-desc">Tier (Platinum to Free)</option>
                  </optgroup>
                  <optgroup label="By Category">
                    <option value="category-asc">Category (A-Z)</option>
                    <option value="category-desc">Category (Z-A)</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Search and Sort Results Info */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm text-gray-600">
              {searchQuery ? (
                filteredEvents.length > 0 
                  ? `Found ${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''} matching "${searchQuery}"`
                  : `No events found matching "${searchQuery}"`
              ) : (
                `Showing ${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''}`
              )}
            </div>
            {sortBy !== 'default' && (
              <div className="text-sm text-gray-500">
                Sorted by: {getSortLabel(sortBy)}
              </div>
            )}
          </div>
        </div>

        {/* Tier Upgrade Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg text-black font-semibold mb-4">Upgrade Your Tier</h2>
          <div className="flex flex-wrap gap-2">
            {['free', 'silver', 'gold', 'platinum'].map((tier) => (
              <button
                key={tier}
                onClick={() => handleUpgrade(tier)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  (user?.publicMetadata?.tier || 'free') === tier
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div>
          <h2 className="text-2xl text-black font-bold mb-6">Available Events</h2>
          
          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" color="blue" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-800">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 underline"
              >
                Reload Page
              </button>
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <p className="text-gray-500 mb-2">No events found for "{searchQuery}"</p>
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear search to see all events
              </button>
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && !searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-500">No events available for your tier.</p>
            </div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}