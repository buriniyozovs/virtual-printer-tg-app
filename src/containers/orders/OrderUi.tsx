'use client'

import { useCallback, useEffect, useState } from 'react'

// Define Telegram Web App types (should be in app/types/telegram.d.ts)
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
  initDataUnsafe: {
    user?: {
      id: string
      first_name?: string
      last_name?: string
    }
  }
}

interface Order {
  _id?: string
  fileId?: string // Reintroduced fileId
  pageCount: number
  format?: string
  color?: string
  binding?: string
  status:
    | 'CREATING'
    | 'CREATED'
    | 'PRINTING'
    | 'PRINTED'
    | 'ACCEPTED'
    | 'DELIVERING'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'COMPLETED'
  notes?: string
  address?: string
  location?: {
    latitude: number
    longitude: number
  }
  price?: number
  companyId?: string
  courierId?: string
  createdBy: string
  updatedAt: number
  createdAt: number
}

interface OrderUiProps {
  userId?: string
}

export default function OrderUi({ userId }: OrderUiProps) {
  const [pageCount, setPageCount] = useState<number>(0)
  const [format, setFormat] = useState<string>('')
  const [color, setColor] = useState<string>('')
  const [binding, setBinding] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const [telegram, setTelegram] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      setTelegram(window.Telegram.WebApp)
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
    }
  }, [])

  const onCheckOut = () => {
    console.log('Check Out clicked')
    if (telegram) {
      telegram.MainButton.text = 'Create Order'
      telegram.MainButton.color = '#4CAF50'
      telegram.MainButton.show()
    }
  }

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (pageCount <= 0) {
        setError('Page count is required')
        return
      }

      const orderData: Partial<Order> = {
        pageCount,
        format: format || undefined,
        color: color || undefined,
        binding: binding || undefined,
        status: 'CREATING',
        notes: notes || undefined,
        address: address || undefined,
        createdBy: userId || telegram?.initDataUnsafe?.user?.id || '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      console.log('Sending order data:', orderData)

      if (telegram) {
        telegram.sendData(JSON.stringify(orderData))
      }

      // Reset form
      setPageCount(0)
      setFormat('')
      setColor('')
      setBinding('')
      setNotes('')
      setAddress('')

      if (telegram) {
        telegram.MainButton.hide()
      }
    } catch (err) {
      setError('Failed to submit order')
      console.error('Submission error:', err)
    } finally {
      setLoading(false)
    }
  }, [pageCount, format, color, binding, notes, address, userId, telegram])

  useEffect(() => {
    if (telegram) {
      const handleMainButtonClick = () => {
        console.log('MainButton clicked') // Debug log
        handleSubmit()
      }

      telegram.onEvent('mainButtonClicked', handleMainButtonClick)
      console.log('MainButton event listener attached') // Debug log

      return () => {
        telegram.offEvent('mainButtonClicked', handleMainButtonClick)
        console.log('MainButton event listener removed') // Debug log
      }
    }
  }, [handleSubmit, telegram])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-4 max-w-2xl w-full bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Book Printing Order
        </h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="pageCount" className="block text-sm font-medium">
              Page Count
            </label>
            <input
              id="pageCount"
              type="number"
              value={pageCount}
              onChange={(e) => setPageCount(Number(e.target.value))}
              className="mt-1 block w-full border rounded p-2"
              required
              min="1"
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="format" className="block text-sm font-medium">
              Format
            </label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="">Select Format</option>
              <option value="A4">A4</option>
              <option value="A5">A5</option>
              <option value="Letter">Letter</option>
            </select>
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium">
              Color
            </label>
            <select
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="">Select Color</option>
              <option value="Color">Color</option>
              <option value="Black & White">Black & White</option>
            </select>
          </div>

          <div>
            <label htmlFor="binding" className="block text-sm font-medium">
              Binding
            </label>
            <select
              id="binding"
              value={binding}
              onChange={(e) => setBinding(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="">Select Binding</option>
              <option value="Softcover">Softcover</option>
              <option value="Hardcover">Hardcover</option>
              <option value="Spiral">Spiral</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium">
              Notes (max 500 characters)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 500))}
              className="mt-1 block w-full border rounded p-2"
              rows={4}
              maxLength={500}
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium">
              Delivery Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            onClick={onCheckOut}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400 w-full cursor-pointer mt-4"
            aria-label="Submit order"
          >
            {loading ? 'Submitting...' : 'Submit Order'}
          </button>
        </div>
      </div>
    </div>
  )
}
