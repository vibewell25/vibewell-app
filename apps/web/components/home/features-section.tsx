"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m16 12-4 4-4-4" />
          <path d="M12 8v8" />
        </svg>
      ),
      title: "Discover",
      description:
        "Explore a curated selection of beauty and wellness services tailored to your preferences and location.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      ),
      title: "Book",
      description:
        "Schedule appointments with top providers instantly, with real-time availability and seamless payment.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10"
        >
          <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: "Connect",
      description:
        "Build relationships with providers, join the community, and share experiences with like-minded individuals.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10"
        >
          <path d="M2.42 12.28a3 3 0 0 0 0 4.24l5.65 5.66a3 3 0 0 0 4.24 0l9.78-9.79a3 3 0 0 0 0-4.24l-5.65-5.66a3 3 0 0 0-4.24 0l-9.78 9.79Z" />
          <path d="m7 17 10-10" />
        </svg>
      ),
      title: "Experience",
      description:
        "Enjoy personalized treatments designed for your specific needs, tracked and improved over time.",
    },
  ];

  const reasons = [
    "AI-powered recommendations",
    "Expert-vetted providers",
    "Secure and easy booking",
    "Real-time availability",
    "Virtual try-on technology",
    "24/7 customer support",
  ];

  return (
    <section className="w-full py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            How VibeWell Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-[800px]">
            Your journey to wellness made simple. From discovery to booking and beyond,
            we've designed a seamless experience for all your beauty and wellness needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg transition-all hover:bg-muted/50"
            >
              <div className="rounded-full p-2 bg-primary/10 text-primary mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Why Choose VibeWell */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-6">Why Choose VibeWell</h3>
            <p className="text-muted-foreground mb-8">
              VibeWell combines cutting-edge technology with human expertise to deliver
              the ultimate wellness experience. We're committed to helping you look and
              feel your best, with tools and services designed around your unique needs.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-start">
                  <div className="rounded-full p-1 bg-primary/10 text-primary mr-3 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm">{reason}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/register">
                  Get Started
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-1 overflow-hidden">
              <div className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden">
                <img
                  src="/images/app-preview.jpg"
                  alt="VibeWell App Preview"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 