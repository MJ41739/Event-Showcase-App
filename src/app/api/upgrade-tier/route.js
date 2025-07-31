import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = auth();
  const { tier } = await request.json();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
  }

  await clerkClient.users.updateUser(userId, {
    publicMetadata: { tier },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
    
  } catch (error) {
    console.error('Error upgrading tier:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
} 