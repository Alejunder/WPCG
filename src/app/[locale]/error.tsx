'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function LocaleError({ error, reset }: ErrorProps) {
  const t = useTranslations('ErrorPage')
  const params = useParams()
  const locale = typeof params?.locale === 'string' ? params.locale : 'en'

  useEffect(() => {
    console.error('[LocaleError]', error)
  }, [error])

  return (
    <main
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '4rem 1.5rem',
        fontFamily: 'var(--font-primary, Arial, sans-serif)',
        backgroundColor: 'var(--color-bg, #1D1A15)',
        color: 'var(--color-text, #BABDBE)',
        textAlign: 'center',
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
        {t('heading')}
      </h1>

      <p style={{ maxWidth: '36rem', lineHeight: 1.6, margin: 0 }}>{t('body')}</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '0.75rem 2rem',
            background: 'var(--color-accent-gold, #C3A466)',
            color: 'var(--color-bg, #1D1A15)',
            border: 'none',
            fontFamily: 'inherit',
            fontWeight: 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          {t('retry')}
        </button>

        <Link
          href={`/${locale}`}
          style={{
            padding: '0.75rem 2rem',
            background: 'transparent',
            color: 'var(--color-accent-gold, #C3A466)',
            border: '1px solid var(--color-accent-gold, #C3A466)',
            fontFamily: 'inherit',
            fontWeight: 500,
            fontSize: '0.9rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            letterSpacing: '0.04em',
          }}
        >
          {t('home')}
        </Link>
      </div>
    </main>
  )
}
