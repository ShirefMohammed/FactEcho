"use client";

import Image from "next/image";
import Link from "next/link";

import Logo from "../../../../assets/Logo.svg";

const socialLinks = [
  {
    name: "YouTube",
    path: "",
    icon: (
      <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.8 8.001a2.835 2.835 0 00-2.001-2.001C17.75 5.5 12 5.5 12 5.5s-5.75 0-7.799.5a2.835 2.835 0 00-2.001 2.001C2.5 10.05 2.5 12 2.5 12s0 1.95.5 3.999a2.835 2.835 0 002.001 2.001c2.049.5 7.799.5 7.799.5s5.75 0 7.799-.5a2.835 2.835 0 002.001-2.001c.5-2.049.5-3.999.5-3.999s0-1.95-.5-3.999zm-11.8 6.999v-5l5 2.5-5 2.5z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    path: "",
    icon: (
      <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "Instagram",
    path: "",
    icon: (
      <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "Twitter",
    path: "",
    icon: (
      <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    path: "",
    icon: (
      <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2v12a3 3 0 11-2.26-2.91V7.2a6.46 6.46 0 00-4.8-6.12A6.464 6.464 0 004.5 2.26C6.29 4.4 6 6.4 7.3 6.8V9.6A8.46 8.46 0 0112 2zm0 0v12a3 3 0 01-2.26-2.91V7.2a6.46 6.46 0 004.8-6.12A6.464 6.464 0 0014.5 2.26C12.7 4.4 12 6.4 12 9.6V2z" />
      </svg>
    ),
  },
];

const footerLinks = [
  {
    title: "من نحن",
    links: [
      { label: "من نحن", path: "" },
      { label: "الأحكام والشروط", path: "" },
      { label: "سياسة الخصوصية", path: "" },
      { label: "سياسة ملفات تعريف الارتباط", path: "" },
      { label: "خريطة الموقع", path: "" },
    ],
  },
  {
    title: "تواصل معنا",
    links: [
      { label: "تواصل معنا", path: "" },
      { label: "احصل على المساعدة", path: "" },
      { label: "أعلن معنا", path: "" },
      { label: "الاشتراك بالبريد", path: "" },
      { label: "بيانات صحفية", path: "" },
    ],
  },
  {
    title: "شبكتنا",
    links: [
      { label: "مركز للدراسات", path: "" },
      { label: "معهد للإعلام", path: "" },
      { label: "تعلم العربية", path: "" },
      { label: "مركز للحريات العامة وحقوق الإنسان", path: "" },
    ],
  },
  {
    title: "قنواتنا",
    links: [
      { label: "الإخبارية", path: "" },
      { label: "الإنجليزية", path: "" },
      { label: "مباشر", path: "" },
      { label: "الوثائقية", path: "" },
    ],
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-auto">
      {/* Main Footer Wrapper */}
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:space-y-16 lg:px-8">
        {/* Top Border Line */}
        <hr className="border-t border-slate-200 mb-8 max-w-4xl mx-auto" />

        {/* Grid Layout for the Footer Sections */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Column 1: Logo and Social Media Links */}
          <div>
            {/* Logo */}
            <Image src={Logo} alt="Logo" width={160} height={40} className="w-40" />

            {/* Description under the logo */}
            <p className="mt-2 max-w-xs text-gray-500">تابعنا أيضا على وسائل التواصل الإجتماعى</p>

            {/* Social Media Links */}
            <ul className="mt-6 flex gap-4">
              {/* Loop over social links and render each item */}
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <Link href={social.path}>
                    <span className="text-main transition hover:opacity-75">
                      {/* Screen reader accessible text for social links */}
                      <span className="sr-only">{social.name}</span>
                      {social.icon}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2-4: Footer Links */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            {/* Loop over the footerLinks array to generate each column */}
            {footerLinks.map((column, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold">{column.title}</h3>
                <ul className="mt-4 space-y-4 text-sm text-gray-500">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.path}>
                        <span className="hover:text-main">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
