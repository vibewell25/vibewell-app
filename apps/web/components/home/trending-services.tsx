"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Star, Award, TrendingUp } from "lucide-react";

type Service = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  trending?: boolean;
  featured?: boolean;
  slug: string;
};

export function TrendingServices() {
  // In a real implementation, these would come from an API
  const trendingServices: Service[] = [
    {
      id: "service1",
      title: "Luxury Spa Package",
      category: "Spa",
      description: "A full day of pampering with massage, facial, and body treatments.",
      image: "/images/services/spa-package.jpg",
      price: 199,
      rating: 4.9,
      reviewCount: 127,
      trending: true,
      featured: true,
      slug: "luxury-spa-package",
    },
    {
      id: "service2",
      title: "Hydrating Facial Treatment",
      category: "Skincare",
      description: "Restore moisture and glow with our premium hydrating facial.",
      image: "/images/services/facial.jpg",
      price: 89,
      rating: 4.8,
      reviewCount: 94,
      trending: true,
      slug: "hydrating-facial",
    },
    {
      id: "service3",
      title: "Hot Stone Massage",
      category: "Massage",
      description: "Therapeutic massage using heated stones to release tension.",
      image: "/images/services/hot-stone.jpg",
      price: 120,
      rating: 4.9,
      reviewCount: 156,
      trending: true,
      slug: "hot-stone-massage",
    },
    {
      id: "service4",
      title: "Hair Color & Style",
      category: "Hair",
      description: "Complete transformation with expert color and styling.",
      image: "/images/services/hair-color.jpg",
      price: 150,
      rating: 4.7,
      reviewCount: 83,
      trending: true,
      slug: "hair-color-style",
    },
    {
      id: "service5",
      title: "Rejuvenating Body Wrap",
      category: "Body",
      description: "Detoxify and moisturize with our signature body wrap treatment.",
      image: "/images/services/body-wrap.jpg",
      price: 110,
      rating: 4.8,
      reviewCount: 68,
      trending: true,
      slug: "rejuvenating-body-wrap",
    },
  ];

  return (
    <section className="w-full py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">Trending Services</h2>
            </div>
            <p className="text-muted-foreground">
              Most popular services that our clients are loving right now
            </p>
          </div>
          <Button variant="outline" size="sm" className="mt-4 md:mt-0" asChild>
            <Link href="/services">
              Explore All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Featured service (larger card) */}
        {trendingServices.filter(service => service.featured).map(service => (
          <div key={service.id} className="mb-10">
            <Link href={`/services/${service.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-full w-full">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs py-1 px-3 rounded-full font-medium flex items-center">
                      <Award className="mr-1 h-3 w-3" />
                      Featured
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {service.category}
                          </p>
                          <h3 className="text-2xl font-bold">{service.title}</h3>
                        </div>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          ${service.price}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {service.description}
                      </p>
                      <div className="flex items-center mb-6">
                        <div className="flex items-center mr-2">
                          <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                          <span className="font-medium">{service.rating}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          ({service.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    <Button className="w-full md:w-auto">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        ))}

        {/* Regular trending services */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingServices.filter(service => !service.featured).map(service => (
            <Link href={`/services/${service.slug}`} key={service.id}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col">
                <div className="relative h-48 w-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  {service.trending && (
                    <div className="absolute top-2 right-2 bg-primary/10 backdrop-blur-sm text-primary text-xs py-1 px-2 rounded-full font-medium flex items-center">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Trending
                    </div>
                  )}
                </div>
                <CardHeader className="p-4 pb-0 flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardDescription className="text-xs">
                        {service.category}
                      </CardDescription>
                      <CardTitle className="text-lg mt-1">{service.title}</CardTitle>
                    </div>
                    <div className="font-semibold text-sm">
                      ${service.price}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-sm text-muted-foreground">
                  <div className="line-clamp-2">
                    {service.description}
                  </div>
                  <div className="flex items-center mt-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-xs font-medium">{service.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({service.reviewCount})
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 mt-auto">
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <span>View Details</span>
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 