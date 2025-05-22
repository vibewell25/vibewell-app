import { Metadata } from "next";
import ProductsClient from "./products-client";

export const metadata: Metadata = {
  title: "Shop Beauty Products | VibeWell",
  description: "Discover premium beauty and wellness products from top providers on VibeWell",
};

export default function ProductsPage() {
  return <ProductsClient />;
} 