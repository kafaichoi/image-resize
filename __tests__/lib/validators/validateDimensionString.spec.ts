import * as R from 'ramda'
import validateDimensionString from '../../../src/lib/validators/validateDimensionString'

describe(`validateDimensionString`, () => {
  it('should return true when both height and width is valid', () => {
    expect(validateDimensionString('10x10')).toEqual(true)
  })

  it('should return true when height is valid but width is wildcard', () => {
    expect(validateDimensionString('*x10')).toEqual(true)
  })

  it('should return true when width is valid but height is wildcard', () => {
    expect(validateDimensionString('10x*')).toEqual(true)
  })

  it('should return false for invalid format x', () => {
    expect(validateDimensionString('x')).toEqual(false)
  })

  it('should return false for invalid format 10xA', () => {
    expect(validateDimensionString('10xA')).toEqual(false)
  })

  it('should return false for invalid format 10A10', () => {
    expect(validateDimensionString('10A10')).toEqual(false)
  })

  it('should return false when width is valid but height is missing', () => {
    expect(validateDimensionString('10x')).toEqual(false)
  })

  it('should return false when height is valid but width is missing', () => {
    expect(validateDimensionString('x10')).toEqual(false)
  })

  it('should return false when both height and width are missing', () => {
    expect(validateDimensionString('x10')).toEqual(false)
  })
})
