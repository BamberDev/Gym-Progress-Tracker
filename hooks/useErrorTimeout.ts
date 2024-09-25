import { useRef } from "react";

export const useErrorTimeout = (
  clearErrorCallback: () => void,
  delay: number = 5000
) => {
  const timeoutRef = useRef<number | null>(null);

  const clearErrorTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      clearErrorCallback();
      timeoutRef.current = null;
    }, delay);
  };

  const clearExistingTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return { clearErrorTimer, clearExistingTimer };
};
