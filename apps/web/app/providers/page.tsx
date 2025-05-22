import { Metadata } from "next";
import Link from "next/link";
import { providers, getProvidersWithServices } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Providers | VibeWell",
  description: "Browse beauty and wellness service providers",
};

export default function ProvidersPage() {
  const providersWithServices = getProvidersWithServices();

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Service Providers</h1>
        <p className="text-muted-foreground">
          Browse our verified beauty and wellness professionals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providersWithServices.map((provider) => (
          <div key={provider.id} className="rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-primary/10 relative">
              {provider.avatarUrl ? (
                <img
                  src={provider.avatarUrl}
                  alt={provider.displayName || `${provider.firstName} ${provider.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="p-5">
              <h3 className="text-xl font-semibold">
                {provider.displayName || `${provider.firstName} ${provider.lastName}`}
              </h3>
              
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {provider.bio || "Beauty and wellness professional"}
              </p>
              
              <div className="mt-4 flex flex-col gap-2">
                <div className="text-sm">
                  <span className="font-medium">Services:</span> {provider.services?.length || 0}
                </div>
                {provider.city && provider.state && (
                  <div className="text-sm">
                    <span className="font-medium">Location:</span> {provider.city}, {provider.state}
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Link
                  href={`/providers/${provider.id}`}
                  className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 