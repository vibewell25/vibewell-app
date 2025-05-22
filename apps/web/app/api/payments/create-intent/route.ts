import { NextRequest, NextResponse } from "next/server";
import { createPaymentIntent } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    // Get the current user profile
    const profile = await getCurrentProfile();
    
    if (!profile) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const { amount, bookingId, orderId } = await req.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }
    
    // Prepare metadata for the payment intent
    const metadata: Record<string, string> = {
      profileId: profile.id,
    };
    
    // If we have a booking ID, validate it and add to metadata
    if (bookingId) {
      const supabase = await createServerClient();
      const { data: booking, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .single();
      
      if (error || !booking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }
      
      // Ensure the booking belongs to the current user (customer)
      if (booking.customerId !== profile.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }
      
      metadata.bookingId = bookingId;
    }
    
    // If we have an order ID, add it to metadata
    // Note: Since "orders" table might not exist in the schema yet,
    // we'll skip validation for now and just add it to metadata
    if (orderId) {
      metadata.orderId = orderId;
    }
    
    // Create the payment intent
    const { clientSecret, id } = await createPaymentIntent(
      amount,
      "usd",
      metadata
    );
    
    return NextResponse.json({
      clientSecret,
      paymentIntentId: id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
} 