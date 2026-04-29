'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * global-error.tsx replaces the root layout entirely, so it must render
 * its own <html> and <body> tags. It cannot use next-intl or any provider
 * that depends on the locale layout — plain English fallback text is used.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          padding: '4rem 1.5rem',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#1D1A15',
          color: '#BABDBE',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: '#fff',
            margin: 0,
          }}
        >
          Something went wrong
        </h1>

        <p style={{ maxWidth: '36rem', lineHeight: 1.6, margin: 0 }}>
          An unexpected error occurred. You can try again or visit the site directly.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 2rem',
              background: '#C3A466',
              color: '#1D1A15',
              border: 'none',
              fontFamily: 'inherit',
              fontWeight: 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            Try again
          </button>

          <a
            href="/en"
            style={{
              padding: '0.75rem 2rem',
              background: 'transparent',
              color: '#C3A466',
              border: '1px solid #C3A466',
              fontFamily: 'inherit',
              fontWeight: 500,
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              letterSpacing: '0.04em',
            }}
          >
            Go home
          </a>
        </div>
      </body>
    </html>
  )
}
