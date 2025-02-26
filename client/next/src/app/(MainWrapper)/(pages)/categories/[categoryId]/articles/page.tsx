import { Metadata } from "next";

import CategoryArticles from "./_components/CategoryArticles";
import { metadata as categoriesMetadata } from "./metadata";

// Revalidate the page every 300 seconds (5 minutes) ISR
export const revalidate = 300;

// Export the imported metadata for SEO
export const metadata: Metadata = categoriesMetadata;

export default function CategoriesPage() {
  return <CategoryArticles />;
}
