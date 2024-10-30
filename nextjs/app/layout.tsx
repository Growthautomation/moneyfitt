import Header from "@/components/header";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import Link from "next/link";
import { HotJar } from "@/components/utils/hotjar";
import { Fira_Sans } from 'next/font/google'

const firaSans = Fira_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

// TODO: add suspense for every page and high latency component so only that component show loading while the rest is visible

export const metadata = {
  title: "MoneyFitt Matchmaking Platform",
  description: "MoneyFitt Matchmaking Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={firaSans.className}>
      <head>
        <HotJar />
      </head>
      <body>
        <div className="absolute left-4 z-50 flex items-center h-[64px]">
          {" "}
          {/* Adjusted positioning */}
          <Link href="/">
            <Image
              src="/moneyfitt-logo.webp"
              alt="Logo"
              width={200}
              height={80}
              quality={100}
            />
          </Link>
        </div>
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
