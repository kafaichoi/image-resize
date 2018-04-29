import * as Promise from 'bluebird'
import * as mongoose from 'mongoose'
import '../../src/config/setupMongoose'

export const ensureDBConnection = (): Promise<any> => {
  return new Promise((resolve) => {
    if (mongoose.connection.db) {
      return resolve(mongoose.connection.db)
    }
    mongoose.connection.on('connected', () => {
      resolve(mongoose.connection.db)
    })
  })
}

export const cleanDatabase = () =>
  mongoose.connection.db.dropDatabase()
