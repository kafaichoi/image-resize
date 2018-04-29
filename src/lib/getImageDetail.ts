import * as sharp from 'sharp'

const getImageDetail = (image: Buffer): Promise<sharp.Metadata> =>
  sharp(image)
    .metadata()

export default getImageDetail
