"use client";

import { useEffect, useState } from "react";

type SetValue<T> = T | ((val: T) => T);

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: SetValue<T>) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Ensure the code runs only in the client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Get from localStorage by key
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
    }
  }, [key]);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: SetValue<T>) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        typeof value === "function" ? (value as (val: T) => T)(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
