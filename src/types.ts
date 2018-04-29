type ResizedImageStatus = 'done' | 'inProgress'

export type ResizedImageDetail = {
  dimension: string
  width?: number
  height?: number
  url?: string
  status: ResizedImageStatus
}

export interface IResizedImage {
  imageUrl: string
  imageId: string
  originalImageUrl: string
  width: number
  height: number
  resizedImageDetails: ResizedImageDetail[]
  getInProgressResizedImageDetails: () => ResizedImageDetail[]
  isAllDimensionResizedDone: () => boolean
  snsCbs: string[]
}

export type Dimension = {width: number, height: number} | {width: number, height: undefined} | {height: number, width: undefined}
