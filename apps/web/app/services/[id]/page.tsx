import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceWithDetails, providers } from "@/lib/mock-data";
import { ServiceImage } from "@/components/services/service-image";

type Props = {
  params: { id: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const service = getServiceWithDetails(params.id);
  
  if (!service) {
    return {
      title: "Service Not Found | VibeWell",
      description: "The requested service could not be found",
    };
  }
  
  return {
    title: `${service.title} | VibeWell`,
    description: service.description,
  };
}

export default function ServiceDetailPage({ params }: Props) {
  const service = getServiceWithDetails(params.id);
  
  if (!service) {
    return notFound();
  }
  
  const provider = service.provider || providers.find(p => p.id === service.providerId);
  
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link 
          href="/services" 
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Services
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <ServiceImage 
            src={service.imageUrl} 
            alt={service.title} 
            aspectRatio="video" 
            className="rounded-lg overflow-hidden" 
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold">{service.title}</h1>
          
          {service.category && (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {service.category.name}
              </span>
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">${service.price.toFixed(2)}</div>
            <div className="text-muted-foreground">{service.duration} minutes</div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">About this service</h2>
            <p className="text-muted-foreground">{service.description}</p>
          </div>
          
          {provider && (
            <div className="mt-8 pt-6 border-t">
              <h2 className="text-lg font-semibold mb-4">Service Provider</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10">
                  {provider.avatarUrl ? (
                    <img
                      src={provider.avatarUrl}
                      alt={provider.displayName || `${provider.firstName} ${provider.lastName}`}
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
                  <h3 className="font-medium">
                    {provider.displayName || `${provider.firstName} ${provider.lastName}`}
                  </h3>
                  <Link
                    href={`/providers/${provider.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <Link
              href={`/services/${service.id}/booking`}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">What to Expect</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Booking</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Select your preferred date and time to book this service.
            </p>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Location</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Service will be provided at the provider's location.
            </p>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v4" />
                <path d="M2 12h20" />
                <path d="M2 15h20" />
                <path d="M2 18h20" />
                <path d="M2 21h20" />
                <path d="M6 9v12" />
                <path d="M12 9v12" />
                <path d="M18 9v12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Payment</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Secure payment will be processed after booking confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 