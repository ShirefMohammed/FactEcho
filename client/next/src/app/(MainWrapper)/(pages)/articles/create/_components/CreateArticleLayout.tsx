"use client";

import { RequireAuth } from "../../../../../../components";
import { ROLES_LIST } from "../../../../../../utils/rolesList";

const CreateArticleLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <RequireAuth allowedRoles={[ROLES_LIST.Admin]}>{children}</RequireAuth>;
};

export default CreateArticleLayout;
