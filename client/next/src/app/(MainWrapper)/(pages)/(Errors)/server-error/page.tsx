"use client";

const ServerError = () => {
  return (
    <section className="w-full px-4 py-24 flex items-center justify-center text-center">
      <div>
        <h2 className="font-bold text-lg">خطأ في الخادم</h2>
        <p className="text-sm">حدثت بعض الأخطاء في الخادم، حاول مرة أخرى بعد قليل</p>
      </div>
    </section>
  );
};

export default ServerError;
