"use client";

const Forbidden = () => {
  return (
    <section className="w-full px-4 py-24 flex items-center justify-center text-center">
      <div>
        <h2 className="font-bold text-lg">ممنوع</h2>
        <p className="text-sm">ليس لديك إذن للوصول إلى هذا المورد.</p>
      </div>
    </section>
  );
};

export default Forbidden;
