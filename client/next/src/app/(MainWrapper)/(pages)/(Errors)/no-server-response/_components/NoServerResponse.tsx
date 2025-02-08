"use client";

const NoServerResponse = () => {
  return (
    <section className="w-full px-4 py-24 flex items-center justify-center text-center">
      <div>
        <h2 className="font-bold text-lg">لا يوجد استجابة من الخادم</h2>
        <p className="text-sm">لا توجد استجابة من الخادم، حاول مرة أخرى بعد قليل</p>
      </div>
    </section>
  );
};

export default NoServerResponse;
