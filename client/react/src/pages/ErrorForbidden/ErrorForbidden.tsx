import style from "./ErrorForbidden.module.css";

const ErrorForbidden = () => {
  return (
    <section className={style.forbidden}>
      <div>
        <h2>ممنوع</h2>
        <p>ليس لديك إذن للوصول إلى هذه المورد.</p>
      </div>
    </section>
  );
};

export default ErrorForbidden;
