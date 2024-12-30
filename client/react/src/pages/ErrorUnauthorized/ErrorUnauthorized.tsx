import style from "./ErrorUnauthorized.module.css";

const ErrorUnauthorized = () => {
  return (
    <section className={style.unauthorized}>
      <div>
        <h2>غير مصرح</h2>
        <p>ليس لديك إذن للوصول إلى هذه الصفحة.</p>
      </div>
    </section>
  );
};

export default ErrorUnauthorized;
