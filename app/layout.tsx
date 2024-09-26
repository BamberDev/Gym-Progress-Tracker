import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import { TimerCheckbox } from "@/components/TimerCheckbox";
import { Metadata } from "next";

export const generateThemeColor = () => ({
  color: "#303030",
});

export const generateViewport = () => ({
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
});

export const metadata: Metadata = {
  title: "Gym Progress Tracker",
  description:
    "Track your gym workouts, set goals, and monitor your fitness progress with ease.",
  keywords: ["gym", "fitness", "workout", "progress tracker", "exercise"],
  authors: [{ name: "Kevin" }],
  creator: "Kevin",
  publisher: "Gym Progress Tracker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Gym Progress Tracker",
    description:
      "Track your gym workouts, set goals, and monitor your fitness progress with ease.",
    url: "https://gym-progress-tracker-v1.vercel.app/",
    siteName: "Gym Progress Tracker",
    images: [
      {
        url: "https://gym-progress-tracker-v1.vercel.app/Gym-Logo.png",
        width: 560,
        height: 485,
        alt: "Gym Progress Tracker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  category: "Fitness",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className="bg-[#303030] min-h-svh">
          <div className="absolute top-4 right-4 z-10">
            <SignedIn>
              <UserButton
                appearance={{
                  elements: { avatarBox: "h-10 w-10 border-2 border-white" },
                }}
              />
            </SignedIn>
          </div>
          <TimerCheckbox />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
