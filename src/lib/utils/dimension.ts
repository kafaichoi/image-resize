import {Dimension} from '../../types'

export const dimensionToString = (dimension: Dimension) : string =>
  `${dimension.width || ''}x${dimension.height || ''}`
