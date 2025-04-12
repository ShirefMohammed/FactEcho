import Head from "next/head";
import Link from "next/link";

interface AdminBreadcrumbProps {
  pageName: string;
}

const AdminBreadcrumb = ({ pageName }: AdminBreadcrumbProps) => {
  return (
    <>
      <Head>
        <title>{pageName} - Admin Panel</title>
        <meta name="description" content={`Admin page for ${pageName}`} />
      </Head>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">{pageName}</h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/admin" className="font-medium">
                Admin /
              </Link>
            </li>
            <li className="font-medium text-primary">{pageName}</li>
          </ol>
        </nav>
      </div>
    </>
  );
};

export default AdminBreadcrumb;
