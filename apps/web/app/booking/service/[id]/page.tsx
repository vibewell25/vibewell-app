import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/bookings/booking-form";
import { services, providers } from "@/lib/mock-data";

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
    title: `Book ${service.name} | VibeWell`,
    description: `Book your appointment for ${service.name} with VibeWell`,
  };
}

// Add a helper function to safely get category name
function getCategoryName(category: any): string {
  if (!category) return '';
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && 'name' in category) return category.name;
  return '';
}

export default async function BookServicePage({ params }: Props) {
  const { id } = await params;
  const service = services.find(s => s.id === id);
  
  if (!service) {
    return notFound();
  }
  
  // Find the provider for this service
  const provider = providers.find(p => p.id === service.providerId);
  
  if (!provider) {
    return notFound();
  }
  
  return (
    <div className="container py-10">
      <div className="mb-10">
        <Link 
          href={`/services/${service.id}`}
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Service Details
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">
          Book {service.name}
        </h1>
        <p className="text-muted-foreground">
          Complete your booking by selecting an available time slot
        </p>
      </div>
      
      <div className="grid md:grid-cols-[2fr_1fr] gap-8">
        <div>
          <BookingForm service={service} provider={provider} />
        </div>
        
        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
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
                  Beauty and wellness professional
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
              View Provider Profile
            </Link>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm mt-6">
            <h2 className="text-lg font-semibold mb-4">Service Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-sm mt-1">{service.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                <p className="text-sm mt-1">{service.duration} minutes</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                <p className="text-sm mt-1">${service.price.toFixed(2)}</p>
              </div>
              
              {service.category && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                  <p className="text-sm mt-1">{getCategoryName(service.category)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 