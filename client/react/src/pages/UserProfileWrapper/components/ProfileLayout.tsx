import { ReactNode } from "react";

interface ProfileLayoutProps {
  children: ReactNode;
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-right">حسابي</h1>
      {children}
    </div>
  );
};

export default ProfileLayout;
