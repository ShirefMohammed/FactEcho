import Link from "next/link";

const NotFound = ({ resourceName }: { resourceName: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">{resourceName} غير موجود</h1>
      <p className="text-gray-600 text-center">
        عذرًا، لم يتم العثور على {resourceName} المطلوب. يرجى التحقق من الرابط والمحاولة مرة أخرى.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
};

export default NotFound;
