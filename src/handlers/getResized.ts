import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import * as R from 'ramda'
import * as AWS from 'aws-sdk'
import { getOrignalImageId } from '../lib/getImageId'
import {Mongoose} from 'mongoose'
import * as mongoose from 'mongoose'
import config from '../config'
import {createErrorResponse, createSuccessResponse} from '../lib/createResponse'
import * as resizedImageService from '../lib/resizedImageService'
import uploadImageToS3 from '../lib/uploadImageToS3'
import imageUrlToBase64Buffer from '../lib/imageUrlToBase64'
import getImageDetail from '../lib/getImageDetail'

const s3 = new AWS.S3()
let mongoConn : null | Mongoose = null
const getResized: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  const remoteImageUrl = R.path(['queryStringParameters', 'image_url'], event) as undefined | string
  const uuid = R.path(['queryStringParameters', 'uuid'], event) as undefined | string
  try {
    if (remoteImageUrl && uuid) {
      cb(null, createErrorResponse('image_url and uuid cannot be both provied', 403))
      return
    }

    if (!remoteImageUrl && !uuid) {
      cb(null, createErrorResponse('either image_url or uuid must be provided', 403))
      return
    }

    if (uuid) {
      const resizedImage = await resizedImageService.getOne(uuid)
      cb(
        null,
        createSuccessResponse(resizedImageService.serializeOne(resizedImage))
      )
      return
    }

    // unnnecessary but typescript compiler seem not smart enough so we need to include this checking
    if (!remoteImageUrl) {
      cb(null, createErrorResponse('image_url is missing in query string', 403))
      return
    }

    if (mongoConn === null) {
      mongoConn = await mongoose.connect(config.mongoUri)
    }
    const imageId = getOrignalImageId(remoteImageUrl)
    const resizedImage = await resizedImageService.getOneByImageId(imageId).catch(
      R.always(null)
    )
    if (!resizedImage) {
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
      const newResizedImage = await resizedImageService.createOne(
        remoteImageUrl, imageUrl, imageId, width, height, [], []
      )
      cb(
        null,
        createSuccessResponse(resizedImageService.serializeOne(newResizedImage))
      )
      return
    }
    cb(
      null,
      createSuccessResponse(resizedImageService.serializeOne(resizedImage))
    )
  } catch (e) {
    console.log('e: ', e)
    cb(null, createErrorResponse(e.message))
  }
}

export default getResized
