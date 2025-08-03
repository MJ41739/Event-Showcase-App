'use client';
import { useUser, useClerk, SignIn, SignUp } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from "react";
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
  const [refreshKey, setRefreshKey] = useState(0);
  const { signOut } = useClerk();
  const [showSignUp, setShowSignUp] = useState(false);


  // Wrap functions in useCallback to prevent recreation on every render
  const fetchEvents = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userTier = user?.publicMetadata?.tier || 'free';
      
      console.log("Current user tier:", userTier);
      
      // Use the custom RPC function
      const { data, error } = await supabase
        .rpc('get_events_by_tier', { user_tier: userTier });
  
      console.log("RPC Query result:", { data, error });
      console.log("Events found:", data?.length);
  
      if (error) {
        console.error("Supabase RPC error:", error);
        throw error;
      }
      
      setEvents(data || []);
    } catch (err) {
      console.error("fetchEvents error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchEventsDebug = useCallback(async () => {
    if (!user) return;
    
    try {
      const userTier = user?.publicMetadata?.tier || 'free';
      console.log("Testing with user tier:", userTier);
      
      // Test 1: Get count of each tier
      const { data: tierCounts } = await supabase
        .from('events')
        .select('tier')
        .then(result => {
          const counts = {};
          result.data?.forEach(event => {
            counts[event.tier] = (counts[event.tier] || 0) + 1;
          });
          return { data: counts };
        });
      
      console.log("Events count by tier:", tierCounts);
      
      // Test 2: Try fetching silver events specifically
      const { data: silverEvents, error: silverError } = await supabase
        .from('events')
        .select('*')
        .eq('tier', 'silver');
      
      console.log("Silver events:", silverEvents);
      console.log("Silver events error:", silverError);
      
      // Test 3: Try fetching with different tier arrays
      const testTiers = ['free', 'silver'];
      const { data: testEvents, error: testError } = await supabase
        .from('events')
        .select('*')
        .in('tier', testTiers);
      
      console.log("Test events with ['free', 'silver']:", testEvents);
      console.log("Test events error:", testError);
      
      // Test 4: Raw SQL approach (if needed)
      const { data: rawEvents, error: rawError } = await supabase
        .rpc('get_events_for_tier', { user_tier: userTier });
      
      console.log("Raw RPC result:", rawEvents, rawError);
      
    } catch (err) {
      console.error("Debug test error:", err);
    }
  }, [user]);

  const upgradeTier = useCallback(async (newTier) => {
    try {
      console.log("Starting tier upgrade...");
      console.log("Current tier:", user?.publicMetadata?.tier);
      console.log("New tier:", newTier);
      
      const res = await fetch("/api/upgrade-tier", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tier: newTier }),
      });

      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok && data.success) {
        console.log("Tier upgrade successful!");
        
        // Method 1: Reload user data from Clerk
        await user.reload();
        
        // Method 2: Force component refresh
        setRefreshKey(prev => prev + 1);
        
        // Method 3: Wait a bit and then fetch events
        setTimeout(() => {
          fetchEvents();
        }, 1000);
        
      } else {
        console.error("Tier upgrade failed:", data);
      }
    } catch (err) {
      console.error("Tier upgrade failed with error:", err);
    }
  }, [user, fetchEvents]);

  // First useEffect - only runs when user is loaded and available
  useEffect(() => {
    if (isLoaded && user) {
      fetchEvents();
      fetchEventsDebug();
    }
  }, [isLoaded, user, fetchEvents, fetchEventsDebug]);

  // Second useEffect - handles refresh key changes
  useEffect(() => {
    if (isLoaded && user) {
      fetchEvents();
    }
  }, [refreshKey, fetchEvents, isLoaded, user]);

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
          
          {!showSignUp ? (
            // Sign In View
            <div className="space-y-4">
              <SignIn routing="hash" />
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