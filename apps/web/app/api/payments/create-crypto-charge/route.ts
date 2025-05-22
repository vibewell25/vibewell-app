import { NextRequest, NextResponse } from "next/server";
import { createCharge } from "@/lib/coinbase";
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
    const {
      amount,
      bookingId,
      orderId,
      name,
      description,
      redirectUrl,
      cancelUrl,
    } = await req.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }
    
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }
    
    // Prepare metadata for the charge
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
    if (orderId) {
      metadata.orderId = orderId;
    }
    
    // Create the Coinbase Commerce charge
    const charge = await createCharge({
      name,
      description,
      pricingType: "fixed_price",
      localPrice: amount,
      currency: "USD",
      metadata,
      redirectUrl,
      cancelUrl,
    });
    
    // Return the charge details
    return NextResponse.json({
      chargeId: charge.id,
      hostedUrl: charge.hosted_url,
      code: charge.code,
      createdAt: charge.created_at,
      expiresAt: charge.expires_at,
    });
  } catch (error) {
    console.error("Error creating crypto charge:", error);
    return NextResponse.json(
      { error: "Failed to create crypto payment" },
      { status: 500 }
    );
  }
} 