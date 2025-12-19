import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar/Navbar'
import BottomNav from '@/components/BottomNav/BottomNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GlassFlowers | Premium Decor',
  description: 'Elegant glassmorphic flower shop for your decor needs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='w-full h-full backdrop-blur-sm'>
          <Navbar />
          <main style={{ minHeight: '80vh', paddingBottom: '80px' }}>
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
