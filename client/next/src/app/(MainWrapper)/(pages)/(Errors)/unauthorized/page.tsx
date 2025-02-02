"use client";

const Unauthorized = () => {
  return (
    <section className="w-full px-4 py-24 flex items-center justify-center text-center">
      <div>
        <h2 className="font-bold text-lg">غير مصرح</h2>
        <p className="text-sm">ليس لديك إذن للوصول إلى هذه الصفحة.</p>
      </div>
    </section>
  );
};

export default Unauthorized;
