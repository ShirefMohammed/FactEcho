import { Metadata } from "next";

import { categoriesAPIs } from "../../../../../../api/server/categoriesAPIs";
import NotFound from "../../../../../../components/NotFound";
import CategoryArticles from "./_components/CategoryArticles";
import { generateCategoryMetadata } from "./metadata";

type CategoryArticlesPageProps = {
  params: Promise<{ categoryId: string }>;
};

// ISR: Revalidate the page every 5 minutes
export const revalidate = 300;
export const dynamic = "force-static";

// Fetch category data
async function getCategoryData(categoryId: string) {
  try {
    const resBody = await categoriesAPIs.getCategoryById(categoryId);
    return resBody.data?.category || null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

// Generate metadata dynamically
export async function generateMetadata({ params }: CategoryArticlesPageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const category = await getCategoryData(categoryId);
  return generateCategoryMetadata(category);
}

export default async function CategoryArticlesPage({ params }: CategoryArticlesPageProps) {
  const { categoryId } = await params;

  console.log(`Regenerating CategoryArticlesPage [${categoryId}] at:`, new Date().toISOString());

  // Fetch the category data
  const category = await getCategoryData(categoryId);

  // If category is not found, display the NotFound component
  if (!category) {
    return <NotFound resourceName="التصنيف" />;
  }

  return <CategoryArticles category={category} />;
}
