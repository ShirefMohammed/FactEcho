import { Metadata } from "next";

import { createArticleMetadata } from "./metadata";

export const metadata: Metadata = createArticleMetadata;

const CreateArticleLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <>{children}</>;
};

export default CreateArticleLayout;
