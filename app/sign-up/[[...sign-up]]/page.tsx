import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="relative min-h-svh flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/gym-bg-image.webp"
          alt="Background Image"
          fill
          className="blur-[6px] object-cover"
          priority
        />
      </div>
      <div className="relative z-10">
        <SignUp />
      </div>
    </div>
  );
}
