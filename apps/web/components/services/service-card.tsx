"use client";

import Link from "next/link";
import { Service, Category } from "@vibewell/types";

interface ServiceCardProps {
  service: Service & { category?: Category };
  showActions?: boolean;
}

export function ServiceCard({ service, showActions = false }: ServiceCardProps) {
  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="aspect-video relative bg-gray-100">
        {/* Service image would go here */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
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
        <div className="mt-2 flex items-center justify-between">
          <div className="font-medium text-primary">${service.price.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">{service.duration} min</div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/services/${service.id}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            View Details
          </Link>
          
          {showActions && (
            <Link
              href={`/provider/services/edit/${service.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 