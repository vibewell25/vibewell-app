"use client";

import dynamic from "next/dynamic";
import { Service } from "@vibewell/types";

// Dynamically import the map component with SSR disabled
const ServiceMapNoSSR = dynamic(
  () => import("@/components/services/service-map").then(mod => ({ default: mod.ServiceMap })),
  { ssr: false }
);

interface BookingMapProps {
  service: Service & { locationId: string };
}

export default function BookingMap({ service }: BookingMapProps) {
  return (
    <ServiceMapNoSSR 
      services={[service]} 
      height="300px"
      zoom={12}
      centerLocation={service.locationId}
    />
  );
} 