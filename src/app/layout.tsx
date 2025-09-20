import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import TelegramWrapper from '../containers/telegramWrapper/TelegramWrapper' // Adjust path as needed
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Virtual Printer Telegram App',
  description: 'A Telegram Web App for printing books',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js?59"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TelegramWrapper>{children}</TelegramWrapper>
      </body>
    </html>
  )
}
