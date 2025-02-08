"use client";

import dynamic from "next/dynamic";

const UserProfileWrapperLayout = dynamic(() => import("./_components/UserProfileWrapperLayout"), {
  ssr: false,
});

export default UserProfileWrapperLayout;
