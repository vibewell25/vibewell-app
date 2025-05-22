import { Metadata } from "next";

// Use consistent ParamsType across booking pages
interface ParamsType {
  id: string;
}

interface BookingConfirmationPageProps {
  params: ParamsType;
  searchParams: Record<string, string | string[] | undefined>;
}

export const generateMetadata = async ({ params }: BookingConfirmationPageProps): Promise<Metadata> => {
  return {
    title: "Booking Confirmation | VibeWell",
    description: "Your booking has been confirmed.",
  };
};

// Client Component
import BookingConfirmationClient from "./page.client";

export default function BookingConfirmationPage(props: BookingConfirmationPageProps) {
  return <BookingConfirmationClient {...props} />;
} 