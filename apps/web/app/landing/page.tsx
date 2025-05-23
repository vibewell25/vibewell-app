import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "VibeWell - Your Complete Beauty & Wellness Platform",
  description: "Discover, book, and enjoy the best beauty and wellness services with VibeWell.",
};

export default function LandingPage() {
  const testimonials = [
    {
      quote: "VibeWell has completely transformed how I discover and book beauty services. The AI recommendations are spot on!",
      author: "Sarah Johnson",
      role: "Customer",
      avatar: "/images/testimonials/sarah.jpg",
      rating: 5,
    },
    {
      quote: "As a service provider, VibeWell has helped me grow my client base and manage my business more efficiently.",
      author: "Michael Chen",
      role: "Salon Owner",
      avatar: "/images/testimonials/michael.jpg",
      rating: 5,
    },
    {
      quote: "The virtual try-on feature is amazing! I was able to find the perfect look before my appointment.",
      author: "Emma Wilson",
      role: "Customer",
      avatar: "/images/testimonials/emma.jpg",
      rating: 4,
    },
  ];

  const features = [
    {
      title: "AI-Powered Recommendations",
      description: "Get personalized service and product recommendations based on your preferences and history.",
    },
    {
      title: "Virtual Beauty Try-On",
      description: "Experiment with different looks using our advanced AR technology before booking.",
    },
    {
      title: "Seamless Booking",
      description: "Book appointments with top providers instantly, with real-time availability.",
    },
    {
      title: "Wellness Community",
      description: "Connect with like-minded individuals and share your experiences.",
    },
    {
      title: "Exclusive Offers",
      description: "Access special promotions and packages only available on VibeWell.",
    },
    {
      title: "Secure Payments",
      description: "Enjoy a worry-free experience with our secure payment system.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="container px-4 py-24 md:py-32 md:px-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              The all-in-one wellness platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Look and Feel Your <span className="text-primary">Best Self</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[600px]">
              Discover, book, and enjoy beauty and wellness services tailored to your needs. 
              Connected with vetted providers and transform your well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="px-8" asChild>
                <Link href="/register">
                  Create Free Account
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8" asChild>
                <Link href="/services">
                  Explore Services
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                <div className="h-10 w-10 rounded-full border-2 border-background overflow-hidden">
                  <img src="/images/testimonials/avatar-1.jpg" alt="User" className="h-full w-full object-cover" />
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-background overflow-hidden">
                  <img src="/images/testimonials/avatar-2.jpg" alt="User" className="h-full w-full object-cover" />
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-background overflow-hidden">
                  <img src="/images/testimonials/avatar-3.jpg" alt="User" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium">From 2,500+ reviews</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative h-[500px] w-full max-w-[600px] rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="/images/hero/landing-hero.jpg" 
              alt="VibeWell Experience" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Trusted by section */}
      <section className="w-full py-16 border-y bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-muted-foreground">Trusted by thousands of users and providers</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70">
            <img src="/images/brands/brand-1.svg" alt="Brand 1" className="h-8 md:h-10" />
            <img src="/images/brands/brand-2.svg" alt="Brand 2" className="h-8 md:h-10" />
            <img src="/images/brands/brand-3.svg" alt="Brand 3" className="h-8 md:h-10" />
            <img src="/images/brands/brand-4.svg" alt="Brand 4" className="h-8 md:h-10" />
            <img src="/images/brands/brand-5.svg" alt="Brand 5" className="h-8 md:h-10" />
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="w-full py-24 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need in One Platform</h2>
            <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
              VibeWell combines cutting-edge technology with human expertise to deliver
              the ultimate wellness experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-6 rounded-lg border bg-background hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="rounded-full p-2 bg-primary/10 text-primary mr-4">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button size="lg" className="px-8" asChild>
              <Link href="/register">
                Get Started for Free
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="w-full py-24 md:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
              Join thousands of satisfied users who have transformed their wellness journey with VibeWell.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-background p-8 rounded-xl shadow-sm border flex flex-col">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star 
                      key={j} 
                      className={`h-5 w-5 ${j < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                    />
                  ))}
                </div>
                <p className="text-lg mb-8 flex-grow">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.avatar || '/images/testimonials/avatar-placeholder.jpg'} 
                      alt={testimonial.author} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="rounded-2xl bg-gradient-to-r from-primary/90 to-primary p-8 md:p-16 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your Wellness Journey?
                </h2>
                <p className="text-white/90 mb-8 text-lg">
                  Join VibeWell today and discover a new way to experience beauty and wellness services.
                  Your journey to feeling and looking your best starts here.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" variant="secondary" className="px-8" asChild>
                    <Link href="/register">
                      Sign Up Now
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white px-8" asChild>
                    <Link href="/about">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:flex justify-end">
                <img 
                  src="/images/cta-illustration.png" 
                  alt="VibeWell Experience" 
                  className="max-w-[400px] h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 