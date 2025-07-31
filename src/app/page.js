'use client';
import { useUser, useClerk, SignIn, SignUp } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import EventCard from "@/components/EventCard";
import TierBadge from "@/components/TierBadge";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const { user, isLoaded } = useUser();
  const { clerk } = useClerk();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {signOut} = useClerk();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const userTier = user?.publicMetadata?.tier || 'free';
        
        // Define tier hierarchy
        const tierHierarchy = {
          'free': ['free'],
          'silver': ['free', 'silver'],
          'gold': ['free', 'silver', 'gold'],
          'platinum': ['free', 'silver', 'gold', 'platinum']
        };
  
        const allowedTiers = tierHierarchy[userTier] || ['free'];
  
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .in('tier', allowedTiers)
          .order('event_date', { ascending: true });
  
        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    
    if (isLoaded && user) {
      fetchEvents();
    }
  }, [isLoaded, user]);



  const upgradeTier = async (newTier) => {
    try {
      const res = await fetch("/api/upgrade-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: newTier }),
      });
  
      const data = await res.json();
      if (data.success) {
        // Optionally re-fetch user or events
        fetchEvents();
      }
    } catch (err) {
      console.error("Tier upgrade failed", err);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" color="gray" />
      </div>
    );
  }

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
          <div className="space-y-4">
          <SignIn routing="hash" />
            <div className="text-center">
              <span className="text-gray-500">Don't have an account? </span>
              <SignUp routing="hash" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Tier Upgrade Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Upgrade Your Tier</h2>
          <div className="flex flex-wrap gap-2">
            {['free', 'silver', 'gold', 'platinum'].map((tier) => (
              <button
                key={tier}
                onClick={() => upgradeTier(tier)}
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
          <h2 className="text-2xl font-bold mb-6">Available Events</h2>
          
          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" color="blue" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No events available for your tier.</p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
