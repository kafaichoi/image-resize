import { S3, SNS } from 'aws-sdk'
import { IResizedImageModel } from './models/ResizedImageModel'
import { uploadImageToS3, getImageFromS3 } from './utils/s3'
import { getOrignalImageId, getResizedImageId } from './getImageId'
import * as resizedImageService from './resizedImageService'
import config from '../config'
import { mapOnlyResolved } from './utils/promise'
import { dimensionToString } from './utils/dimension'
import { ResizedImageDetail, Dimension} from '../types'
import resizeImage from './resizeImage'
import getImageDetail from './getImageDetail'
import stringToDimension from './stringToDimension'

const resizeImageAndUploadToS3 = async (
  imageBuffer: Buffer,
  resizedImageDetail: ResizedImageDetail,
  originalImageUrl: string,
  resizedImageBucket: string,
  s3: S3) : Promise<ResizedImageDetail> => {
  const dimension = stringToDimension(resizedImageDetail.dimension)
  const resizedBuffer = await resizeImage(imageBuffer, dimension)
  const {width, height} = await getImageDetail(resizedBuffer)
  const resizedActualDimension = {width, height} as Dimension
  const resizedImageId = getResizedImageId(originalImageUrl, dimensionToString(dimension))
  const resizedImageUrl = await uploadImageToS3(resizedBuffer, resizedImageId, resizedImageBucket, s3)
  return {
    dimension: resizedImageDetail.dimension,
    width,
    height,
    url: resizedImageUrl,
    status: 'done'
  } as ResizedImageDetail
}

const processResizeImage = async (resizedImage: IResizedImageModel, s3: S3, sns: SNS) : Promise<IResizedImageModel> => {
  const originalImageId = getOrignalImageId(resizedImage.originalImageUrl)
  const originalImageBuffer = await getImageFromS3(originalImageId, config.originalImageBucket, s3)
  const resizedImageDetails = await mapOnlyResolved(
    resizedImage.getInProgressResizedImageDetails()
      .map(resizedImageDetail => resizeImageAndUploadToS3(
        originalImageBuffer,
        resizedImageDetail,
        resizedImage.originalImageUrl,
        config.resizedImageBucket,
        s3
      ))
  ) as ResizedImageDetail[]

  const updatedResizedImage = await resizedImageService.upsertResizedImageDetails(
    resizedImage,
    resizedImageDetails
  )
  if (updatedResizedImage.isAllDimensionResizedDone()) {
    await resizedImageService.publishToSnsCbs(sns, resizedImage)
  }

  return updatedResizedImage
}

export default processResizeImage
