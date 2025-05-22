'use client';

import Image from 'next/image';
import { cn } from '@vibewell/utils';

interface ServiceImageProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
  fill?: boolean;
  width?: number;
  height?: number;
}

export function ServiceImage({
  src,
  alt,
  className,
  aspectRatio = 'square',
  fill = true,
  width,
  height,
}: ServiceImageProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
  };

  // Define placeholder gradient based on the alt text for deterministic colors
  const hash = alt.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const hue1 = hash % 360;
  const hue2 = (hash * 3) % 360;

  return (
    <div className={cn('relative overflow-hidden rounded-md bg-muted', aspectRatioClasses[aspectRatio], className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className="object-cover transition-all hover:scale-105"
        />
      ) : (
        // Placeholder with a gradient and service name in the center
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `linear-gradient(45deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 60%))`,
          }}
        >
          <span className="text-white font-medium text-center px-4 text-sm md:text-base">
            {alt}
          </span>
        </div>
      )}
    </div>
  );
} 