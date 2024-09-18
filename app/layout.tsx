import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import { TimerCheckbox } from "@/components/TimerCheckbox";

export const metadata = {
  title: "Gym Progress Tracker",
  description: "Gym Progress Tracker",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className="bg-[#303030] min-h-screen">
          <div className="absolute top-4 right-4 z-10">
            <SignedIn>
              <UserButton
                appearance={{ elements: { avatarBox: "h-10 w-10" } }}
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
