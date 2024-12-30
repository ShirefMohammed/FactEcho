import style from "./ErrorServerError.module.css";

const ErrorServerError = () => {
  return (
    <section className={style.server_error}>
      <div>
        <h2>خطأ في الخادم</h2>
        <p>حدثت بعض الأخطاء في الخادم، حاول مرة أخرى بعد قليل</p>
      </div>
    </section>
  );
};

export default ErrorServerError;
