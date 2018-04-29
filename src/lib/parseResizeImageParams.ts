import * as sha1 from 'sha1'
import * as parse from 'url-parse'
import * as R from 'ramda'
import validateDimensionString from '../lib/validators/validateDimensionString'

const parseResizeImageParams = (body: string) : {isSuccessful: false, error: string} | {isSuccessful: true, params: {imageUrl: string, dimensions: string[], snsCb: string}} => {
  const {
    imageUrl,
    dimensions,
    snsCb
  } = JSON.parse(body)

  if (!imageUrl) {
    return {isSuccessful: false, error: 'imageUrl is required in the body'}
  }
  if (!dimensions) {
    return {isSuccessful: false, error: 'dimension is required in the body'}
  }
  if (!snsCb) {
    return {isSuccessful: false, error: 'snsCb is required in the body'}
  }
  if (R.not(R.all(validateDimensionString, dimensions))) {
    return {isSuccessful: false, error: 'dimension is not valid'}
  }

  return {
    isSuccessful: true,
    params: {
      imageUrl,
      dimensions,
      snsCb
    }
  }
}

export default parseResizeImageParams
