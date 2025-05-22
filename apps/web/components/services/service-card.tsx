"use client";

import Link from "next/link";
import { Service, Category } from "@vibewell/types";
import { ServiceImage } from "./service-image";
import { MapPin } from "lucide-react";
import { locations } from "@/lib/mock-data";

interface ServiceCardProps {
  service: Service & { 
    category?: Category;
    locationId?: string;
    rating?: number;
  };
  showActions?: boolean;
}

export function ServiceCard({ service, showActions = false }: ServiceCardProps) {
  // Find location information if available
  const serviceLocation = service.locationId 
    ? locations.find(loc => loc.id === service.locationId) 
    : null;

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video relative">
        <ServiceImage 
          src={service.imageUrl} 
          alt={service.title} 
          aspectRatio="video" 
        />
        {service.category && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {service.category.name}
            </span>
          </div>
        )}
        {!service.isActive && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              Inactive
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{service.title}</h3>
        
        {/* Location information */}
        {serviceLocation && (
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span>
              {serviceLocation.name}, {serviceLocation.country}
            </span>
          </div>
        )}
        
        <div className="mt-2 flex items-center justify-between">
          <div className="font-medium text-primary">${service.price.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">{service.duration} min</div>
        </div>
        
        {/* Rating if available */}
        {service.rating && (
          <div className="mt-1 flex items-center">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill={i < Math.floor(service.rating ?? 0) ? "currentColor" : "none"}
                  stroke="currentColor"
                  className="h-3 w-3"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" 
                  />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-xs text-muted-foreground">{(service.rating ?? 0).toFixed(1)}</span>
          </div>
        )}
        
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/services/${service.id}`}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            View Details
          </Link>
          
          {showActions && (
            <Link
              href={`/provider/services/edit/${service.id}`}
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 