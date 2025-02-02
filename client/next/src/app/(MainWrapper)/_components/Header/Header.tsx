"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Logo from "../../../../assets/Logo.svg";
import { StoreState } from "../../../../store/store";
import DropdownCategories from "./DropdownCategories";
import DropdownUser from "./DropdownUser";

// Header links for navigation (used in both desktop and mobile view)
const headerLinks = [
  { label: "الرئيسية", path: "/" }, // Home link
  { label: "مقترح", path: "/explore" }, // Explore link
  { label: "ترند", path: "/trend" }, // Trend link
  { label: "جديد", path: "/latest" }, // Latest link
];

// Header component (Memoized for performance optimization)
const Header: React.FC = () => {
  const pathname = usePathname();
  const accessToken = useSelector((state: StoreState) => state.accessToken);

  // State to toggle sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Handle closing sidebar when pathname changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1">
      <div className="w-full shadow-2">
        <div className="flex flex-grow items-center justify-between max-w-7xl mx-auto px-4 py-2  md:px-6 2xl:px-11">
          {/* Logo section with navigation to home */}
          <Link href="/">
            <Image src={Logo} alt="Logo" className="w-34 bg-none" />
          </Link>

          {/* Desktop view navigation (hidden on small screens) */}
          <div className="hidden lg:flex gap-4">
            {/* Map through headerLinks and display each link */}
            {headerLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="hover:text-primaryColor hover:underline transition duration-300"
              >
                {link.label}
              </Link>
            ))}

            <DropdownCategories />
          </div>

          {/* Desktop search form (hidden on small screens) */}
          <div className="hidden lg:block">
            <SearchForm />
          </div>

          {/* Auth status and Toggle button */}
          <div className="flex items-center gap-2">
            {/* Conditional rendering based on the current user's login status */}
            {accessToken && accessToken !== "" ? (
              <div className="flex items-center gap-3 2xsm:gap-7 z-100">
                {/* DropdownUser component, displayed when the user is not logged in */}
                <DropdownUser />
              </div>
            ) : (
              // Login link displayed when user is logged in
              <Link
                href="/auth"
                className="flex items-center bg-primaryColor text-white py-2 px-4 rounded"
              >
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h12m0 0l-3.75 3.75M21 12l-3.75-3.75M3 12h12"
                  />
                </svg>
                تسجيل
              </Link>
            )}

            {/* Sidebar toggle button for mobile view */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-mainGreyColor"
              aria-label="Toggle Sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Sidebar for small screens */}
          <div
            className={`fixed inset-0 bg-white z-1 transform transition-transform h-screen overflow-auto top-14 ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            } lg:hidden`}
          >
            <div className="flex flex-col items-center pt-20">
              {/* Map through headerLinks and display each link */}
              {headerLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="hover:text-primaryColor hover:underline py-2"
                >
                  {link.label}
                </Link>
              ))}

              <DropdownCategories />

              <br />

              {/* Mobile search form */}
              <SearchForm />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// SearchForm component to handle search functionality
const SearchForm: React.FC = () => {
  const [searchKey, setSearchKey] = useState<string>(""); // Managing the search input state

  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        if (searchKey) window.location.href = `/articles/search?searchKey=${searchKey}`; // Navigate to the search results page
      }}
    >
      <button
        type="submit"
        title="search"
        className="absolute inset-y-0 ltr:inset-r-0 flex items-center justify-center text-white bg-primaryColor rounded-md w-6 h-6 top-[3px] end-1"
      >
        <svg
          className="w-3 h-3 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </button>
      <input
        type="text"
        className="block p-1 px-2 pe-10 text-sm text-gray-900 border border-slate-400 outline-none placeholder:text-sm
                rounded-lg w-60 bg-gray-50 dark:bg-transparent focus:border-slate-500 dark:placeholder-gray-900"
        placeholder="ابحث عن موضوع"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)} // Update the searchKey state as user types
      />
    </form>
  );
};

export default Header;
