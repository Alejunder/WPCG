// Font is loaded in the root layout (app/layout.tsx).
// This layout only provides locale context and navigation.

import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import Navbar from '@/features/shared/components/Navbar'
import SiteFooter from '@/features/legal/components/SiteFooter'
import { locales, type Locale } from '@/config/i18n'

async function getMessages(locale: Locale) {
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

  if (!hasLocale(locales, locale)) {
    notFound()
  }

  const typedLocale: Locale = locale
  const messages = await getMessages(typedLocale)

  return (
    <NextIntlClientProvider locale={typedLocale} messages={messages}>
      <Navbar locale={typedLocale} />
      {children}
      <SiteFooter locale={typedLocale} />
    </NextIntlClientProvider>
  )
}
