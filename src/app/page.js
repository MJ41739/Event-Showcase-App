'use client';
import { useUser, useClerk, SignIn, SignUp } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [debugInfo, setDebugInfo] = useState("Initializing...");

  useEffect(() => {
    if (!isLoaded) {
      setDebugInfo("Loading user...");
      return;
    }
    
    if (!user) {
      setDebugInfo("No user found");
      return;
    }
    
    setDebugInfo(`User loaded: ${user.firstName || 'Unknown'}, Tier: ${user?.publicMetadata?.tier || 'free'}`);
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Debug Version
          </h1>
          <SignIn routing="hash" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
          <p className="mb-4">{debugInfo}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Basic Test</h2>
          <p>If you can see this, the basic page structure works.</p>
          <p>User Tier: {user?.publicMetadata?.tier || 'free'}</p>
        </div>
      </div>
    </div>
  );
}