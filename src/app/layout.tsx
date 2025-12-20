import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar/Navbar'
import BottomNav from '@/components/BottomNav/BottomNav'
import Footer from '@/components/Footer/Footer';
import StoreProvider from '@/lib/StoreProvider'
import AuthSync from '@/lib/AuthSync'

const inter = Inter({ subsets: ['latin'] })
const outfit = Outfit({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'GlassFlowers | Premium Decor',
    template: '%s | GlassFlowers'
  },
  description: 'Elegant glassmorphic flower shop for your decor needs. Handcrafted crystal flowers that last forever.',
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: 'GlassFlowers | Premium Decor',
    description: 'Elegant glassmorphic flower shop for your decor needs.',
    url: baseUrl,
    siteName: 'GlassFlowers',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlassFlowers | Premium Decor',
    description: 'Elegant glassmorphic flower shop for your decor needs.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <StoreProvider>
          <AuthSync />
          <div className='w-full h-full backdrop-blur-sm'>
            <Navbar />
            <main style={{ minHeight: '80vh', paddingBottom: '0px' }}>
              {children}
            </main>
            <Footer />
            <BottomNav />
          </div>
        </StoreProvider>
      </body>
    </html>
  )
}
