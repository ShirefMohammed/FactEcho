import { RequireAuth } from "../../../../../components";
import { ROLES_LIST } from "../../../../../utils/constants";

import { Metadata } from "next";
import { createArticleMetadata } from "./metadata";

// Export the metadata
export const metadata: Metadata = createArticleMetadata;

const CreateArticleLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <RequireAuth allowedRoles={[ROLES_LIST.Admin, ROLES_LIST.Author]}>{children}</RequireAuth>;
};

export default CreateArticleLayout;
