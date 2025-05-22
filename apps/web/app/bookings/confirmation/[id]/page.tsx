import { Metadata } from "next";
import BookingConfirmationClient from "./client";

// Use consistent ParamsType across booking pages
type ParamsType = Promise<{ id: string }>;

type Props = {
  params: ParamsType;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: "Booking Confirmation | VibeWell",
    description: "Your booking has been confirmed.",
  };
}

export default async function BookingConfirmationPage({ params }: Props) {
  const { id } = await params;
  return <BookingConfirmationClient id={id} />;
} 