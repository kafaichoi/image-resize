import parseResizeImageParams from '../../src/lib/parseResizeImageParams'

describe(`parseResizeImageParams`, () => {
  it('Should return object with params if imageUrl, dimensions, snsCb are present and correct', () => {
    const params = {
      imageUrl: 'http://image.com/a.png',
      dimensions: [],
      snsCb: 'fakeSnsCb'
    }
    const result = parseResizeImageParams(JSON.stringify(params))
    expect(result.isSuccessful).toEqual(true)
    expect(params).toEqual((result as {params: any}).params)
  })

  it('Should return object with error message if remote image url is not present', () => {
    const params = {
    }
    const result = parseResizeImageParams(JSON.stringify(params))
    expect(result.isSuccessful).toEqual(false)
    const error = (result as {error: string}).error
    expect(error).toEqual('imageUrl is required in the body')
  })

  it('Should return object with error message if dimension is not valid', () => {
    const params = {
      imageUrl: 'http://image.com/a.png',
      dimensions: ['20x?'],
      snsCb: 'fakeSnsCb'
    }
    const result = parseResizeImageParams(JSON.stringify(params))
    expect(result.isSuccessful).toEqual(false)
    const error = (result as {error: string}).error
    expect(error).toEqual('dimension is not valid')
  })
})
