import { SNSEvent, Callback, Context, Handler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import {Mongoose} from 'mongoose'
import * as mongoose from 'mongoose'
import { mapOnlyResolved } from '../lib/utils/promise'
import * as resizedImageService from '../lib/resizedImageService'
import processResizeImage from '../lib/processResizedImage'
import {createErrorResponse } from '../lib/createResponse'

const s3 = new AWS.S3()
const sns = new AWS.SNS()
const MONGO_URI = process.env.MONGO_URI as string
let mongoConn : null | Mongoose = null

const retryResizing: Handler = async (event: SNSEvent, context: Context, cb: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  try {
    if (mongoConn === null) {
      mongoConn = await mongoose.connect(MONGO_URI)
    }
    const resizedImages = await resizedImageService.getInProgress()
    await mapOnlyResolved(
      resizedImages.map(resizedImage => processResizeImage(resizedImage, s3, sns))
    )
    cb(null, 'success')
  } catch (e) {
    console.log('e: ', e)
    cb(null, createErrorResponse(e.message))
  }
}

export default retryResizing
