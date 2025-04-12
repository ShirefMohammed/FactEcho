"use client";

import { useEffect } from "react";

import useLocalStorage from "./useLocalStorage";

const useColorMode = () => {
  // Use lazy state initialization to avoid SSR issues
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure we're in the client

    const className = "dark";
    const bodyClass = document.body.classList;

    colorMode === "dark" ? bodyClass.add(className) : bodyClass.remove(className);
  }, [colorMode]);

  return [colorMode, setColorMode] as const;
};

export default useColorMode;
