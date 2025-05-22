"use client";

import { useEffect, useRef, useState } from "react";
import { Service, Category } from "@vibewell/types";
import { locations } from "@/lib/mock-data";
import "leaflet/dist/leaflet.css";

// Mock coordinates for locations
const locationCoordinates: Record<string, [number, number]> = {
  // US
  "1": [34.0522, -118.2437], // Los Angeles
  "2": [37.7749, -122.4194], // San Francisco
  "3": [40.7128, -74.0060], // New York
  
  // UK
  "4": [51.5074, -0.1278], // London
  "41": [53.4808, -2.2426], // Manchester
  "42": [52.4862, -1.8904], // Birmingham
  "43": [55.9533, -3.1883], // Edinburgh
  "44": [55.8642, -4.2518], // Glasgow
  "45": [51.4816, -3.1791], // Cardiff
  "46": [54.5973, -5.9301], // Belfast
  
  // Other countries
  "5": [48.8566, 2.3522], // Paris
  "6": [35.6762, 139.6503], // Tokyo
  "7": [-33.8688, 151.2093], // Sydney
  "8": [52.5200, 13.4050], // Berlin
  
  // Canada
  "9": [43.6532, -79.3832], // Toronto
  "91": [49.2827, -123.1207], // Vancouver
  "92": [45.5017, -73.5673], // Montreal
  "93": [51.0447, -114.0719], // Calgary
  "94": [45.4215, -75.6972], // Ottawa
  
  // UAE
  "10": [25.2048, 55.2708], // Dubai
  "101": [24.4539, 54.3773], // Abu Dhabi
  "102": [25.3463, 55.4209], // Sharjah
  
  // Jamaica
  "11": [18.0179, -76.8099], // Kingston
  "111": [18.4762, -77.8938], // Montego Bay
  "112": [18.4000, -77.0333], // Ocho Rios
};

interface ServiceMapProps {
  services: (Service & { 
    category?: Category;
    locationId?: string;
    rating?: number;
  })[];
  providers?: {
    id: string;
    firstName: string;
    lastName: string;
    locationId?: string;
    rating?: number;
    specialties?: string[];
  }[];
  height?: string;
  width?: string;
  zoom?: number;
  centerLocation?: string; // locationId to center the map on
}

export function ServiceMap({ 
  services, 
  providers = [],
  height = "500px", 
  width = "100%",
  zoom = 3,
  centerLocation = "4" // Default to London
}: ServiceMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const iconRef = useRef<any>(null);
  
  useEffect(() => {
    setIsClient(true);
    
    // Import dynamically to avoid SSR issues
    const loadLeaflet = async () => {
      try {
        const L = await import('leaflet');
        
        // Fix the marker icon issue by setting default icon paths
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        
        L.Icon.Default.mergeOptions({
          iconUrl: '/images/marker-icon.png',
          iconRetinaUrl: '/images/marker-icon.png',
          shadowUrl: '/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        // Create a custom icon
        iconRef.current = new L.Icon({
          iconUrl: '/images/marker-icon.png',
          shadowUrl: '/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        setLeafletLoaded(true);
        setLoadError(null);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
        setLoadError('Failed to load map. Please try again later.');
        setLeafletLoaded(false);
      }
    };
    
    loadLeaflet();
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
      setLeafletLoaded(false);
    };
  }, []);
  
  // Filter only services with valid locationId that we have coordinates for
  const validServices = services.filter(
    service => service.locationId && locationCoordinates[service.locationId]
  );
  
  // Filter only providers with valid locationId that we have coordinates for
  const validProviders = providers.filter(
    provider => provider.locationId && locationCoordinates[provider.locationId]
  );
  
  // Find the center coordinates based on centerLocation or default
  const center = centerLocation && locationCoordinates[centerLocation] 
    ? locationCoordinates[centerLocation] 
    : [51.5074, -0.1278] as [number, number]; // Default to London
    
  // Group services by location
  const servicesByLocation = validServices.reduce((acc, service) => {
    if (service.locationId) {
      if (!acc[service.locationId]) {
        acc[service.locationId] = [];
      }
      acc[service.locationId].push(service);
    }
    return acc;
  }, {} as Record<string, typeof validServices>);
  
  // Group providers by location
  const providersByLocation = validProviders.reduce((acc, provider) => {
    if (provider.locationId) {
      if (!acc[provider.locationId]) {
        acc[provider.locationId] = [];
      }
      acc[provider.locationId].push(provider);
    }
    return acc;
  }, {} as Record<string, typeof validProviders>);

  if (loadError) {
    return (
      <div 
        style={{ height, width }} 
        className="bg-muted flex flex-col items-center justify-center text-muted-foreground rounded"
      >
        <div className="text-destructive mb-2">⚠️ {loadError}</div>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Reload
        </button>
      </div>
    );
  }

  if (!isClient || !leafletLoaded) {
    // Return a placeholder when rendering on the server or during hydration
    return (
      <div 
        style={{ height, width }} 
        className="bg-muted flex items-center justify-center text-muted-foreground rounded"
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
          <span>Loading map...</span>
        </div>
      </div>
    );
  }

  // Dynamically import components once we're on the client
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');

  return (
    <div style={{ height, width }} className="rounded-xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Render Service Markers */}
        {Object.entries(servicesByLocation).map(([locationId, locationServices]) => {
          const coords = locationCoordinates[locationId];
          if (!coords) return null;
          
          const locationInfo = locations.find(loc => loc.id === locationId);
          
          return (
            <Marker 
              key={`service-${locationId}`} 
              position={coords}
              icon={iconRef.current}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{locationInfo?.name}, {locationInfo?.country}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {locationServices.length} service{locationServices.length !== 1 ? 's' : ''} available
                  </p>
                  <ul className="text-sm">
                    {locationServices.slice(0, 5).map(service => (
                      <li key={service.id} className="mb-1">
                        <a 
                          href={`/services/${service.id}`}
                          className="text-primary hover:underline"
                        >
                          {service.title} - ${service.price}
                        </a>
                      </li>
                    ))}
                    {locationServices.length > 5 && (
                      <li className="text-xs text-muted-foreground">
                        +{locationServices.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Render Provider Markers */}
        {Object.entries(providersByLocation).map(([locationId, locationProviders]) => {
          const coords = locationCoordinates[locationId];
          if (!coords) return null;
          
          const locationInfo = locations.find(loc => loc.id === locationId);
          
          return (
            <Marker 
              key={`provider-${locationId}`} 
              position={[coords[0] + 0.002, coords[1] + 0.002]} // Slight offset to avoid overlap with service markers
              icon={iconRef.current}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{locationInfo?.name}, {locationInfo?.country}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {locationProviders.length} provider{locationProviders.length !== 1 ? 's' : ''} available
                  </p>
                  <ul className="text-sm">
                    {locationProviders.slice(0, 5).map(provider => (
                      <li key={provider.id} className="mb-1">
                        <a 
                          href={`/providers/${provider.id}`}
                          className="text-primary hover:underline"
                        >
                          {provider.firstName} {provider.lastName}
                          {provider.specialties && provider.specialties.length > 0 && (
                            <span className="text-xs text-muted-foreground ml-1">
                              ({provider.specialties[0]})
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                    {locationProviders.length > 5 && (
                      <li className="text-xs text-muted-foreground">
                        +{locationProviders.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
} 