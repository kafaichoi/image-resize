import { getOrignalImageId, getResizedImageId } from '../../src/lib/getImageId'

describe(`getImageId`, () => {
  describe(`getOrignalImageId`, () => {
    it('Should return same id for same url.', done => {
      const imageUrl = 'http://example.com/a.png'
      const imageId1 = getOrignalImageId(imageUrl)
      const imageId2 = getOrignalImageId(imageUrl)
      expect(imageId1).toEqual(imageId2)
      done()
    })
    it('Should return different id for different url.', done => {
      const imageUrl1 = 'http://example.com/a.png'
      const imageUrl2 = 'http://example.com/b.png'
      const imageId1 = getOrignalImageId(imageUrl1)
      const imageId2 = getOrignalImageId(imageUrl2)
      expect(imageId1).not.toEqual(imageId2)
      done()
    })
  })
  describe(`getResizedImageId`, () => {
    it('Should return same id for same dimension.', done => {
      const imageUrl = 'http://example.com/a.png'
      const dimension = '10x10'
      const imageId1 = getResizedImageId(imageUrl, dimension)
      const imageId2 = getResizedImageId(imageUrl, dimension)
      expect(imageId1).toEqual(imageId2)
      done()
    })
    it('Should return different id for different dimension.', done => {
      const imageUrl = 'http://example.com/a.png'
      const dimension1 = '10x20'
      const dimension2 = '10x30'
      const imageId1 = getResizedImageId(imageUrl, dimension1)
      const imageId2 = getResizedImageId(imageUrl, dimension2)
      expect(imageId1).not.toEqual(imageId2)
      done()
    })
  })
})
