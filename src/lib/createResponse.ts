export const createErrorResponse = (message = 'Server Error', statusCode = 500) => ({
  statusCode: statusCode,
  headers: { 'Content-Type': 'text/plain' },
  body: message || 'Server error'
})

export const createSuccessResponse = (message, statusCode = 200) => ({
  statusCode: statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: message
})
