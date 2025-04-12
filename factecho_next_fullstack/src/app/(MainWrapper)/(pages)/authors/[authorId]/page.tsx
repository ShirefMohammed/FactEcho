import defaultAvatar from "@/assets/defaultAvatar.png";
import { authorsAPIs } from "@/axios/apis/authorsAPIs";
import NotFound from "@/components/NotFound";
import { Metadata } from "next";
import Image from "next/image";

import AuthorArticles from "./_components/AuthorArticles";
import { generateAuthorMetadata } from "./metadata";

type AuthorArticlesPageProps = {
  params: Promise<{ authorId: string }>;
};

// ISR: Revalidate the page every 5 minutes
export const revalidate = 60;
export const dynamic = "force-static";

// Fetch author data
async function getAuthorData(authorId: string) {
  try {
    const resBody = await authorsAPIs.getAuthorById(authorId);
    return resBody.data?.author || null;
  } catch (error) {
    console.error("Error fetching author:", error);
    return null;
  }
}

// Generate metadata dynamically
export async function generateMetadata({ params }: AuthorArticlesPageProps): Promise<Metadata> {
  const { authorId } = await params;
  const author = await getAuthorData(authorId);
  return generateAuthorMetadata(author);
}

export default async function AuthorArticlesPage({ params }: AuthorArticlesPageProps) {
  const { authorId } = await params;

  // console.log(`Regenerating AuthorArticlesPage [${authorId}] at:`, new Date().toISOString());

  const author = await getAuthorData(authorId);

  if (!author) {
    return <NotFound resourceName="الكاتب" />;
  }

  return (
    <section>
      {/* Author Profile Header */}
      <div className="flex flex-col items-center sm:flex-row gap-x-6 gap-y-4 mb-8">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
          <Image
            src={author?.avatar && author.avatar !== "" ? author.avatar : defaultAvatar}
            alt={author?.name || "الكاتب"}
            className="w-full h-full object-cover"
            width={128}
            height={128}
          />
        </div>
        <div>
          <h1 className="text-lg sm:text-4xl font-bold text-gray-900">
            {author?.name || "الكاتب"}
          </h1>
        </div>
      </div>

      {/* Author Articles */}
      <AuthorArticles author={author} />
    </section>
  );
}
