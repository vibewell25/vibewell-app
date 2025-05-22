import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { providers, services } from "@/lib/mock-data";
import { ProviderTimeSlots } from "@/components/bookings/provider-time-slots";

type ParamsType = Promise<{ id: string }>;

type Props = {
  params: ParamsType;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const provider = providers.find(p => p.id === id);
  
  if (!provider) {
    return {
      title: "Provider Not Found | VibeWell",
      description: "The requested provider could not be found",
    };
  }
  
  return {
    title: `Book with ${provider.firstName} ${provider.lastName} | VibeWell`,
    description: `View available time slots and book an appointment with ${provider.firstName} ${provider.lastName}`,
  };
}

export default async function BookWithProviderPage({ params }: Props) {
  const { id } = await params;
  const provider = providers.find(p => p.id === id);
  
  if (!provider) {
    return notFound();
  }
  
  // Get all services for this provider
  const providerServices = services.filter(service => service.providerId === provider.id);
  
  if (providerServices.length === 0) {
    return (
      <div className="container py-10">
        <div className="mb-10">
          <Link 
            href={`/providers/${provider.id}`}
            className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Provider Profile
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">
            Book with {provider.firstName} {provider.lastName}
          </h1>
        </div>
        
        <div className="rounded-lg border bg-card p-8 shadow-sm text-center">
          <h2 className="text-xl font-semibold mb-4">No Services Available</h2>
          <p className="text-muted-foreground mb-6">
            This provider does not have any services available for booking at this time.
          </p>
          <Link
            href="/providers"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Browse Other Providers
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <div className="mb-10">
        <Link 
          href={`/providers/${provider.id}`}
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Provider Profile
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">
          Book with {provider.firstName} {provider.lastName}
        </h1>
        <p className="text-muted-foreground">
          Select a service and available time slot to book your appointment
        </p>
      </div>
      
      <div className="grid md:grid-cols-[2fr_1fr] gap-8">
        <div>
          <ProviderTimeSlots provider={provider} services={providerServices} />
        </div>
        
        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-semibold mb-4">About {provider.firstName}</h2>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
                {provider.avatarUrl ? (
                  <img
                    src={provider.avatarUrl}
                    alt={`${provider.firstName} ${provider.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium">{provider.firstName} {provider.lastName}</h3>
                <p className="text-sm text-muted-foreground">
                  {provider.specialties?.join(", ") || "Beauty and wellness professional"}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {provider.bio ? (
                provider.bio.length > 150 ? `${provider.bio.substring(0, 150)}...` : provider.bio
              ) : (
                "Professional beauty and wellness service provider with expertise in multiple treatments."
              )}
            </p>
            
            <div className="space-y-4">
              {provider.phone && (
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm">{provider.phone}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{provider.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 