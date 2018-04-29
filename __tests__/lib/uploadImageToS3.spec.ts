import * as AWS from 'aws-sdk-mock'
import {S3} from 'aws-sdk'
import uploadImageToS3 from '../../src/lib/uploadImageToS3'

describe(`uploadImageToS3`, () => {
  beforeAll(() => {
    require('../helpers/setupEnv')
    return AWS.mock('S3', 'putObject', (params, cb) => {
      cb(null, {data: 'a'})
    })
  })

  afterAll(() => {
    AWS.restore('S3')
  })

  it('Should have successfull resolve if the image is valid', done => {
    const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    const imageBuffer = new Buffer(base64Image, 'base64')
    const imageId = 'abc'
    const bucket = 'buckerA'
    const s3 = new S3()
    const image = uploadImageToS3(imageBuffer, imageId, bucket, s3)
    expect(image).resolves.toEqual(`https://s3-ap-southeast-1.amazonaws.com/${bucket}/${imageId}`)
    done()
  })

  it('Should have reject if the image is not valid', done => {
    const base64Image = 'invalidImage'
    const imageBuffer = new Buffer(base64Image, 'base64')
    const imageId = 'abc'
    const bucket = 'buckerA'
    const s3 = new S3()
    const image = uploadImageToS3(imageBuffer, imageId, bucket, s3)
    expect(image).rejects.toEqual(new Error('Unrecognized file type'))
    done()
  })
})
