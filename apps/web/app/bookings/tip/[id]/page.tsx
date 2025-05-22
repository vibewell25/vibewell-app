import { Metadata } from "next";
import TipPageClient from "./client";

// Use consistent ParamsType across booking pages
type ParamsType = Promise<{ id: string }>;

type Props = {
  params: ParamsType;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: "Add a Tip | VibeWell",
    description: "Add a tip to your booking on VibeWell",
  };
}

export default async function TipPage({ params }: Props) {
  const { id } = await params;
  return <TipPageClient id={id} />;
} 