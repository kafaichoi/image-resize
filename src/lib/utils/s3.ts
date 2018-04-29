import * as AWS from 'aws-sdk'
import * as fileType from 'file-type'
import * as R from 'ramda'

const SUPPORTED_MIME_TPES = [
  'image/gif',
  'image/jpeg',
  'image/png'
]

const isValidFileType : ((fileType: fileType.FileTypeResult) => Boolean) =
  R.compose(x => R.contains(x, SUPPORTED_MIME_TPES), R.prop('mime'))

const uploadToS3 = (fileBuffer: Buffer, fileName: string, bucket: string, s3: AWS.S3): Promise<string> =>
  new Promise((resolve, reject) => {
    const params = {
      Body: fileBuffer,
      Key: fileName,
      Bucket: bucket,
      ContentEncoding: 'base64'
    }

    s3.putObject(params, (err, data) => {
      if (err) {
        reject(new Error(`error in putting object in s3: status code: ${[err.statusCode]}, message: ${[err.message]}`))
      };
      const objectUrl = `https://s3-${process.env.AWS_REGION}.amazonaws.com/${bucket}/${fileName}`
      resolve(objectUrl)
    })
  })

export const uploadImageToS3 = (imageBuffer: Buffer, imageId: string, bucket: string, s3: AWS.S3) : Promise<string> => {
  const fileTypeInfo = fileType(imageBuffer)
  if (!fileTypeInfo) {
    return Promise.reject(new Error('Unrecognized file type'))
  }
  if (!isValidFileType(fileTypeInfo)) {
    return Promise.reject(new Error(`File type is not supported: mime: ${fileTypeInfo.mime}, ext: ${fileTypeInfo.ext}`))
  }

  return uploadToS3(imageBuffer, imageId, bucket, s3)
}

export const getImageFromS3 = (imageId: string, bucket: string, s3: AWS.S3) : Promise<Buffer> => new Promise((resolve, reject) =>
  s3.getObject({Bucket: bucket, Key: imageId}, (err, data) => {
    if (err && err.code === 'NoSuchKey' || data === null) {
      return reject(new Error(`There is no such image(imageId : ${imageId} stored`))
    }
    if (err) {
      return reject(err)
    }
    resolve(data.Body as Buffer)
  }))
