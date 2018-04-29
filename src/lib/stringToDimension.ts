import { Dimension } from '../types'

const stringToDimension = (dimensionString: string) : Dimension => {
  // assume dimension persisted is always right format e.g '10x10', '*x10', '10x*'
  const [width, height] = dimensionString.split('x')
  if (height === '*') {
    return {
      width: Number(width),
      height: undefined
    }
  }
  if (width === '*') {
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

export default stringToDimension
