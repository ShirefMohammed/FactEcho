import { Metadata } from "next";

import { RequireAuth } from "../../../../../../components";
import { ROLES_LIST } from "../../../../../../utils/constants";
import { updateArticleMetadata } from "./metadata";

// Export the metadata
export const metadata: Metadata = updateArticleMetadata;

const UpdateArticleLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <RequireAuth allowedRoles={[ROLES_LIST.Admin, ROLES_LIST.Author]}>{children}</RequireAuth>;
};

export default UpdateArticleLayout;
