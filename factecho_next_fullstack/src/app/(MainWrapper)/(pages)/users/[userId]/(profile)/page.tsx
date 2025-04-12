"use client";

import { redirect, useParams } from "next/navigation";

const UserProfilePage = () => {
  const { userId } = useParams();

  redirect(`/users/${userId}/profile`);
};

export default UserProfilePage;
