import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { IAuthor } from "@shared/types/entitiesTypes";

import { useAuthorsAPIs } from "../../api/hooks/useAuthorsAPIs";
import defaultAvatar from "../../assets/defaultAvatar.png";
import { useHandleErrors } from "../../hooks";
import AuthorArticles from "./components/AuthorArticles";

const PublicAuthorProfile = () => {
  const { authorId } = useParams(); // Extract the authorId from the URL parameters

  const [author, setAuthor] = useState<IAuthor | null>(null);
  const [fetchAuthorLoad, setFetchAuthorLoad] = useState<boolean>(false);

  const handleErrors = useHandleErrors();
  const authorsAPIs = useAuthorsAPIs();

  /**
   * Fetches the author's data based on the authorId.
   * Sets the author state or handles errors accordingly.
   */
  const fetchAuthor = async (): Promise<void> => {
    try {
      setFetchAuthorLoad(true);
      const resBody = await authorsAPIs.getAuthorById(authorId!);
      setAuthor(resBody.data?.author as IAuthor);
    } catch (err: any) {
      handleErrors(err);
    } finally {
      setFetchAuthorLoad(false);
    }
  };

  // Effect to fetch author data whenever the authorId changes
  useEffect(() => {
    fetchAuthor();
  }, [authorId]);

  /**
   * Renders the author's profile header.
   * Displays a loading skeleton while data is being fetched,
   * or displays the author's avatar and name when available.
   */
  const renderAuthorHeader = () => {
    // Show a loading skeleton while fetching data
    if (fetchAuthorLoad) {
      return (
        <div className="flex items-center gap-6 mb-8">
          <div className="w-32 h-32 rounded-full bg-gray animate-pulse" />
          <div className="flex-1">
            <div className="h-8 bg-gray rounded w-64 animate-pulse" />
          </div>
        </div>
      );
    }

    // Return null if no author data is available
    if (!author) {
      return null;
    }

    // Render the author's profile with their avatar and name
    return (
      <div className="flex flex-col items-center sm:flex-row gap-x-6 gap-y-4 mb-8">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
          <img
            src={author.avatar && author.avatar !== "" ? author.avatar : defaultAvatar}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-lg sm:text-4xl font-bold text-gray-900">{author.name}</h1>
        </div>
      </div>
    );
  };

  return (
    <section className="">
      {renderAuthorHeader()}
      {/* Component to render the author's articles */}
      <AuthorArticles authorId={authorId!} />
    </section>
  );
};

export default PublicAuthorProfile;
