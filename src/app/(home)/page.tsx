'use client'

import { useEffect, useState } from 'react'

// interface HomePageProps {
// searchParams: Promise<{ [key: string]: string | undefined }>
// }
interface TelegramWebApp {
  ready: () => void
  expand: () => void
  MainButton: {
    text: string
    color: string
    show: () => void
    hide: () => void
  }
  sendData: (data: string) => void
  onEvent: (event: string, callback: () => void) => void
  offEvent: (event: string, callback: () => void) => void
}
export default async function Home() {
  // import { useEffect, useState } from 'react'

  // Define Telegram Web App types

  const [telegram, setTelegram] = useState<TelegramWebApp | null>(null)

  // Initialize Telegram WebApp
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp
      setTelegram(webApp)
      webApp.ready()
      webApp.expand()
      webApp.MainButton.text = 'Send Hello'
      webApp.MainButton.color = '#4CAF50'
      webApp.MainButton.show()
    }
  }, [])

  // Handle MainButton click
  useEffect(() => {
    if (telegram) {
      const handleMainButtonClick = () => {
        telegram.sendData('hello')
      }

      telegram.onEvent('mainButtonClicked', handleMainButtonClick)

      return () => {
        telegram.offEvent('mainButtonClicked', handleMainButtonClick)
      }
    }
  }, [telegram])

  return null // Component doesn't render any UI, as MainButton is controlled by Telegram WebApp
}
// const resolvedSearchParams = await searchParams

// return <OrderUi userId={resolvedSearchParams.userId} />
// }
