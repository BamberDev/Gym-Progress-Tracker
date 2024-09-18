"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { MoveLeft } from "lucide-react";

export default function GoBackButton() {
  const pathname = usePathname();
  const path = pathname === "/dashboard" ? "/" : "/dashboard";

  return (
    <div className="absolute top-4 left-4">
      <Link href={path}>
        <Button variant="secondary">
          <MoveLeft className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}
