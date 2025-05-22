import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | VibeWell",
  description: "Learn about VibeWell, a cutting-edge beauty and wellness platform combining service booking capabilities with social networking features.",
};

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About VibeWell</h1>
        
        <div className="prose max-w-none">
          <p className="text-xl mb-6 text-muted-foreground">
            VibeWell is a cutting-edge beauty and wellness platform combining service booking capabilities with social networking features. 
            We empower users to discover, book, and manage beauty and wellness services while connecting with providers and other users 
            through a modern social media experience.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Our Vision</h2>
          <p className="mb-4">
            VibeWell aims to revolutionize the beauty and wellness industry by creating a comprehensive ecosystem where:
          </p>
          <ul className="list-disc pl-6 space-y-3 mb-6">
            <li>
              <strong>Service Providers</strong> can showcase their expertise, build a client base, sell products, and offer online training
            </li>
            <li>
              <strong>Customers</strong> can discover top-rated services, book appointments seamlessly, connect with like-minded individuals, and access personalized recommendations
            </li>
            <li>
              <strong>Community</strong> thrives through social interactions, reviews, and knowledge sharing
            </li>
          </ul>
          <p>
            The platform is designed with a focus on user experience, performance, and scalability, adhering to modern development practices and architectural patterns.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Key Features</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Phase 1-3 (Core Platform)</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>User authentication and profile management</li>
            <li>Service provider onboarding and listing management</li>
            <li>Booking system with calendar integration</li>
            <li>Secure payment processing</li>
            <li>Review and rating system</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Phase 4-6 (Enhanced Capabilities)</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>E-commerce storefront for physical products</li>
            <li>Online training modules and courses</li>
            <li>Social feed with posts, likes, and comments</li>
            <li>Messaging between users and providers</li>
            <li>Loyalty and rewards system</li>
            <li>Virtual try-on features</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Phase 7-8 (Optimization & Growth)</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Analytics and insights dashboard</li>
            <li>Multi-language support</li>
            <li>Advanced search and filtering</li>
            <li>Mobile-first optimizations</li>
            <li>Accessibility enhancements</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Our Values</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>KISS (Keep It Simple, Stupid):</strong> We prefer simple solutions over complex ones
            </li>
            <li>
              <strong>YAGNI (You Aren't Gonna Need It):</strong> We implement features only when explicitly required
            </li>
            <li>
              <strong>DRY (Don't Repeat Yourself):</strong> We create reusable components and centralize business logic
            </li>
            <li>
              <strong>SOLID Principles:</strong> We maintain single responsibility, extensibility, and proper abstractions
            </li>
            <li>
              <strong>Fail Fast:</strong> We implement robust validation and meaningful error handling
            </li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Technical Architecture</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Frontend</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Next.js 15 with App Router and TypeScript</li>
                <li>Tailwind CSS with ShadCN components</li>
                <li>React Context for global state (auth, theme)</li>
                <li>Server Components for data fetching</li>
                <li>SWR/React Query for client-side data management</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Backend</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>PostgreSQL via Supabase with Row-Level Security</li>
                <li>Supabase Auth with JWT</li>
                <li>Prisma for type-safe database access</li>
                <li>Supabase Realtime for chat and notifications</li>
                <li>Supabase Storage for media files</li>
                <li>Vercel Edge Functions for API endpoints</li>
              </ul>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Join Us</h2>
          <p className="mb-6">
            We're excited to have you join the VibeWell community! Whether you're a service provider looking to grow your business 
            or a customer seeking quality wellness services, VibeWell is designed with you in mind.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link 
              href="/auth/signup" 
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Sign Up Now
            </Link>
            <Link 
              href="/services" 
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Browse Services
            </Link>
          </div>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Get in Touch</h2>
          <p>
            We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, 
            please don't hesitate to reach out.
          </p>
          <p className="mt-4">
            Email: <a href="mailto:contact@vibewell.com" className="text-primary hover:underline">contact@vibewell.com</a>
          </p>
        </div>
      </div>
    </div>
  );
} 