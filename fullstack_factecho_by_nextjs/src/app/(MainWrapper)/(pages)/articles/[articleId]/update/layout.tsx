import { Metadata } from "next";

import { updateArticleMetadata } from "./metadata";

export const metadata: Metadata = updateArticleMetadata;

const UpdateArticleLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <>{children}</>;
};

export default UpdateArticleLayout;
