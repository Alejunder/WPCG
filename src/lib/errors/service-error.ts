export type ErrorCode = 'FETCH_ERROR' | 'VALIDATION_ERROR' | 'NOT_FOUND'

export class ServiceError extends Error {
  readonly code: ErrorCode
  readonly context: Record<string, unknown> | undefined

  constructor(message: string, code: ErrorCode, context?: Record<string, unknown>) {
    super(message)
    this.name = 'ServiceError'
    this.code = code
    this.context = context
    // Maintains correct prototype chain in transpiled ES5
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
