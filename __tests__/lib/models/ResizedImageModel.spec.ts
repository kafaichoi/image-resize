import ResizedImageModel from '../../../src/lib/models/ResizedImageModel'

describe('ResizedImageModel', () => {
  const resizedImagePayload = {
    imageUrl: 'fakeUrl',
    imageId: 'fakeId',
    width: 200,
    height: 200,
    resizedImageDetails: []
  }
  describe('isAllDimensionResizedDone', () => {
    it('should return true if all dimensions status is done', () => {
      const imageModel = new ResizedImageModel({
        ...resizedImagePayload,
        resizedImageDetails: [
          {
            dimension: '10x10',
            status: 'done'
          },
          {
            dimension: '10x20',
            status: 'done'
          }
        ]
      })
      expect(imageModel.isAllDimensionResizedDone()).toEqual(true)
    })
    it('should return false if not dimensions status is done', () => {
      const imageModel = new ResizedImageModel({
        ...resizedImagePayload,
        resizedImageDetails: [
          {
            dimension: '10x10',
            status: 'done'
          },
          {
            dimension: '10x20',
            status: 'inProgress'
          }
        ]
      })
      expect(imageModel.isAllDimensionResizedDone()).toEqual(false)
    })
  })
  describe('getInProgressResizedImageDetails', () => {
    it('shoulder return in progress dimentions correctly if there is in progress dimension', () => {
      const imageModel = new ResizedImageModel({
        ...resizedImagePayload,
        resizedImageDetails: [
          {
            dimension: '10x10',
            status: 'done'
          },
          {
            dimension: '10x20',
            status: 'inProgress'
          }
        ]
      })
      const resizedImageDetails = imageModel.getInProgressResizedImageDetails()
      expect(resizedImageDetails.length).toEqual(1)
    })
    it('shoulder return empty array if there is no in progress dimension', () => {
      const imageModel = new ResizedImageModel({
        ...resizedImagePayload,
        resizedImageDetails: [
          {
            dimension: '10x10',
            status: 'done'
          },
          {
            dimension: '10x20',
            status: 'done'
          }
        ]
      })
      const resizedImageDetails = imageModel.getInProgressResizedImageDetails()
      expect(resizedImageDetails).toEqual([])
    })
  })
  describe('isAllDimensionResizedDone', () => {
    it('should return true if all dimensions is done', () => {
      const imageModel = new ResizedImageModel({
        ...resizedImagePayload,
        resizedImageDetails: [
          {
            dimension: '10x10',
            status: 'done'
          },
          {
            dimension: '10x20',
            status: 'done'
          }
        ]
      })
      expect(imageModel.isAllDimensionResizedDone()).toEqual(true)
    })
    it('should return false if not dimensions status is done', () => {
      const imageModel = new ResizedImageModel({
        ...resizedImagePayload,
        resizedImageDetails: [
          {
            dimension: '10x10',
            status: 'done'
          },
          {
            dimension: '10x20',
            status: 'inProgress'
          }
        ]
      })
      expect(imageModel.isAllDimensionResizedDone()).toEqual(false)
    })
  })
})
