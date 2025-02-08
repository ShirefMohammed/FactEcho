"use client";

import dynamic from "next/dynamic";

const AdminLayout = dynamic(() => import("./_components/AdminLayout"), { ssr: false });

export default AdminLayout;
