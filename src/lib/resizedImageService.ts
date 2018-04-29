import * as R from 'ramda'
import {SNS} from 'aws-sdk'
import {IResizedImageModel, default as ResizedImage} from './models/ResizedImageModel'
import {ResizedImageDetail} from '../types'
import publishEvent from '../lib/publishEvent'
import { mapOnlyResolved } from '../lib/utils/promise'

export const addSnsCb = (resizedImage: IResizedImageModel, snsCb: string) : Promise<IResizedImageModel> => {
  resizedImage.snsCbs = [...resizedImage.snsCbs, snsCb]
  return resizedImage.save()
}

const initializeResizedImageDetail = (dimension: string) : ResizedImageDetail => ({
  dimension,
  status: 'inProgress'
})

export const createOne = (originalImageUrl: string, imageUrl: string, imageId: string, width: number, height: number, dimensions: string[], snsCbs: string[]) : Promise<IResizedImageModel> =>
  new ResizedImage({
    imageUrl,
    imageId,
    originalImageUrl,
    width,
    height,
    snsCbs,
    resizedImageDetails: R.map(initializeResizedImageDetail, dimensions)

  }).save()

export const addNewResizedDimensions = (
  resizedImage: IResizedImageModel,
  dimensions: string[]
) : Promise<IResizedImageModel> => {
  resizedImage.resizedImageDetails = [
    ...resizedImage.resizedImageDetails,
    ...(R.map(initializeResizedImageDetail, dimensions))
  ]
  return resizedImage.save()
}

export const upsertResizedImageDetails = (
  resizedImage: IResizedImageModel,
  resizedImageDetails: ResizedImageDetail[]
) : Promise<IResizedImageModel> => {
  resizedImage.resizedImageDetails = R.uniqBy(
    R.prop('dimension'),
    [...resizedImageDetails, ...resizedImage.resizedImageDetails]
  )
  return resizedImage.save()
}

export const publishToSnsCbs = async (sns: SNS, resizedImage: IResizedImageModel) : Promise<IResizedImageModel> => {
  const targetSnsCbs = resizedImage.snsCbs
  resizedImage.snsCbs = []
  await mapOnlyResolved(targetSnsCbs.map(snsCb =>
    publishEvent(sns, snsCb, serializeOne(resizedImage))
  ))
  return resizedImage.save()
}

export const serializeOne = (resizedImage: IResizedImageModel) : string =>
  JSON.stringify({
    id: resizedImage._id,
    imageUrl: resizedImage.imageUrl,
    imageId: resizedImage.imageId,
    originalImageUrl: resizedImage.originalImageUrl,
    width: resizedImage.width,
    height: resizedImage.height,
    resizedImageDetails: R.map(R.pick(['dimension', 'status', 'height', 'width', 'url']), resizedImage.resizedImageDetails)
  })

export const getOneByImageId = (imageId: string) : Promise<IResizedImageModel> =>
  ResizedImage.findOne({imageId})
    .then(resizedImage => {
      if (resizedImage === null) {
        throw new Error(`no resized image found for imageId ${imageId}`)
      }
      return resizedImage
    })

export const getOne = (id: string) : Promise<IResizedImageModel> =>
  ResizedImage.findById(id)
    .then(resizedImage => {
      if (resizedImage === null) {
        throw new Error(`no resized image found for id ${id}`)
      }
      return resizedImage
    })

export const getInProgress = (limit = 50) : Promise<IResizedImageModel[]> =>
  ResizedImage.find({resizedImageDetails: {'$elemMatch': {status: 'inProgress'}}}).limit(limit)
    .then(R.identity)
