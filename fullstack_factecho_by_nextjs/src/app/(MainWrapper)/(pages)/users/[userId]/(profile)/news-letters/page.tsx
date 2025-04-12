import economyNewsletters from "@/assets/economyNewsletters.webp";
import politicsNewsletters from "@/assets/politicsNewsletters.webp";
import sportsNewsletters from "@/assets/sportsNewsletters.webp";
import Image, { StaticImageData } from "next/image";

interface NewsletterCardProps {
  title: string;
  description: string;
  image: StaticImageData;
}

export default function NewslettersPage() {
  const newsletters = [
    {
      title: "النشرة البريدية الأسبوعية: اقتصاد",
      description: "أخبار المال والأعمال بين يديك من الجزيرة نت",
      image: economyNewsletters,
    },
    {
      title: "النشرة البريدية الأسبوعية: سياسة",
      description: "حصاد سياسي من الجزيرة في فهم ملفات المنطقة والعالم",
      image: politicsNewsletters,
    },
    {
      title: "النشرة البريدية الأسبوعية: رياضة",
      description: "نقل لك أهداف المباريات وجديد الرياضة",
      image: sportsNewsletters,
    },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {newsletters.map((newsletter, index) => (
        <NewsletterCard
          key={index}
          title={newsletter.title}
          description={newsletter.description}
          image={newsletter.image}
        />
      ))}
    </div>
  );
}

const NewsletterCard = ({ title, description, image }: NewsletterCardProps) => (
  <div className="rounded-lg p-4 flex items-center gap-4 border border-slate-200">
    <Image
      src={image}
      alt={title}
      className="w-30 h-30 rounded-lg object-cover"
      width={120}
      height={120}
    />
    <div className="flex-1 text-right">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <button className="mt-2 text-primaryColor">
        <span className="text">+ </span>
        <span>اشترك الآن</span>
      </button>
    </div>
  </div>
);
