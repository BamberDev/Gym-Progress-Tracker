import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
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
        <SignIn />
      </div>
    </div>
  );
}
