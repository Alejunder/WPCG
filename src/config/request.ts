import { getRequestConfig } from 'next-intl/server'

const locales = ['en', 'es'] as const

async function getMessages(locale: string) {
  switch (locale) {
    case 'es':
      return (await import('../../messages/es.json')).default
    default:
      return (await import('../../messages/en.json')).default
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = locales.includes(requested as (typeof locales)[number]) ? requested! : 'en'

  return {
    locale,
    messages: await getMessages(locale),
  }
})
