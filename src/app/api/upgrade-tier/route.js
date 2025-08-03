import { currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/nextjs/server";

// Create the client manually
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function POST(request) {
  try {
    console.log("API: Starting request processing...");
    
    // Get current user
    const user = await currentUser();
    console.log("API: Current user:", user?.id);
    
    if (!user) {
      console.log("API: No user found, returning 401");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { tier } = await request.json();
    console.log("API: Received tier:", tier);

    // Validate tier input
    if (!tier) {
      console.log("API: No tier provided, returning 400");
      return new Response(JSON.stringify({ error: "Tier is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate tier values
    const validTiers = ['free', 'silver', 'gold', 'platinum'];
    if (!validTiers.includes(tier)) {
      console.log("API: Invalid tier provided:", tier);
      return new Response(JSON.stringify({ error: "Invalid tier" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("API: Updating user", user.id, "to tier", tier);
    console.log("API: clerkClient exists:", !!clerkClient);
    console.log("API: clerkClient.users exists:", !!clerkClient?.users);
    
    await clerkClient.users.updateUser(user.id, {
      publicMetadata: { 
        ...user.publicMetadata,
        tier 
      },
    });

    console.log("API: User updated successfully");
    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error('API: Error upgrading tier:', error);
    console.error('API: Error stack:', error.stack);
    return new Response(JSON.stringify({ error: "Internal server error", details: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}