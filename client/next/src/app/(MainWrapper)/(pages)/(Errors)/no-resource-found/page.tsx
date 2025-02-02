"use client";

const NoResourceFound = () => {
  return (
    <section className="w-full px-4 py-24 flex items-center justify-center text-center">
      <div>
        <h2 className="font-bold text-lg">المورد غير موجود</h2>
        <p className="text-sm">المورد الذي تبحث عنه غير موجود</p>
      </div>
    </section>
  );
};

export default NoResourceFound;
