import Link from 'next/link';
import { cn } from '@vibewell/utils';
import { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'minimal';
}

export function Logo({ 
  className, 
  size = 'medium', 
  variant = 'default' 
}: LogoProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    small: 'h-6',
    medium: 'h-8',
    large: 'h-10',
  };

  const logoSizes = {
    small: { height: 24, width: 110 },
    medium: { height: 32, width: 140 },
    large: { height: 40, width: 170 },
  };

  return (
    <Link 
      href="/" 
      className={cn('flex items-center font-bold', className)}
    >
      {!imageError ? (
        <div className={cn('relative', sizeClasses[size])}>
          <img
            src="/images/logo/vibewell-logo.svg"
            alt="VibeWell"
            width={logoSizes[size].width}
            height={logoSizes[size].height}
            className="object-contain h-full"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className={cn("flex items-center", sizeClasses[size])}>
          <div className="mr-2 bg-gradient-to-r from-primary to-primary-foreground text-white rounded-full flex items-center justify-center w-8 h-8">
            <span className="text-base">V</span>
          </div>
          <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            VibeWell
          </span>
        </div>
      )}
    </Link>
  );
} 