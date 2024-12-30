import style from "./ErrorNoTFoundPage.module.css";

const ErrorNoTFoundPage = () => {
  return (
    <section className={style.not_found}>
      <div>
        <h2>عذرًا، هذه الصفحة غير متوفرة.</h2>
        <p>
          الرابط الذي اتبعته قد يكون خطأ، أو ربما تم إزالة الصفحة.
        </p>
      </div>
    </section>
  );
};

export default ErrorNoTFoundPage;
