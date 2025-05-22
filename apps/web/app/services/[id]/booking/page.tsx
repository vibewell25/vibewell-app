import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/app/services/[id]/booking-form";
import { getServiceWithDetails } from "@/lib/mock-data";
import { createServerClient } from "@/lib/supabase/server";

// Use consistent ParamsType across pages
type ParamsType = Promise<{ id: string }>;

type Props = {
  params: ParamsType;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = getServiceWithDetails(id);
  
  if (!service) {
    return {
      title: "Booking Not Found | VibeWell",
      description: "The requested service could not be found",
    };
  }
  
  return {
    title: `Book ${service.title} | VibeWell`,
    description: `Book an appointment for ${service.title}`,
  };
}

export default async function BookingPage({ params }: Props) {
  const { id } = await params;
  const service = getServiceWithDetails(id);
  
  if (!service) {
    return notFound();
  }

  // Get current user (if logged in)
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  
  // Get user profile if logged in
  let userProfile = null;
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, firstName, lastName, displayName, email")
      .eq("userId", userId)
      .single();
      
    if (profile) {
      userProfile = {
        ...profile,
        displayName: profile.displayName || undefined
      };
    }
  }
  
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link 
          href={`/services/${service.id}`} 
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Service
        </Link>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
        <p className="text-muted-foreground mb-8">
          Select your preferred date and time to book this service
        </p>
        
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <BookingForm 
              service={service} 
              userId={userId} 
              userProfile={userProfile || undefined}
            />
          </div>
          
          <div className="md:col-span-2">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Service Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Service</span>
                  <span className="text-sm font-medium">{service.title}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-medium">{service.duration} minutes</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-sm font-medium">${service.price.toFixed(2)}</span>
                </div>
                
                {service.category && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm font-medium">{service.category.name}</span>
                  </div>
                )}
                
                {service.provider && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Provider</span>
                    <span className="text-sm font-medium">
                      {service.provider.displayName || `${service.provider.firstName} ${service.provider.lastName}`}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="border-t mt-4 pt-4">
                <h3 className="text-sm font-medium mb-2">Booking Policy</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 24-hour cancellation policy</li>
                  <li>• Please arrive 10 minutes before your appointment</li>
                  <li>• Payment is required at the time of service</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 