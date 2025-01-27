import { CategoriesList, LatestArticlesList } from "../../components";
import CategoriesArticles from "./components/CategoriesArticles";
import NewsBanner from "./components/NewsBanner";
import SocialMediaLinks from "./components/SocialMediaLinks";
import TrendArticlesGrid from "./components/TrendArticlesGrid";
import TrendArticlesList from "./components/TrendArticlesList";

const Home = () => {
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
};

export default Home;
