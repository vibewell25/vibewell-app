import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProviderCardProps {
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    title?: string;
    bio?: string;
    specialties?: string[];
    rating?: number;
    reviewCount?: number;
    imageUrl?: string;
    locationName?: string;
    availability?: {
      nextAvailable?: string;
      availableToday?: boolean;
    };
    verified?: boolean;
  };
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/3 relative">
          <div className="aspect-square bg-muted">
            {provider.imageUrl ? (
              <img 
                src={provider.imageUrl} 
                alt={`${provider.firstName} ${provider.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                <span className="text-2xl font-medium">
                  {provider.firstName?.[0]}{provider.lastName?.[0]}
                </span>
              </div>
            )}
          </div>
          {provider.verified && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-primary/90 text-white text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-1">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Verified
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-4 sm:p-5 flex-1">
          <h3 className="text-lg font-semibold">
            {provider.firstName} {provider.lastName}
          </h3>
          
          {provider.title && (
            <p className="text-muted-foreground text-sm mt-1">{provider.title}</p>
          )}
          
          {provider.locationName && (
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1 text-primary/70" />
              <span>{provider.locationName}</span>
            </div>
          )}
          
          {provider.rating !== undefined && (
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="ml-1 text-sm font-medium">{provider.rating.toFixed(1)}</span>
              </div>
              {provider.reviewCount !== undefined && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({provider.reviewCount} reviews)
                </span>
              )}
            </div>
          )}
          
          {provider.specialties && provider.specialties.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {provider.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="outline" className="bg-primary/5">
                  {specialty}
                </Badge>
              ))}
              {provider.specialties.length > 3 && (
                <Badge variant="outline" className="bg-transparent">
                  +{provider.specialties.length - 3} more
                </Badge>
              )}
            </div>
          )}
          
          {provider.bio && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {provider.bio}
            </p>
          )}
          
          <div className="mt-4 flex items-center justify-between">
            {provider.availability?.nextAvailable && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1 text-primary/70" />
                <span>Next available: {provider.availability.nextAvailable}</span>
              </div>
            )}
            
            {provider.availability?.availableToday && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Available today
              </Badge>
            )}
            
            <Link href={`/providers/${provider.id}`} className="ml-auto">
              <button className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                View Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 