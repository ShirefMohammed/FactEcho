import { Metadata } from "next";

import { CategoriesList, LatestArticlesList } from "../../../../components";
import CategoriesArticles from "./_components/CategoriesArticles";
import NewsBanner from "./_components/NewsBanner";
import SocialMediaLinks from "./_components/SocialMediaLinks";
import TrendArticlesGrid from "./_components/TrendArticlesGrid";
import TrendArticlesList from "./_components/TrendArticlesList";
import { homeMetadata } from "./metadata";

export const revalidate = 60;

export const metadata: Metadata = homeMetadata;

export default async function HomePage() {
  // console.log("Regenerating HomePage at:", new Date().toISOString());

  return (
    <section className="flex flex-col gap-8">
      <NewsBanner />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Right Side */}
        <div className="flex-1">
          <TrendArticlesGrid />
        </div>

        {/* Left Side */}
        <div className="w-full lg:w-80 flex flex-col gap-5">
          <CategoriesList />
          <LatestArticlesList />
        </div>
      </div>

      <CategoriesArticles />
      <SocialMediaLinks />
      <TrendArticlesList />
    </section>
  );
}
