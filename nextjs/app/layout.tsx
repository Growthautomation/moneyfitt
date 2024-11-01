import Header from "@/components/header";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { HotJar } from "@/components/utils/hotjar";
import { Fira_Sans } from 'next/font/google'

// Define the font with its variations
const firaSans = Fira_Sans({
  weight: ['400', '700'],  // 400 for regular, 700 for bold
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-fira-sans',
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
    <html lang="en" className={`${firaSans.variable}`}>
      <head>
        <HotJar />
      </head>
      <body>
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
