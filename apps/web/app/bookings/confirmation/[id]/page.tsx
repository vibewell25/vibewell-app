import { Metadata } from "next";
import BookingConfirmationClient from "./client";

type Params = {
  id: string;
}

type Props = {
  params: Params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Booking Confirmation | VibeWell",
    description: "Your booking has been confirmed.",
  };
}

export default function BookingConfirmationPage({ params }: Props) {
  return <BookingConfirmationClient id={params.id} />;
} 