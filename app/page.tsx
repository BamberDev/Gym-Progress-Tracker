import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

export default function Home() {
  const { userId } = auth();

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
      <div className="flex flex-col items-center justify-center text-center mx-4 py-16 sm:mx-0 text-white relative z-10 bg-[#1f1f23] rounded-2xl border border-[#26252a]">
        <Image
          src="/Gym-Logo.png"
          alt="Gym-Progress-Logo"
          width={200}
          height={200}
          className="shadow-2xl shadow-black rounded-full"
          priority
        />
        <h1 className="m-4 text-4xl font-bold">Gym Progress Tracker</h1>
        <p className="mb-4 text-xl">Track the Grind. Celebrate the Gains.</p>
        {userId ? (
          <Link href="/dashboard">
            <Button size="lg" variant="secondary">
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/sign-in">
            <Button size="lg" variant="secondary">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
