import { useState, useEffect } from "react";
import Link from "next/link";
import { Profile } from "@vibewell/types";
import { getUserCertificates } from "@/lib/certificates";

interface Certificate {
  id: string;
  enrollmentId: string;
  userId: string;
  courseId: string;
  certificateUrl: string | null;
  certificateNumber: string;
  issuedAt: string;
  courseName: string;
}

interface CertificatesSectionProps {
  profile: Profile;
}

export function CertificatesSection({ profile }: CertificatesSectionProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        // Fetch real certificates from the database
        const userCertificates = await getUserCertificates(profile.id);
        setCertificates(userCertificates);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        // If there's an error, fall back to empty certificates array
        setCertificates([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCertificates();
  }, [profile.id]);

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">My Certificates</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-xl font-semibold mb-4">My Certificates</h2>
      
      {certificates.length === 0 ? (
        <div className="py-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">No certificates yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete courses to earn certificates
          </p>
          <Link
            href="/courses"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-background hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">{certificate.courseName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Certificate #{certificate.certificateNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Issued on: {new Date(certificate.issuedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href={certificate.certificateUrl || "#"}
                  target="_blank"
                  className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  View
                </Link>
                <a
                  href={certificate.certificateUrl || "#"}
                  download={`certificate-${certificate.certificateNumber}.pdf`}
                  className="inline-flex h-8 items-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 