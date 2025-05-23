import React from 'react';
import { render, screen } from '@testing-library/react';
import { Certificate } from '../components/certificate';

// Mock certificate data
const mockCertificate = {
  id: 'cert-123',
  certificateNumber: 'CERT-123456',
  issuedAt: new Date().toISOString(),
  course: {
    title: 'Advanced Skincare Techniques',
    description: 'Learn advanced skincare techniques and treatments'
  },
  user: {
    firstName: 'Jane',
    lastName: 'Doe'
  }
};

describe('Certificate Component', () => {
  it('renders certificate with correct information', () => {
    render(<Certificate certificate={mockCertificate} />);
    
    // Check if certificate elements are present
    expect(screen.getByText(/Certificate of Completion/i)).toBeInTheDocument();
    expect(screen.getByText(mockCertificate.certificateNumber)).toBeInTheDocument();
    expect(screen.getByText(mockCertificate.course.title)).toBeInTheDocument();
    expect(screen.getByText(`${mockCertificate.user.firstName} ${mockCertificate.user.lastName}`)).toBeInTheDocument();
    
    // Check if date is formatted correctly
    const formattedDate = new Date(mockCertificate.issuedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    expect(screen.getByText(new RegExp(formattedDate))).toBeInTheDocument();
  });
  
  it('displays verification QR code', () => {
    render(<Certificate certificate={mockCertificate} />);
    
    // Check if QR code is present
    const qrCodeElement = screen.getByTestId('certificate-qr-code');
    expect(qrCodeElement).toBeInTheDocument();
    
    // Check if QR code has correct data
    expect(qrCodeElement).toHaveAttribute('data-verification-url', 
      expect.stringContaining(mockCertificate.certificateNumber));
  });
  
  it('renders certificate with proper styling', () => {
    render(<Certificate certificate={mockCertificate} />);
    
    // Check if certificate has proper styling
    const certificateElement = screen.getByTestId('certificate-container');
    expect(certificateElement).toHaveClass('certificate');
    
    // Check if certificate has border
    const computedStyle = window.getComputedStyle(certificateElement);
    expect(computedStyle.border).not.toBe('none');
  });
  
  it('renders certificate with company logo', () => {
    render(<Certificate certificate={mockCertificate} />);
    
    // Check if company logo is present
    const logoElement = screen.getByAltText('VibeWell Logo');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute('src', expect.stringContaining('logo'));
  });
  
  it('renders certificate with signature', () => {
    render(<Certificate certificate={mockCertificate} />);
    
    // Check if signature is present
    const signatureElement = screen.getByTestId('certificate-signature');
    expect(signatureElement).toBeInTheDocument();
  });
});

// Mock component implementation for reference
/*
export const Certificate = ({ certificate }) => {
  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const verificationUrl = `https://getvibewell.com/verify/${certificate.certificateNumber}`;
  
  return (
    <div className="certificate" data-testid="certificate-container">
      <div className="certificate-header">
        <img src="/logo.png" alt="VibeWell Logo" className="certificate-logo" />
        <h1>Certificate of Completion</h1>
      </div>
      
      <div className="certificate-body">
        <p>This certifies that</p>
        <h2>{certificate.user.firstName} {certificate.user.lastName}</h2>
        <p>has successfully completed the course</p>
        <h3>{certificate.course.title}</h3>
        <p>on {formattedDate}</p>
      </div>
      
      <div className="certificate-footer">
        <div className="certificate-signature" data-testid="certificate-signature">
          <img src="/signature.png" alt="Signature" />
          <p>Course Instructor</p>
        </div>
        
        <div className="certificate-verification">
          <div className="qr-code" data-testid="certificate-qr-code" data-verification-url={verificationUrl}>
            {/* QR code would be rendered here */}
          </div>
          <p>Certificate ID: {certificate.certificateNumber}</p>
          <p>Verify at: getvibewell.com/verify</p>
        </div>
      </div>
    </div>
  );
};
*/ 