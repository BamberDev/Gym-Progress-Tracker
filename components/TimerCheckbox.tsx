"use client";

import { useEffect, useState } from "react";
import { GymTimer } from "@/components/GymTimer";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export function TimerCheckbox() {
  const [hideTimer, setHideTimer] = useState(false);
  const { isLoaded } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    const savedTimerState = localStorage.getItem("hideTimer");
    if (savedTimerState !== null) {
      setHideTimer(JSON.parse(savedTimerState));
    }
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setHideTimer(isChecked);

    if (isChecked) {
      localStorage.setItem("hideTimer", "true");
    } else {
      localStorage.removeItem("hideTimer");
    }
  };

  const isGroupPage = /^\/group\/\w+$/.test(pathname);

  if (!isLoaded || (pathname !== "/dashboard" && !isGroupPage)) return null;

  return (
    <div className="flex flex-row-reverse items-center justify-center pt-6">
      <input
        type="checkbox"
        id="hideTimer"
        checked={hideTimer}
        onChange={handleCheckboxChange}
        className="h-5 w-5 ml-2"
      />
      <label htmlFor="hideTimer" className="text-white text-nowrap">
        Hide Timer
      </label>
      {!hideTimer && <GymTimer />}
    </div>
  );
}
