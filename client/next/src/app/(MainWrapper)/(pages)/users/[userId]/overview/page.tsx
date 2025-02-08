"use client";

import dynamic from "next/dynamic";

const UserProfileOverview = dynamic(() => import("./_components/UserProfileOverview"), {
  ssr: false,
});

export default UserProfileOverview;
