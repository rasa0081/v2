'use client'

import { usePathname } from 'next/navigation'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ThemeRegistry from '@/components/ThemeRegistry'
import QueryProvider from '@/components/QueryProvider'
import { CartProvider } from '@/context/CartContext'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const isHomePage = pathname === '/'

  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{isAdminRoute ? 'مدیریت کافه' : 'کافه کاریبو | Caribou Cafe'}</title>
        <meta name="description" content="Life is short, stay awake for it" />
        <meta name="theme-color" content="#5D4037" />
      </head>
      <body>
        <QueryProvider>
          <ThemeRegistry>
            <CartProvider>
              {!isAdminRoute && <Navbar />}
              
              <main style={{ 
                paddingTop: isAdminRoute ? 0 : isHomePage ? 0 : 72,
                minHeight: '100vh',
              }}>
                {children}
              </main>
              
              {!isAdminRoute && <Footer />}
            </CartProvider>
          </ThemeRegistry>
        </QueryProvider>
      </body>
    </html>
  )
}