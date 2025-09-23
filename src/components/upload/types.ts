import type { GetProp, UploadFile, UploadProps } from 'antd'
import { UploadChangeParam, RcFile } from 'antd/es/upload'

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export interface CustomUploadProps extends UploadProps {
  maxCount?: number
  multiple?: boolean
  accept?: string
  onChange?: (info: UploadChangeParam<CustomUploadFileProps>) => void
  className?: string
  onPreview?: (file: CustomUploadFileProps) => void
  name?: string
  fileList?: Array<CustomUploadFileProps> | undefined
  beforeUploadFile?: CustomUploadFileProps
  action?:
    | string
    | ((file: RcFile) => string)
    | ((file: RcFile) => PromiseLike<string>)
}

export interface CustomUploadFileProps extends UploadFile {
  uid: string
  size?: number
  name: string
  status?: 'error' | 'done' | 'uploading' | 'removed'
  url?: string
  type?: string
  thumbUrl?: string
  originFileObj?: RcFile
}
