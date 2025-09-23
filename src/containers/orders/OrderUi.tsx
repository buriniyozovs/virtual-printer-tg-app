'use client'

import uploadFileMultipart from '@/services/handleMultipartUpload'
import { PlusOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, Form, Input, message, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload'
import { useCallback, useEffect, useState } from 'react'
import { Upload } from '../../components/upload/Upload'

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
export interface CustomUploadFileProps extends UploadFile {
  uid: string
  size?: number
  name: string
  status?: 'error' | 'done' | 'uploading' | 'removed'
  url?: string
  type?: string
  thumbUrl?: string
}

export interface CustomUploadProps extends UploadProps {
  name?: string
  fileList?: Array<CustomUploadFileProps>
  beforeUploadFile?: CustomUploadFileProps
  action?:
    | string
    | ((file: RcFile) => string)
    | ((file: RcFile) => PromiseLike<string>)
  multiple?: boolean
  accept?: string
  onChange?: (info: UploadChangeParam<CustomUploadFileProps>) => void
  className?: string
  onPreview?: (file: CustomUploadFileProps) => void
}

interface OrderUiProps {
  userId: string
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
  const [fileList, setFileList] = useState<CustomUploadFileProps[]>([])
  const [file, setFile] = useState<File[]>([])
  const [mediaId, setMediaId] = useState<string>('')
  const [telegram, setTelegram] = useState<any>(null)
  const [uploadProgress, setUploadProgress] = useState<{
    file: number
  }>({ file: 0 })

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      setTelegram(window.Telegram.WebApp)
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
    }
  }, [])

  const onCheckOut = () => {
    if (telegram) {
      telegram.MainButton.text = 'Create Order'
      telegram.MainButton.color = '#4CAF50'
      telegram.MainButton.show()
    }
  }

  const handleUpdateProgress = (type: 'file', progress: number) => {
    setUploadProgress((prev) => ({
      ...prev,
      [type]: progress,
    }))
  }

  const uploadFile = useCallback(async () => {
    setLoading(true)
    if (!file) return null
    try {
      const fileData = await uploadFileMultipart(file[0], userId, (progress) =>
        handleUpdateProgress('file', progress)
      )
      message.success('File uploaded successfully')
      setPageCount(fileData.pageCount || 0)
      setMediaId(fileData.mediaId || '')
      setFile([])
    } catch (error) {
      console.error('Failed to upload file: ', error)
      message.error('Failed to upload file')
      return null
    } finally {
      setLoading(false)
      setUploadProgress({ file: 0 })
    }
  }, [file])

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
        fileId: mediaId || undefined,
        pageCount,
        format: format || undefined,
        color: color || undefined,
        binding: binding || undefined,
        status: 'CREATING',
        notes: notes || undefined,
        address: address || undefined,
        createdBy: userId || telegram?.initDataUnsafe?.user?.id || '',
      }

      // if (telegram) {
      telegram.sendData(JSON.stringify(orderData))
      // }

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
        handleSubmit()
      }

      telegram.onEvent('mainButtonClicked', handleMainButtonClick)

      return () => {
        telegram.offEvent('mainButtonClicked', handleMainButtonClick)
      }
    }
  }, [handleSubmit, telegram])

  return (
    <div className="py-6 top-0 left-0 w-full h-full bg-gray-100 z-50 flex items-center justify-center">
      <Form
        layout="vertical"
        className="flex flex-col justify-center items-center w-[95vw] sm:max-w-lg md:max-w-xl"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Book Printing Order
        </h1>
        <div className="space-y-1 w-full">
          <Form.Item label="Upload File" required>
            <Upload
              listType="text"
              accept=".docx,.pdf"
              maxCount={1}
              multiple={false}
              fileList={fileList}
              onChange={async (info) => {
                const { fileList, file } = info
                if (file.status === 'removed') {
                  setFileList((prev) =>
                    prev ? prev.filter((doc) => doc.uid !== file.uid) : []
                  )
                  setFile((prev) =>
                    prev ? prev.filter((doc) => doc.name !== file.name) : []
                  )

                  return
                }

                setFileList(
                  fileList.map((file) => ({
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    url:
                      file.url ||
                      (file.originFileObj
                        ? URL.createObjectURL(file.originFileObj)
                        : ''),
                    thumbUrl:
                      file.url ||
                      (file.originFileObj
                        ? URL.createObjectURL(file.originFileObj)
                        : ''),
                  }))
                )

                if (file.originFileObj && file.originFileObj != undefined) {
                  setFile((prev) => {
                    const fileExists = prev.some(
                      (existingFile) =>
                        existingFile.name === file.name &&
                        existingFile.size === file.originFileObj?.size
                    )
                    return fileExists
                      ? prev
                      : [
                          ...prev,
                          ...(file.originFileObj ? [file.originFileObj] : []),
                        ]
                  })
                }
              }}
            >
              {file.length == 0 && fileList.length == 0 && (
                <Button className="w-full border rounded flex flex-row items-center justify-center p-4">
                  <PlusOutlined />
                  <div>Upload</div>
                </Button>
              )}
            </Upload>
            {file.length > 0 && (
              <Button
                onClick={uploadFile}
                disabled={file.length == 0 || uploadProgress.file > 0}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 w-full cursor-pointer"
              >
                {uploadProgress.file > 0 ? 'Uploading...' : 'Upload File'}
              </Button>
            )}
            {uploadProgress.file > 0 && uploadProgress.file < 100 && (
              <p>Upload Progress: {uploadProgress.file}%</p>
            )}
          </Form.Item>

          <Form.Item label="Page Count" required>
            <Input
              id="pageCount"
              type="number"
              value={pageCount}
              onChange={(e) => setPageCount(Number(e.target.value))}
              className="w-full border rounded"
              required
              min="1"
              aria-required="true"
            />
          </Form.Item>

          <Form.Item label="Format" required>
            <Select
              id="format"
              value={format}
              onChange={(value) => setFormat(value)}
              className="w-full border rounded"
              options={[
                { label: 'A4', value: 'A4' },
                { label: 'A5', value: 'A5' },
              ]}
            />
          </Form.Item>

          <Form.Item label="Color" required>
            <Select
              id="color"
              value={color}
              onChange={(value) => setColor(value)}
              className="w-full border rounded"
              options={[
                { label: 'Color', value: 'Color' },
                { label: 'Black & White', value: 'Black & White' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Binding" required>
            <Select
              id="binding"
              value={binding}
              onChange={(value) => setBinding(value)}
              className="w-full border rounded"
              options={[
                { label: 'Softcover', value: 'Softcover' },
                { label: 'Hardcover', value: 'Hardcover' },
                { label: 'Spiral', value: 'Spiral' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Notes" required>
            <TextArea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 500))}
              className="w-full border rounded"
              rows={4}
              maxLength={500}
            />
          </Form.Item>
          <Form.Item label="Address" required>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded"
            />
          </Form.Item>

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
      </Form>
    </div>
  )
}
