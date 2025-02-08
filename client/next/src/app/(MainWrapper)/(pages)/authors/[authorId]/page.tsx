"use client";

import dynamic from "next/dynamic";

const PublicAuthorProfile = dynamic(() => import("./_components/PublicAuthorProfile"), {
  ssr: false,
});

export default PublicAuthorProfile;
