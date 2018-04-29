import * as sharp from 'sharp'
import { Dimension } from '../types'

const resizeImage = async (
  imageBuffer: Buffer,
  dimension: Dimension
): Promise<Buffer> => {
  const image = sharp(imageBuffer)
  const clone = await image.clone()
  clone.resize(dimension.width, dimension.height)
  return clone.toBuffer()
}

export default resizeImage
