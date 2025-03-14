import Image from "next/image";
import Link from "next/link";

import facebook from "../../../../../assets/socialMedia/facebook.webp";
import instagram from "../../../../../assets/socialMedia/instagram.webp";
import twitter from "../../../../../assets/socialMedia/twitter.webp";
import youtube from "../../../../../assets/socialMedia/youtube.webp";

const SocialMediaLinks = () => {
  return (
    <section aria-labelledby="normal-collection-1" role="region" className="w-full">
      <h2 className="pb-3 mb-6 border-b border-slate-200 font-bold text-2xl flex items-center gap-2">
        <span className="block w-3 h-3 bg-primaryColor rounded-full"></span>
        مواقعنا على وسائل التواصل الاجتماعي
      </h2>

      <div data-testid="curation-grid-normal">
        <ul
          role="list"
          data-testid="topic-promos"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Facebook */}
          <li className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <div className="w-full h-40 relative overflow-hidden rounded-lg">
                <Image
                  src={facebook}
                  alt="Facebook logo"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  width={160}
                  height={160}
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  <Link
                    href="https://www.facebook.com/BBCnewsArabic"
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    فيسبوك | FactEcho@
                  </Link>
                </h3>
              </div>
            </div>
          </li>

          {/* Twitter/X */}
          <li className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <div className="w-full h-40 relative overflow-hidden rounded-lg">
                <Image
                  src={twitter}
                  alt="Twitter/X"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  width={160}
                  height={160}
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  <Link
                    href="https://twitter.com/BBCArabic"
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    إكس | FactEcho@
                  </Link>
                </h3>
              </div>
            </div>
          </li>

          {/* Instagram */}
          <li className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <div className="w-full h-40 relative overflow-hidden rounded-lg">
                <Image
                  src={instagram}
                  alt="Instagram"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  width={160}
                  height={160}
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  <Link
                    href="https://www.instagram.com/bbcarabic/"
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    إنستغرام | FactEcho@
                  </Link>
                </h3>
              </div>
            </div>
          </li>

          {/* YouTube */}
          <li className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <div className="w-full h-40 relative overflow-hidden rounded-lg">
                <Image
                  src={youtube}
                  alt="YouTube"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  width={160}
                  height={160}
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  <Link
                    href="https://www.youtube.com/bbcarabic"
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    يوتيوب | FactEcho@
                  </Link>
                </h3>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default SocialMediaLinks;
