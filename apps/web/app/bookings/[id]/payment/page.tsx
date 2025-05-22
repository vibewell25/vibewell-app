import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { PaymentForm } from "@/components/services/payment-form";
import { BookingStatus } from "@vibewell/types";

export const metadata: Metadata = {
  title: "Payment | VibeWell",
  description: "Complete your booking payment",
};

export default async function BookingPaymentPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }
  
  // Get the booking details
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      service:services(title, price),
      customer:profiles!bookings_customerId_fkey(id, userId)
    `)
    .eq("id", params.id)
    .single();
  
  if (!booking) {
    redirect("/bookings");
  }
  
  // Check if the booking belongs to the current user
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("userId", user.id)
    .single();
  
  if (!profile || booking.customer.id !== profile.id) {
    redirect("/bookings");
  }
  
  // Check if the booking is not already paid or completed
  if (booking.status !== BookingStatus.PENDING) {
    redirect(`/bookings/${params.id}`);
  }
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{booking.service.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(booking.startTime).toLocaleDateString()} at{" "}
                  {new Date(booking.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Service Price</span>
                  <span className="font-medium">${booking.service.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-sm text-muted-foreground">
              If you have any questions about your booking or payment, please contact our support team.
            </p>
            <div className="mt-4">
              <a
                href="mailto:support@vibewell.com"
                className="text-sm text-primary hover:underline"
              >
                support@vibewell.com
              </a>
            </div>
          </div>
        </div>
        
        <div>
          <PaymentForm
            bookingId={booking.id}
            amount={booking.service.price}
            serviceName={booking.service.title}
          />
        </div>
      </div>
    </div>
  );
} 