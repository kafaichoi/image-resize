type Config = {
  originalImageBucket: string
  resizedImageBucket: string
  mongoUri: string
}

const isTest = process.env.NODE_ENV === 'test'

const config: Config = (
  isTest
    ? {
      originalImageBucket: 'test-original-bucket',
      resizedImageBucket: 'test-resized-bucket',
      mongoUri: 'mongodb://mongo:27017/kipwise-test'
    }
    : {
      originalImageBucket: process.env.ORIGINAL_IMAGE_BUCKET as string,
      resizedImageBucket: process.env.RESIZED_IMAGE_BUCKET as string,
      mongoUri: process.env.MONGO_URI as string
    }
)

export default config
