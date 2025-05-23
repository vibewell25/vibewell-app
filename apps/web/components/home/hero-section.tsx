"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";

export function HeroSection() {
  // Use high-quality, modern imagery
  const heroBackgrounds = [
    "/images/hero/hero-1.jpg",
    "/images/hero/hero-2.jpg",
    "/images/hero/hero-3.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Create a slideshow effect for the hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroBackgrounds.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Hero background with gradient overlay */}
      <div className="absolute inset-0 w-full h-[650px] md:h-[750px] overflow-hidden">
        {/* Image background with smooth transition */}
        {heroBackgrounds.map((bg, index) => (
          <div
            key={bg}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              zIndex: index === currentIndex ? 1 : 0,
            }}
          >
            <Image
              src={bg}
              alt="VibeWell Wellness Experience"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
      </div>

      {/* Hero content */}
      <div className="container relative z-20 pt-28 pb-28 md:pt-40 md:pb-28 md:min-h-[700px] flex flex-col justify-center">
        <div className="max-w-[650px]">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6">
            Your Wellness Journey{" "}
            <span className="text-primary">Starts Here</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-[600px]">
            Discover personalized beauty and wellness services tailored to your unique needs.
            Connect with expert professionals and transform your well-being.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/services"
              className={buttonVariants({
                size: "lg",
                className: "text-base px-8 py-6",
              })}
            >
              Explore Services
            </Link>
            <Link
              href="/providers"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "text-base px-8 py-6 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white border-white/30",
              })}
            >
              Find Providers
            </Link>
          </div>
        </div>

        {/* Hero indicators */}
        <div className="hidden md:flex gap-2 absolute bottom-8 left-1/2 transform -translate-x-1/2">
          {heroBackgrounds.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-10"
                  : "bg-white/50"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 