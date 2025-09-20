'use client'

import Script from 'next/script'
import { ReactNode, useEffect, useState } from 'react'

export default function TelegramWrapper({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
    }
  }, [])

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js?59"
        strategy="lazyOnload"
        onLoad={() => console.log('Telegram Web App SDK loaded')}
        onError={() => console.error('Failed to load Telegram Web App SDK')}
      />
      {isClient && children}
    </>
  )
}
