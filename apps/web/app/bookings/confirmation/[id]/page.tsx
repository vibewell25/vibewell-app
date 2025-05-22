import { Metadata } from "next";
import BookingConfirmationClient from "./client";

interface Params {
  id: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return {
    title: "Booking Confirmation | VibeWell",
    description: "Your booking has been confirmed.",
  };
}

export default function BookingConfirmationPage({ params }: { params: Params }) {
  return <BookingConfirmationClient id={params.id} />;
} 