import { NextRequest, NextResponse } from "next/server";

// Webhook endpoint for Farcaster notifications
// This is a placeholder endpoint that accepts POST requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the webhook event (optional, for debugging)
    console.log("Webhook received:", body);
    
    // Return success response
    return NextResponse.json(
      { success: true, message: "Webhook received" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}

// Handle GET requests (for health checks)
export async function GET() {
  return NextResponse.json(
    { status: "ok", message: "Webhook endpoint is active" },
    { status: 200 }
  );
}
