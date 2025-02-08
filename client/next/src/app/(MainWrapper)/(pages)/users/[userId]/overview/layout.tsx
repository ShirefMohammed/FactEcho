"use client";

import dynamic from "next/dynamic";

const UserProfileOverviewLayout = dynamic(() => import("./_components/UserProfileOverviewLayout"), {
  ssr: false,
});

export default UserProfileOverviewLayout;
