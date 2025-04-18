import { Metadata } from "next";

import { CategoriesList, LatestArticlesList } from "../../../../components";
import CategoriesArticles from "./_components/CategoriesArticles";
import NewsBanner from "./_components/NewsBanner";
import SocialMediaLinks from "./_components/SocialMediaLinks";
import TrendArticlesGrid from "./_components/TrendArticlesGrid";
import TrendArticlesList from "./_components/TrendArticlesList";
import { homeMetadata } from "./metadata";

// Revalidate the page every 300 seconds (5 minutes) ISR
export const revalidate = 300;

// Export the imported metadata for SEO
export const metadata: Metadata = homeMetadata;

export default async function HomePage() {
  console.log("Regenerating HomePage at:", new Date().toISOString());

  return (
    <section className="flex flex-col gap-8">
      {/* News Banner Section */}
      <NewsBanner />

      {/* Main Content Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Right Side: Trending Articles Grid */}
        <div className="flex-1">
          <TrendArticlesGrid />
        </div>

        {/* Left Side: Categories and Latest Articles */}
        <div className="w-full lg:w-80 flex flex-col gap-5">
          <CategoriesList />
          <LatestArticlesList />
        </div>
      </div>

      {/* Categories Articles Section */}
      <CategoriesArticles />

      {/* Social Media Links Section */}
      <SocialMediaLinks />

      {/* Trend Articles List Section */}
      <TrendArticlesList />
    </section>
  );
}
