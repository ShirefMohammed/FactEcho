"use client";

const NewsBanner = () => {
  return (
    <section className="w-full h-[200px] bg-gradient-to-b from-[#32a2ef] to-[#f0f8ff] flex justify-center items-center relative overflow-hidden">
      {/* Overlay to blend the background image with the gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#32a2ef]/80 to-[#f0f8ff]/80"></div>

      <p className="text-white text-2xl sm:text-4xl md:text-6xl font-bold text-center leading-tight drop-shadow-2xl transform transition-transform hover:scale-105 z-10">
        FactEcho for Hot News
      </p>
    </section>
  );
};

export default NewsBanner;
