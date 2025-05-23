'use client';

import React from 'react';
import Image from 'next/image';
import QRCode from 'react-qr-code';
import { cn } from '@/lib/utils';

interface CertificateProps {
  certificate: {
    id: string;
    certificateNumber: string;
    issuedAt: string;
    course: {
      title: string;
      description: string;
    };
    user: {
      firstName: string;
      lastName: string;
    };
  };
  className?: string;
  printable?: boolean;
}

export const Certificate = ({ certificate, className, printable = false }: CertificateProps) => {
  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const verificationUrl = `https://getvibewell.com/verify/${certificate.certificateNumber}`;
  
  return (
    <div 
      className={cn(
        'certificate relative bg-white border-4 border-amber-500 p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto my-8',
        printable && 'print:shadow-none print:border-2',
        className
      )}
      data-testid="certificate-container"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/certificate-pattern.svg')] bg-repeat"></div>
      </div>
      
      {/* Certificate content */}
      <div className="relative z-10">
        <div className="certificate-header flex flex-col items-center justify-center mb-8">
          <div className="w-40 h-20 relative mb-4">
            <Image 
              src="/logo.svg" 
              alt="VibeWell Logo" 
              fill
              className="object-contain certificate-logo" 
              priority
            />
          </div>
          <h1 className="text-3xl font-serif font-bold text-amber-700 text-center">Certificate of Completion</h1>
          <div className="w-full border-b-2 border-amber-500 mt-2"></div>
        </div>
        
        <div className="certificate-body text-center mb-8">
          <p className="text-gray-600 mb-1">This certifies that</p>
          <h2 className="text-2xl font-bold mb-1">{certificate.user.firstName} {certificate.user.lastName}</h2>
          <p className="text-gray-600 mb-1">has successfully completed the course</p>
          <h3 className="text-xl font-bold text-amber-700 mb-1">{certificate.course.title}</h3>
          <p className="text-gray-600">on {formattedDate}</p>
        </div>
        
        <div className="certificate-footer flex justify-between items-end mt-12">
          <div className="certificate-signature text-center" data-testid="certificate-signature">
            <div className="h-16 relative mb-1">
              <Image 
                src="/images/signature.png" 
                alt="Signature" 
                width={150}
                height={60}
                className="object-contain"
              />
            </div>
            <div className="w-full border-t border-gray-400 mb-1"></div>
            <p className="text-sm text-gray-600">Course Instructor</p>
          </div>
          
          <div className="certificate-verification text-center">
            <div 
              className="qr-code bg-white p-2 border border-gray-200 inline-block mb-2" 
              data-testid="certificate-qr-code" 
              data-verification-url={verificationUrl}
            >
              <QRCode value={verificationUrl} size={80} />
            </div>
            <div className="text-xs text-gray-600">
              <p>Certificate ID: {certificate.certificateNumber}</p>
              <p>Verify at: getvibewell.com/verify</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Certificate seal */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-24 h-24 relative">
          <Image 
            src="/images/certificate-seal.png" 
            alt="Official Seal" 
            fill
            className="object-contain opacity-70"
          />
        </div>
      </div>
    </div>
  );
}; 