import * as R from 'ramda'

const isNumeric : (x: string) => boolean =
  R.compose(
    R.not,
    isNaN,
    parseInt
  )

const isWildCard = R.equals('*')

const validateDimensionString = (dimension: string): boolean => {
  if (!R.contains('x', dimension)) {
    return false
  }

  const [width, height] = dimension.split('x')

  if (isWildCard(width)) {
    return isNumeric(height)
  }

  if (isWildCard(height)) {
    return isNumeric(width)
  }

  return R.and(isNumeric(width), isNumeric(height))
}

export default validateDimensionString
