'use client'

import Script from 'next/script'
import { ReactNode, useEffect } from 'react'

export default function TelegramWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
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
      {children}
    </>
  )
}
