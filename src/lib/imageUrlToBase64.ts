import { encode } from 'node-base64-image'

const imageUrlToBase64Buffer = (imageUrl: string): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    encode(imageUrl, { string: false }, (error, result) => {
      if (error) reject(error)
      if (result) resolve(result)
    })
  })

export default imageUrlToBase64Buffer
