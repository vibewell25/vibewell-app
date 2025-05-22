import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceCard } from "@/components/services/service-card";
import { providers, services } from "@/lib/mock-data";

// Use consistent ParamsType across pages
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
    title: `${provider.displayName || `${provider.firstName} ${provider.lastName}`} | VibeWell`,
    description: provider.bio || "Beauty and wellness service provider on VibeWell",
  };
}

export default async function ProviderDetailPage({ params }: Props) {
  const { id } = await params;
  const provider = providers.find(p => p.id === id);
  
  if (!provider) {
    return notFound();
  }
  
  // Get all services for this provider
  const providerServices = services.filter(service => service.providerId === provider.id);
  
  return (
    <div className="container py-10">
      <div className="mb-10">
        <Link 
          href="/providers" 
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Providers
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
            {provider.avatarUrl ? (
              <img
                src={provider.avatarUrl}
                alt={provider.displayName || `${provider.firstName} ${provider.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold">
              {provider.displayName || `${provider.firstName} ${provider.lastName}`}
            </h1>
            <p className="text-muted-foreground mt-1">
              {provider.city && provider.state ? `${provider.city}, ${provider.state}` : "Beauty and wellness professional"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">
              {provider.bio || "No bio available for this provider."}
            </p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Services</h2>
              <Link
                href={`/booking/provider/${provider.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                View Available Time Slots
              </Link>
            </div>
            {providerServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {providerServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No services available from this provider.
              </p>
            )}
          </div>
        </div>
        
        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              {provider.phone && (
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{provider.phone}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{provider.email}</p>
                </div>
              </div>
              
              {provider.address && provider.city && provider.state && provider.zipCode && (
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p>{provider.address}</p>
                    <p>{provider.city}, {provider.state} {provider.zipCode}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <Link
                href={`/booking/provider/${provider.id}`}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Book an Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 