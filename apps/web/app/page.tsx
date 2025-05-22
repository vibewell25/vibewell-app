import Link from "next/link";
import { Metadata } from "next";
import { HomeCTASection } from "@/components/home-cta-section";
import { locations } from "@/lib/mock-data";
import { MapPin, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Home | VibeWell",
  description: "Discover, book, and manage beauty and wellness services with VibeWell",
};

export default function HomePage() {
  // Group locations by country
  const countriesWithLocations = locations.reduce((acc, location) => {
    if (!acc[location.country]) {
      acc[location.country] = [];
    }
    acc[location.country].push(location);
    return acc;
  }, {} as Record<string, typeof locations>);

  // Get list of countries with count
  const countries = Object.entries(countriesWithLocations)
    .map(([country, locs]) => ({
      name: country,
      count: locs.length,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="w-full pt-12 md:pt-24 lg:pt-32 xl:pt-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Discover Beauty & Wellness Services Near You
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Find, book, and enjoy the best beauty and wellness services in your area. 
                    Connect with providers and other users through a modern social experience.
                  </p>
                </div>
                <HomeCTASection />
              </div>
              <div className="flex items-center justify-center">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-b from-primary/20 to-primary/5 md:aspect-square">
                  {/* Placeholder for hero image */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/20 opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center text-primary">
                    <span className="text-xl font-medium">Hero Image</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Locations Section */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Global Reach, Local Service
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                  VibeWell connects you with beauty and wellness services in locations around the world
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {countries.map((country) => (
                <Link 
                  key={country.name}
                  href={`/services?country=${encodeURIComponent(country.name)}`}
                  className="flex flex-col items-center p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
                >
                  <Globe className="h-8 w-8 mb-2 text-primary" />
                  <span className="font-medium text-center">{country.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {country.count} location{country.count !== 1 ? 's' : ''}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Map Preview Section */}
        <section className="w-full py-12 md:py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold tracking-tighter mb-4">
                  Find Services on the Map
                </h2>
                <p className="text-gray-500 mb-6">
                  Discover beauty and wellness services near you with our interactive map. 
                  Easily find providers in your area or plan services for your next trip.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {Object.entries(countriesWithLocations)
                    .slice(0, 4)
                    .map(([country, countryLocations]) => (
                      <div key={country} className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-primary" />
                        <span className="text-sm">{country}</span>
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({countryLocations.length})
                        </span>
                      </div>
                    ))}
                </div>
                <Link 
                  href="/services?view=map" 
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90"
                >
                  Explore Map
                </Link>
              </div>
              <div className="md:w-1/2 rounded-lg overflow-hidden border">
                <div className="aspect-video bg-card flex items-center justify-center">
                  <span className="text-muted-foreground">Interactive Map Preview</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  How VibeWell Works
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                  Our platform makes it easy to discover, book, and enjoy beauty and wellness services.
                </p>
              </div>
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12">
                {/* Feature 1 */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m16 12-4 4-4-4" />
                      <path d="M12 8v8" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Discover</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Explore a wide range of beauty and wellness services near you.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M8 12h8" />
                      <path d="M12 8v8" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Book</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Book appointments with your favorite providers in just a few clicks.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                      <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Connect</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Join a community of like-minded individuals and service providers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} VibeWell. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-sm font-medium hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm font-medium hover:underline">
              Privacy
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              About
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
} 