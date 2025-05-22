"use client";

import Link from "next/link";
import { Service, Category } from "@vibewell/types";
import { ServiceImage } from "./service-image";
import { MapPin, Clock, Star, DollarSign } from "lucide-react";
import { locations } from "@/lib/mock-data";

interface ServiceCardProps {
  service: {
    id: string;
    name?: string;
    title?: string;
    description?: string;
    price: number;
    duration?: number;
    durationMinutes?: number;
    category?: string | Category;
    imageUrl?: string;
  };
  showActions?: boolean;
}

export function ServiceCard({ service, showActions = false }: ServiceCardProps) {
  // Handle different service object structures
  const serviceName = service.name || service.title || "";
  const serviceDuration = service.duration || service.durationMinutes || 0;
  
  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-sm transition-all hover:shadow-md">
      <div className="aspect-video bg-muted">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={serviceName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{serviceName}</h3>
          <div className="font-bold text-primary">${service.price.toFixed(2)}</div>
        </div>
        
        {service.description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {service.description}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-muted-foreground">{serviceDuration} minutes</span>
          
          <div className="flex gap-2">
            <Link
              href={`/services/${service.id}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Details
            </Link>
            <Link
              href={`/booking/service/${service.id}`}
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 