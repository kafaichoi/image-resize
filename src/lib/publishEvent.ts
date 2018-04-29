import * as sharp from 'sharp'
import {SNS} from 'aws-sdk'
import { IResizedImageModel } from '../lib/models/ResizedImageModel'
import { mapOnlyResolved } from '../lib/utils/promise'

const publishEvent = (sns: SNS, topic: string, message: string) =>
  new Promise((resolve, reject) => {
    sns.publish(
      {
        Message: message,
        TopicArn: topic
      },
      (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data.MessageId)
      }
    )
  })

export default publishEvent
