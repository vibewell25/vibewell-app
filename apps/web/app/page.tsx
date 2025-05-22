import Link from "next/link";
import { Metadata } from "next";
import { HomeCTASection } from "@/components/home-cta-section";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Home | VibeWell",
  description: "Discover, book, and manage beauty and wellness services with VibeWell",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your Wellness Journey Starts Here
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Discover the best beauty and wellness services, personalized for your needs. Book, shop, and connect with top professionals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/services"
                    className={buttonVariants({ size: "lg" })}
                  >
                    Discover Services
                  </Link>
                  <Link
                    href="/providers"
                    className={buttonVariants({ variant: "outline", size: "lg" })}
                  >
                    Find Providers
                  </Link>
                </div>
              </div>
              <img
                src="/images/hero-image.jpg"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* AI Try-On Feature Highlight */}
        <section className="w-full py-12 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter">
                    Virtual Beauty Try-On
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-lg">
                    Experience our AI-powered virtual try-on technology. See how makeup, hair colors, and skincare products will look on you before you buy.
                  </p>
                </div>
                <div>
                  <Link
                    href="/virtual-tryon"
                    className={buttonVariants({ size: "lg" })}
                  >
                    Try It Now
                  </Link>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1596446593710-2c9c72e1155a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
                  alt="AI Try-On Feature"
                  className="aspect-video w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">
                  How VibeWell Works
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-lg">
                  Our platform makes it easy to discover, book, and enjoy beauty and wellness services.
                </p>
              </div>
              <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 pt-8">
                {/* Feature 1 */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m16 12-4 4-4-4" />
                      <path d="M12 8v8" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Discover</h3>
                  <p className="text-center text-muted-foreground">
                    Explore a wide range of beauty and wellness services near you.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M8 12h8" />
                      <path d="M12 8v8" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Book</h3>
                  <p className="text-center text-muted-foreground">
                    Book appointments with your favorite providers in just a few clicks.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                      <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Connect</h3>
                  <p className="text-center text-muted-foreground">
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