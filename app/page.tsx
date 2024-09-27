import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Gym Progress Tracker",
  description:
    "Home page of Gym Progress Tracker. Track your gym workouts, set goals, and monitor your fitness progress with ease.",
};

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
      <div className="flex flex-col items-center justify-center text-center mx-4 py-16 sm:mx-0 text-white z-10 bg-[#1f1f23] rounded-2xl border border-[#26252a]">
        <Image
          src="/Gym-Logo.webp"
          alt="Gym-Progress-Logo"
          width={200}
          height={173}
          className="shadow-2xl shadow-black rounded-full"
          priority
        />
        <h1 className="m-4 text-4xl font-bold">Gym Progress Tracker</h1>
        <p className="mb-4 text-xl">Track the Grind. Celebrate the Gains.</p>
        {userId ? (
          <Link href="/dashboard">
            <Button type="button" size="lg" variant="secondary">
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/sign-in">
            <Button type="button" size="lg" variant="secondary">
              Sign In
            </Button>
          </Link>
        )}
      </div>
      <Link
        href="https://github.com/BamberDev/Gym-Progress-Tracker"
        className="absolute bottom-2 text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        <p>Gym Progress Tracker | &copy; {new Date().getFullYear()}</p>
      </Link>
    </div>
  );
}
