import * as mongoose from 'mongoose'
import config from './index'

mongoose.connect(config.mongoUri)
  .catch((err) => {
    console.error('MongoDB connection error. Please make sure MongoDB is running. ' + err)
  })
