import * as R from 'ramda'
import * as resizedImageService from '../../src/lib/resizedImageService'
import ResizedImageModel from '../../src/lib/models/ResizedImageModel'
import { ensureDBConnection, cleanDatabase } from '../helpers/db'

beforeAll(ensureDBConnection)
afterAll(cleanDatabase)

describe(`resizedImageService`, () => {
  const resizedImageParams = {
    imageUrl: 'fakeUrl',
    originalImageUrl: 'fakeUrl',
    imageId: 'fakeId',
    width: 200,
    height: 200,
    resizedImageDetails: [
      {
        dimension: '10x10',
        status: 'inProgress'
      }
    ]

  }
  let resizedImage
  beforeAll(async () => {
    resizedImage = await new ResizedImageModel(resizedImageParams).save()
  })

  describe(`addNewResizedDimension`, () => {
    it('Should return updated resized image with correct dimension', async () => {
      const updatedResizedImage = await resizedImageService.addNewResizedDimensions(resizedImage, ['20x', '30x30'])
      const newDimensions = R.map(R.prop('dimension'), updatedResizedImage.resizedImageDetails)
      expect(newDimensions).toEqual(['10x10', '20x', '30x30'])
    })
  })

  describe(`serializeOne`, () => {
    it('should return serialized resized image', () => {
      expect(
        R.dissoc(
          'id',
          JSON.parse(resizedImageService.serializeOne(new ResizedImageModel(resizedImageParams)))
        )
      )
        .toEqual(resizedImageParams)
    })
  })

  describe(`getOneByImageId`, () => {
    it('should return resolve promise with correct project when image is found', async () => {
      const imageId = 'fakeId'
      const {imageId: resizedImageId} = await resizedImageService.getOneByImageId(imageId)
      await expect(resizedImageId).toEqual(imageId)
    })

    it('should return rejected promise when no image is found', async () => {
      const imageId = 'noneExistingId'
      await expect(resizedImageService.getOneByImageId(imageId)).rejects.toEqual(new Error(`no resized image found for imageId ${imageId}`
      ))
    })
  })

  describe('getInProgress', () => {
    it('should return list of resized image that having inProgress dimension', async () => {
      const resizedImages = await resizedImageService.getInProgress()
      expect(resizedImages.length).toEqual(1)
    })
  })
})
