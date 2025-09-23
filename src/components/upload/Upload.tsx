import { Upload as AntdUpload } from 'antd'
import { FC } from 'react'
import { beforeFileUpload } from './hooks/hooks'
import { CustomUploadProps, FileType } from './types'

export const Upload: FC<CustomUploadProps> = ({
  listType = 'text',
  accept,
  children,
  onChange,
  fileList,
  disabled,
  multiple,
  maxCount,
}) => {
  return (
    <>
      <AntdUpload
        disabled={disabled}
        accept={accept}
        listType={listType}
        beforeUpload={(file) => beforeFileUpload(file as FileType)}
        onChange={onChange}
        fileList={fileList}
        multiple={multiple}
        maxCount={maxCount}
      >
        {children}
      </AntdUpload>
    </>
  )
}
