import { message, Upload } from 'antd'
import { CustomUploadFileProps, FileType } from '../types'

export const convertToBase64 = (file: CustomUploadFileProps) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    if (file instanceof Blob) {
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    } else {
      reject(new Error('File is not of type Blob or File.'))
    }
  })
}

export const beforeFileUpload = (
  file: FileType
): boolean | Promise<void> | string => {
  const isValidType =
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/pdf'
  if (!isValidType) {
    message.error('You can only upload PDF or DOCX files!')
    return false || Upload.LIST_IGNORE
  }

  const isLt500M = file.size / 1024 / 1024 < 500
  if (!isLt500M) {
    message.error('File must be smaller than 500MB!')
    return false || Upload.LIST_IGNORE
  }
  return isValidType && isLt500M
}
