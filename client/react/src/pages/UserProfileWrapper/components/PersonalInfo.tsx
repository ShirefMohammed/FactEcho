import { StoreState } from "client/react/src/store/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import googleIcon from "../../../assets/googleIcon.svg";

/**
 * PersonalInfo component for displaying user's email and full name.
 */
const PersonalInfo = () => {
  const currentUser = useSelector((state: StoreState) => state.currentUser); // currentUser state

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Email section */}
      <div className="flex flex-row justify-between items-center gap-4 bg-veryLightGreyColor p-4 rounded-md border border-slate-200">
        <div className="text-right">
          <h2 className="text-gray-700 mb-1">البريد الإلكتروني</h2>
          <div className="flex items-center gap-2">
            <img src={googleIcon} alt="Google" title="Google" className="w-4 h-4 bg-none" />
            <span className="underline text-sm">
              {currentUser.email || "لا يوجد بريد إلكترونى"}{" "}
              {/* Fallback if email is unavailable */}
            </span>
          </div>
        </div>
      </div>

      {/* Full name section */}
      <div className="flex flex-row justify-between items-center gap-4 bg-veryLightGreyColor p-4 rounded-md border border-slate-200">
        <div className="text-right">
          <h2 className="text-gray-700 mb-1">الاسم الكامل</h2>
          <p className="underline text-sm">
            {currentUser.name || "لا يوجد اسم كامل"} {/* Fallback if name is unavailable */}
          </p>
        </div>
        <Link to={`/users/${currentUser.user_id}/settings`} className="text-sm underline">
          تعديل {/* Link to settings for editing personal information */}
        </Link>
      </div>
    </div>
  );
};

export default PersonalInfo;
