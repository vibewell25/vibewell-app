import Link from 'next/link';
import { cn } from '@vibewell/utils';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function Logo({ className, size = 'medium' }: LogoProps) {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
  };

  return (
    <Link href="/" className={cn('font-bold flex items-center', sizeClasses[size], className)}>
      <div className="mr-2 bg-gradient-to-r from-primary to-primary-foreground text-white rounded-full flex items-center justify-center w-8 h-8">
        <span className="text-base">V</span>
      </div>
      <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
        VibeWell
      </span>
    </Link>
  );
} 