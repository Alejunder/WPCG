// Font is loaded in the root layout (app/layout.tsx).
// This layout only provides locale context, navigation, and page transitions.

import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import Navbar from '@/features/shared/components/Navbar'
import PageTransition from '@/features/shared/motion/PageTransition'
import { SceneTransitionProvider } from '@/features/shared/motion/SceneTransitionContext'
import SceneWipe from '@/features/shared/motion/SceneWipe'
import type { Locale } from '@/config/i18n'

const LOCALES = ['en', 'es'] as const

async function getMessages(locale: 'en' | 'es') {
  switch (locale) {
    case 'en':
      return (await import('../../../messages/en.json')).default
    case 'es':
      return (await import('../../../messages/es.json')).default
  }
}

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) {
    notFound()
  }

  const typedLocale = locale as Locale
  const messages = await getMessages(typedLocale)

  return (
    <NextIntlClientProvider locale={typedLocale} messages={messages}>
      <SceneTransitionProvider>
        {/* SceneWipe sits at fixed z=9999 — above all page content */}
        <SceneWipe />
        <Navbar locale={typedLocale} />
        <PageTransition>{children}</PageTransition>
      </SceneTransitionProvider>
    </NextIntlClientProvider>
  )
}
