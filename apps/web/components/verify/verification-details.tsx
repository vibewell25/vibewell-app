'use client';

import { format } from 'date-fns';
import { CalendarIcon, GraduationCap, User, Award, Calendar } from 'lucide-react';

interface VerificationDetailsProps {
  certificate: {
    id: string;
    certificateNumber: string;
    issuedAt: string;
    courses: {
      id: string;
      title: string;
      description: string;
    } | null;
    users: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  };
  enrollment: {
    id: string;
    enrolledAt: string;
    completedAt: string | null;
  } | null;
}

export function VerificationDetails({ certificate, enrollment }: VerificationDetailsProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMMM d, yyyy');
  };
  
  const userName = certificate.users 
    ? `${certificate.users.firstName} ${certificate.users.lastName}`
    : 'Unknown User';
    
  const courseName = certificate.courses?.title || 'Unknown Course';
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Verification Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Certificate ID</p>
            <p className="text-sm text-muted-foreground">{certificate.certificateNumber}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Issue Date</p>
            <p className="text-sm text-muted-foreground">{formatDate(certificate.issuedAt)}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Recipient</p>
            <p className="text-sm text-muted-foreground">{userName}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Course</p>
            <p className="text-sm text-muted-foreground">{courseName}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Enrollment Date</p>
            <p className="text-sm text-muted-foreground">
              {enrollment ? formatDate(enrollment.enrolledAt) : 'N/A'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Completion Date</p>
            <p className="text-sm text-muted-foreground">
              {enrollment ? formatDate(enrollment.completedAt) : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 