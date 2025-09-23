import feathersClient from './featherClient'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB chunks

export default async function uploadFileMultipart(
  file: File,
  userId: string,
  // fileType: 'audio' | 'video' | 'image',
  setUploadProgress?: (progress: number) => void
) {
  try {
    const allowedPattern = /[^a-zA-Z0-9!._*'()-]/g
    const sanitizeKey = file.name.replace(allowedPattern, '')

    const initResponse = await feathersClient.service('uploads').create({
      key: sanitizeKey,
      contentType: file.type,
    })
    const { uploadId, key } = initResponse
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
    const parts = []

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(file.size, start + CHUNK_SIZE)
      const chunk = file.slice(start, end)

      // Convert chunk to buffer
      const reader = new FileReader()
      const chunkData = await new Promise<ArrayBuffer>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as ArrayBuffer)
        reader.readAsArrayBuffer(chunk)
      })

      const partResponse = await feathersClient.service('uploads').patch(null, {
        partNumber: i + 1,
        uploadId,
        key,
        content: Buffer.from(chunkData),
      })

      const responseETag =
        Array.isArray(partResponse) && partResponse.length > 0
          ? (partResponse[0] as unknown as { ETag: string; PartNumber: number })
              ?.ETag || ''
          : (partResponse as unknown as { ETag: string; PartNumber: number })
              ?.ETag || ''

      parts.push({
        ETag: responseETag,
        PartNumber: i + 1,
      })

      if (setUploadProgress) {
        setUploadProgress(Math.round(((i + 1) / totalChunks) * 100))
      }
    }

    const completeResponse = await feathersClient
      .service('uploads')
      .update(null, {
        uploadId,
        key,
        parts,
        fileType: file.type,
        userId,
      })
    // Handle case where completeResponse might be an array
    const responseObj =
      Array.isArray(completeResponse) && completeResponse.length > 0
        ? completeResponse[0]
        : completeResponse
    return {
      pageCount: responseObj.pageCount,
      mediaId: responseObj.mediaId,
    }
  } catch (error) {
    console.error(`Error uploading `, error)
    throw error
  }
}
