import * as R from 'ramda'
import * as uuid from 'uuid'
import {Schema, model, Document} from 'mongoose'
import * as mongoose from 'mongoose'
require('mongoose-uuid2')(mongoose)
const UUID = (mongoose.Types as any).UUID
import { IResizedImage, Dimension } from '../../types'

export interface IResizedImageModel extends IResizedImage, Document {
}

const ResizedImageDetailSchema = new Schema({
  dimension: {
    type: String,
    required: true
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  url: {
    type: String
  },
  status: {
    type: String,
    enum: ['inProgress', 'done'],
    required: true
  }
})

const ResizedImageSchema = new Schema({
  _id: { type: UUID, default: uuid.v4 },
  imageUrl: {
    type: String,
    required: true
  },
  imageId: {
    type: String,
    required: true,
    unique: true
  },
  originalImageUrl: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  resizedImageDetails: [ResizedImageDetailSchema],
  snsCbs: [{
    type: String,
    required: true
  }]
}, {timestamps: true})

const stringToDimension = (dimensionString: string) : Dimension => {
  // assume dimension persisted is always right format e.g '10x10', 'x10', '10x'
  const [width, height] = dimensionString.split('x')
  if (height === '') {
    return {
      width: Number(width),
      height: undefined
    }
  }
  if (width === '') {
    return {
      width: undefined,
      height: Number(height)
    }
  }

  return {
    height: Number(height),
    width: Number(width)
  }
}

const getInProgressResizedImageDetails =
  R.filter(R.propEq('status', 'inProgress'))

ResizedImageSchema.methods.getInProgressResizedImageDetails = function () {
  return getInProgressResizedImageDetails(this.resizedImageDetails)
}

ResizedImageSchema.methods.isAllDimensionResizedDone = function () {
  return this.getInProgressResizedImageDetails().length === 0
}

export default model<IResizedImageModel>('ResizedImage', ResizedImageSchema)
