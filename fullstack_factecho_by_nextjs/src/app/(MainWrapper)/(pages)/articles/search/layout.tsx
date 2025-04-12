import { Metadata } from "next";

import { searchMetadata } from "./metadata";

export const metadata: Metadata = searchMetadata;

const SearchLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return children;
};

export default SearchLayout;
