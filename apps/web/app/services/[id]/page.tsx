import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, providers } from "@/lib/mock-data";

// Use consistent ParamsType across pages
type ParamsType = Promise<{ id: string }>;

type Props = {
  params: ParamsType;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = services.find(s => s.id === id);
  
  if (!service) {
    return {
      title: "Service Not Found | VibeWell",
      description: "The requested service could not be found",
    };
  }
  
  return {
    title: `${service.name} | VibeWell`,
    description: service.description || "Beauty and wellness service on VibeWell",
  };
}

// Add a helper function to safely get category name
function getCategoryName(category: any): string {
  if (!category) return '';
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && 'name' in category) return category.name;
  return '';
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const service = services.find(s => s.id === id);
  
  if (!service) {
    return notFound();
  }
  
  // Find the provider for this service
  const provider = providers.find(p => p.id === service.providerId);
  
  return (
    <div className="container py-10">
      <div className="mb-10">
        <Link 
          href="/services" 
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Services
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">
          {service.name}
        </h1>
        
        {provider && (
          <p className="text-muted-foreground">
            Provided by{" "}
            <Link 
              href={`/providers/${provider.id}`}
              className="text-primary hover:underline"
            >
              {provider.firstName} {provider.lastName}
            </Link>
          </p>
        )}
      </div>
      
      <div className="grid md:grid-cols-[2fr_1fr] gap-8">
        <div>
          <div className="rounded-lg border overflow-hidden mb-8">
            <div className="aspect-video bg-muted flex items-center justify-center">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground">No image available</div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground">
                {service.description || "No description available for this service."}
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-24">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Price</h3>
                <span className="text-xl font-bold">${service.price.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Duration</h3>
                <span>{service.duration} minutes</span>
              </div>
              
              {service.category && (
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Category</h3>
                  <span>{getCategoryName(service.category)}</span>
                </div>
              )}
            </div>
            
            <Link
              href={`/booking/service/${service.id}`}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Book Now
            </Link>
            
            {provider && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">About the Provider</h3>
                
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
                    <h4 className="font-medium">{provider.firstName} {provider.lastName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {(provider as any).specialties?.join(", ") || "Beauty and wellness professional"}
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
                
                <Link
                  href={`/providers/${provider.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View Full Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 