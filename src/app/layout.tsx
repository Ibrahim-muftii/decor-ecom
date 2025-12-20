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

export const metadata: Metadata = {
  title: 'GlassFlowers | Premium Decor',
  description: 'Elegant glassmorphic flower shop for your decor needs.',
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
