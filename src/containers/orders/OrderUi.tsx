'use client'

import { useCallback, useEffect, useState } from 'react'

// Define the Order interface based on the provided schema
interface Order {
  _id?: string
  // fileId?: string
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
  const telegram = window.Telegram?.WebApp
  // Initialize Telegram Web App
  useEffect(() => {
    if (telegram) {
      telegram.ready()
      // Optionally, expand the Web App for better UX
      telegram.expand()
    }
  }, [])

  const onCheckOut = () => {
    if (telegram) {
      telegram.MainButton.text = 'Create Order'
      telegram.MainButton.color = '#4CAF50' // Green color
      telegram.MainButton.show()
    }
  }

  const handleSubmit = useCallback(() => {
    try {
      setLoading(true)
      setError('')
      if (telegram) {
        const orderData: Partial<Order> = {
          // fileId,
          pageCount,
          format: format || undefined,
          color: color || undefined,
          binding: binding || undefined,
          status: 'CREATING',
          notes: notes || undefined,
          address: address || undefined,
          createdBy:
            userId || window?.Telegram?.WebApp?.initDataUnsafe?.user?.id || '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        telegram.sendData(JSON.stringify({}))
        setPageCount(0)
        setFormat('')
        setColor('')
        setBinding('')
        setNotes('')
        setAddress('')
      }
    } catch (error) {
      setError('Failed to submit order')
    } finally {
      setLoading(false)
    }
  }, [pageCount, format, color, binding, notes, address, userId, telegram])

  useEffect(() => {
    if (telegram) {
      telegram.onEvent('mainButtonClicked', handleSubmit)
      return () => {
        telegram.offEvent('mainButtonClicked', handleSubmit)
      }
    }
  }, [handleSubmit, telegram])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-4 max-w-2xl w-full bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Book Printing Order
        </h1>

        <div>
          <label className="block text-sm font-medium">Page Count</label>
          <input
            type="number"
            value={pageCount}
            onChange={(e) => setPageCount(Number(e.target.value))}
            className="mt-1 block w-full border rounded p-2"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Format</label>
          <select
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
          <label className="block text-sm font-medium">Color</label>
          <select
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
          <label className="block text-sm font-medium">Binding</label>
          <select
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
          <label className="block text-sm font-medium">
            Notes (max 500 characters)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 500))}
            className="mt-1 block w-full border rounded p-2"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Delivery Address</label>
          <input
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
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400 w-full"
        >
          {loading ? 'Submitting...' : 'Submit Order'}
        </button>
      </div>
    </div>
  )
}
