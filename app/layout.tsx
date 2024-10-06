import Header from '@/components/header'
import '@/styles/globals.css'
import Image from 'next/image'
import Link from 'next/link'

// TODO: add suspense for every page and high latency component so only that component show loading while the rest is visible

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="absolute top-4 left-4 z-50">
          <Link href="/">
            <Image 
              src="/Full_colored@2x.webp" 
              alt="Logo" 
              width={200} 
              height={80} 
              quality={100}
            />
          </Link>
        </div>
        <Header />
        {children}
      </body>
    </html>
  )
}
