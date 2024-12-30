import style from "./ErrorNoResourceFound.module.css";

const ErrorNoResourceFound = () => {
  return (
    <section className={style.no_resource_found}>
      <div>
        <h2>المورد غير موجود</h2>
        <p>المورد الذي تبحث عنه غير موجود</p>
      </div>
    </section>
  );
};

export default ErrorNoResourceFound;
