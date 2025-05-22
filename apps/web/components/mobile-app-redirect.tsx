'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Download, Phone } from 'lucide-react';

type MobileAppRedirectProps = {
  showAlways?: boolean;
  // If provided, this message will be shown instead of the default
  customMessage?: string;
};

/**
 * A component that shows a banner encouraging users to download the mobile app
 * for a better experience with customer-facing features.
 */
export function MobileAppRedirect({ 
  showAlways = false,
  customMessage
}: MobileAppRedirectProps) {
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if the user is on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = 
        typeof window !== 'undefined' ? navigator.userAgent : '';
      const mobile = Boolean(
        userAgent.match(
          /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        )
      );
      setIsMobile(mobile);
    };
    
    checkMobile();
  }, []);
  
  // If the banner was dismissed, don't show it again in this session
  // unless showAlways is true
  if (dismissed && !showAlways) {
    return null;
  }
  
  // Different messaging based on device type
  const message = customMessage || (isMobile 
    ? "Get the best VibeWell experience with our mobile app!"
    : "VibeWell is designed for mobile! Download our app for the full experience.");
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-primary text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Phone className="h-5 w-5" />
          <p className="font-medium">{message}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* App store links would go here */}
          <Link 
            href="/download" 
            className="bg-white text-primary px-3 py-1 rounded-md text-sm font-medium flex items-center space-x-1 hover:bg-opacity-90 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Link>
          
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full hover:bg-primary-dark transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileAppRedirect; 