import { NextResponse } from "next/server";
import { sendBookingReminders } from "@/lib/schedulers/booking-reminders";

// Set up environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SCHEDULER_API_KEY = process.env.SCHEDULER_API_KEY;

// Default to 24 hours for the reminder window
const REMINDER_HOURS = 24;

export async function POST(request: Request) {
  try {
    // Validate authorization
    const authorization = request.headers.get("authorization");
    
    if (!SCHEDULER_API_KEY || !authorization || authorization !== `Bearer ${SCHEDULER_API_KEY}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Validate required environment variables
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: "Missing required environment variables" },
        { status: 500 }
      );
    }
    
    // Process the booking reminders
    const result = await sendBookingReminders({
      supabaseUrl: SUPABASE_URL,
      supabaseServiceKey: SUPABASE_SERVICE_KEY,
      reminderHours: REMINDER_HOURS,
    });
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Error processing booking reminders:", error);
    
    return NextResponse.json(
      { error: "Failed to process booking reminders" },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
} 