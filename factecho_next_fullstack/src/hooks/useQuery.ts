"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Custom hook to extract query parameters from the URL.
 * Uses the `useSearchParams` hook from Next.js for client-side query parameter access.
 *
 * @returns {Record<string, string>} An object containing the query parameters as key-value pairs.
 * The value is always a string (even if the query parameter has multiple values).
 *
 * @example
 * const query = useQuery();
 * console.log(query); // { search: "keyword", page: "2" }
 */
const useQuery = (): Record<string, string> => {
  // Return empty object during SSR
  if (typeof window === "undefined") return {};

  const searchParams = useSearchParams();
  return useMemo(() => {
    const queryObj: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });
    return queryObj;
  }, [searchParams]);
};

export default useQuery;
