import { HttpStatus, ValidationError } from '@nestjs/common'

export class ValidationException extends Error {
  private readonly errors: ValidationError[]
  protected statusCode: HttpStatus = HttpStatus.BAD_REQUEST
  constructor(validationErrors: ValidationError[] = []) {
    super('VALIDATION_ERROR')
    this.errors = validationErrors
  }

  getMessage() {
    return this.message
  }

  getStatus() {
    return this.statusCode
  }

  getErrors() {
    return this.errors
  }
}
