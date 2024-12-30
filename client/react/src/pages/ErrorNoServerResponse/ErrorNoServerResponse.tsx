import style from "./ErrorNoServerResponse.module.css";

const ErrorNoServerResponse = () => {
  return (
    <section className={style.no_server_response}>
      <div>
        <h2>لا يوجد استجابة من الخادم</h2>
        <p>لا توجد استجابة من الخادم، حاول مرة أخرى بعد قليل</p>
      </div>
    </section>
  );
};

export default ErrorNoServerResponse;
