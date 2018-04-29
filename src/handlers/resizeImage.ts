import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { encode } from 'node-base64-image'
import * as mongoose from 'mongoose'
import {Mongoose} from 'mongoose'
import * as R from 'ramda'
import uploadImageToS3 from '../lib/uploadImageToS3'
import { getOrignalImageId } from '../lib/getImageId'
import * as resizedImageService from '../lib/resizedImageService'
import getImageDetail from '../lib/getImageDetail'
import publishEvent from '../lib/publishEvent'
import config from '../config'
import { createErrorResponse, createSuccessResponse } from '../lib/createResponse'
import parseResizeImageParams from '../lib/parseResizeImageParams'
import { IResizedImageModel } from '../lib/models/ResizedImageModel'
import { Dimension } from '../types'
import imageUrlToBase64Buffer from '../lib/imageUrlToBase64'

const s3 = new AWS.S3()
const sns = new AWS.SNS()
let mongoConn : null | Mongoose = null

const snsArn = process.env.snsArn as string

const publishProcessResizingEvent = imageId =>
  publishEvent(sns, snsArn, imageId)

const resizeExistingImage = async (
  resizedImage: IResizedImageModel,
  dimensions: string[],
  snsCb: string
) : Promise<IResizedImageModel> => {
  const existingsDimensions = R.map(R.prop('dimension'), resizedImage.resizedImageDetails)
  const newDimensions = R.without(existingsDimensions, dimensions)
  // when there is no new dimensions
  if (newDimensions.length > 0) {
    await resizedImageService.addNewResizedDimensions(resizedImage, newDimensions)
    const updatedResizedImage = await resizedImageService.addSnsCb(resizedImage, snsCb)
    await publishProcessResizingEvent(resizedImage.imageId)
    return updatedResizedImage
  }
  if (resizedImage.isAllDimensionResizedDone()) {
    // all resized job is done
    // just publish the previous resized result to snsCb
    await publishEvent(sns, snsCb, resizedImageService.serializeOne(resizedImage))
    return resizedImage
  }
  // not all resized is done so add snscb and trigger resizing again
  const updatedResizedImage = await resizedImageService.addSnsCb(resizedImage, snsCb)
  await publishProcessResizingEvent(resizedImage.imageId)
  return updatedResizedImage
}

const resizeImage: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  const requestBody = event.body
  if (requestBody === null) {
    cb(null, createErrorResponse('empty body', 400))
    return
  }
  const parsedResult = parseResizeImageParams(requestBody)
  if (!parsedResult.isSuccessful) {
    cb(null, createErrorResponse(parsedResult.error, 403))
    return
  }
  const {
    params: {
      imageUrl: remoteImageUrl, dimensions, snsCb
    }
  } = parsedResult

  try {
    // Because `mongoConn` is in the global scope, Lambda may retain it between functins call
    if (mongoConn === null) {
      mongoConn = await mongoose.connect(config.mongoUri)
    }

    const imageId = getOrignalImageId(remoteImageUrl)
    const resizedImage = await resizedImageService.getOneByImageId(imageId).catch(
      R.always(null)
    )

    // if there is resized image existing
    if (resizedImage !== null) {
      const updatedResizedImage = await resizeExistingImage(resizedImage, dimensions, snsCb)
      cb(null, createSuccessResponse(resizedImageService.serializeOne(updatedResizedImage)))
      return
    }
    // if there is no resized image existing
    const imageBuffer = await imageUrlToBase64Buffer(remoteImageUrl)
    const imageUrl = await uploadImageToS3(imageBuffer, imageId, config.originalImageBucket, s3)
    const {height, width} = await getImageDetail(imageBuffer)
    if (height === undefined) {
      cb(null, createErrorResponse('image height cannot be obtained', 400))
      return
    }
    if (width === undefined) {
      cb(null, createErrorResponse('image width cannot be obtained', 400))
      return
    }
    const updatedResizedImage = await resizedImageService.createOne(remoteImageUrl, imageUrl, imageId, width, height, dimensions, [snsCb])

    await publishProcessResizingEvent(imageId)
    cb(null, createSuccessResponse(resizedImageService.serializeOne(updatedResizedImage)))
  } catch (e) {
    console.log('e: ', e)
    cb(null, createErrorResponse(e.message))
  }
}

export default resizeImage
