import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-primary',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | WPCG',
    default: 'WPCG — Architecture & Interior Design · Madrid',
  },
  description:
    'Work Place Consulting Group — premium corporate architecture and interior design firm based in Madrid.',
}

// getLocale() reads the locale resolved by next-intl's request config
// (src/config/request.ts). For locale routes it comes from the URL; for
// other routes (e.g. /sanity-studio) it falls back to 'en'.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={montserrat.variable}>
      {/*
        suppressHydrationWarning on <body> silences mismatches caused by browser
        extensions (e.g. Grammarly, ColorZilla) that inject attributes at runtime.
      */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
