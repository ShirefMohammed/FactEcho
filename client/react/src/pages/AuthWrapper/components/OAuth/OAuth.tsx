import { endPoints } from "../../../../api/endPoints";
import facebookIcon from "../../../../assets/facebookIcon.svg";
import googleIcon from "../../../../assets/googleIcon.svg";
import style from "./OAuth.module.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const OAuth = () => {
  const loginWithGoogle = async () => {
    const googleLoginUrl = `${SERVER_URL}/api/v1${endPoints.auth.loginWithGoogle}`;
    window.location.href = googleLoginUrl; // Redirect the user to the Google OAuth flow
  };

  const loginWithFacebook = async () => {
    const facebookLoginUrl = `${SERVER_URL}/api/v1${endPoints.auth.loginWithFaceBook}`;
    window.location.href = facebookLoginUrl; // Redirect the user to the Facebook OAuth flow
  };

  return (
    <section className={style.OAuth}>
      {/* Google login btn */}
      <button type="button" onClick={loginWithGoogle}>
        <img src={googleIcon} alt="google icon" />
        <span>الاستمرار عبر غوغل</span>
      </button>

      {/* Facebook login btn */}
      <button type="button" onClick={loginWithFacebook}>
        <img src={facebookIcon} alt="facebook icon" />
        <span>الاستمرار عبر فيسبوك</span>
      </button>
    </section>
  );
};

export default OAuth;
