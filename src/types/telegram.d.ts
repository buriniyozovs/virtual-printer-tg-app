// app/types/telegram.d.ts
interface TelegramWebApp {
  ready: () => void
  expand: () => void
  initDataUnsafe: {
    user?: {
      id: string
      first_name?: string
      last_name?: string
    }
  }
  MainButton: {
    text: string
    color: string
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
  }
  sendData: (data: string) => void
  onEvent: (event: string, callback: () => void) => void
  offEvent: (event: string, callback: () => void) => void
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp
  }
}
