import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'

const handle = createMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
})

export function proxy(request: NextRequest) {
  return handle(request)
}

export const config = {
  matcher: [
    // Match all pathnames except Next.js internals and static files
    '/((?!_next|_vercel|api|sanity-studio|.*\\..*).*)',
  ],
}
