import * as AWS from 'aws-sdk-mock'
import {S3} from 'aws-sdk'
import { createErrorResponse, createSuccessResponse } from '../../src/lib/createResponse'

describe('createResponse', () => {
  describe(`createErrorResponse`, () => {
    it('should have default statusCode as 500', () => {
      const response = createErrorResponse('Age is not valid')
      expect(response).toEqual({
        statusCode: 500,
        headers: { 'Content-Type': 'text/plain'},
        body: 'Age is not valid'
      })
    })
  })
  describe(`createSuccessResponse`, () => {
    it('should have default 200 and serialize any object', () => {
      const car = {brand: 'tesla'}
      const serializedCar = JSON.stringify(car)
      const response = createSuccessResponse(serializedCar)
      expect(response).toEqual({
        statusCode: 200,
        headers: { 'Content-Type': 'application/json'},
        body: serializedCar
      })
    })
  })
})
