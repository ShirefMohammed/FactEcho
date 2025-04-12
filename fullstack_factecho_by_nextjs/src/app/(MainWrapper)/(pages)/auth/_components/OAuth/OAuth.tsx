import { LoginWithFacebookButton } from "../LoginWithFacebookButton";
import { LoginWithGoogleButton } from "../LoginWithGoogleButton";
import style from "./OAuth.module.css";

const OAuth = () => {
  return (
    <section className={style.OAuth}>
      <LoginWithGoogleButton />
      <LoginWithFacebookButton />
    </section>
  );
};

export default OAuth;
