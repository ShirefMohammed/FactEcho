import { memo } from "react";

// List of data items for the AuthMessage component
const loginItems = [
  {
    title: "حساب واحد لصدى الحقيقة.",
    description:
      "عبر حساب واحد.. وصول بلا حدود إلى جميع خدماتنا التي تشمل مواقعنا الإخبارية وتطبيقنا على الجوال وأفلامنا الوثائقية ومنصاتنا المتنوعة.",
    iconPath:
      "m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z",
  },
  {
    title: "مخصص لك",
    description: "أحط نفسك بمجموعة منتقاة بعناية من المقالات والفيديوات المتوافقة مع تفضيلاتك.",
    iconPath:
      "M12 2a5 5 0 1 1-5 5 5 5 0 0 1 5-5Zm0 14c-4.67 0-8 2.24-8 4v2h16v-2c0-1.76-3.33-4-8-4Z",
  },
  {
    title: "قائمة القراءة",
    description: "صمم مكتبة خاصة للمقالات والتقارير يمكنك الرجوع إليها.",
    iconPath:
      "m20 23-8-4.889L4 23V3.444c0-.648.24-1.27.67-1.728A2.213 2.213 0 0 1 6.285 1h11.428c.607 0 1.188.258 1.617.716.428.458.669 1.08.669 1.728V23Z",
  },
  {
    title: "تابع الكتَّاب والموضوعات",
    description: "استكشف الأحدث من كتّابك المفضلين والموضوعات التي تهمك.",
    iconPath:
      "M12 2a5 5 0 1 1-5 5 5 5 0 0 1 5-5Zm0 14c-4.67 0-8 2.24-8 4v2h16v-2c0-1.76-3.33-4-8-4Z",
    isComingSoon: true,
  },
  {
    title: "الإشعارات والتنبيهات",
    description: "كن أول من يعرف بالأخبار العاجلة والتحديثات التي تهمك.",
    iconPath: "M5 12a7 7 0 1 1 14 0 7 7 0 0 1-14 0Zm2.5 0a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0Z",
    isComingSoon: true,
  },
];

const AuthMessage: React.FC = memo(() => {
  return (
    <div className="p-6 lg:p-12 bg-veryLightGreyColor">
      {/* Main heading */}
      <h2 className="text-2xl mb-2">تواصل وتفاعل مع صدى الحقيقة.</h2>

      {/* Sub-heading */}
      <p className="text-mainGreyColor mb-8">هذا ليس قيدا يتعلق بالدفع والدخول مجاني</p>

      {/* List of points */}
      <ol className="space-y-6">
        {loginItems.map((item, index) => (
          <li key={index} className="flex items-start space-x-4">
            {/* Icon */}
            <svg
              className="w-6 h-6 text-primaryColor flex-shrink-0 ml-6"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={item.iconPath}
              ></path>
            </svg>

            {/* Content */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>{item.title}</span>
                {item.isComingSoon && (
                  <span
                    role="status"
                    aria-label="قريباً"
                    className="text-xs font-normal bg-veryLightGreyColor rounded-lg px-2"
                  >
                    قريباً
                  </span>
                )}
              </h3>
              <p className="text-mainGreyColor">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
});

export default AuthMessage;
