import { status } from '@grpc/grpc-js'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'

export function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function currentMilliTime(): string {
  return new Date().getTime().toString()
}

export function mapRpcExceptionToHttpException(error: any): HttpException {
  let code = status.INTERNAL
  if (error?.code) {
    code = error?.code
  } else if (error?.error?.code) {
    code = error?.error?.code
  }
  let msg = 'Something went wrong'
  if (error?.code) {
    msg = error?.details
  } else if (error?.error?.details) {
    msg = error?.error?.details
  }
  switch (code) {
    case status.NOT_FOUND:
      return new NotFoundException(msg)
    case status.PERMISSION_DENIED:
      return new ForbiddenException(msg)
    case status.INVALID_ARGUMENT:
      return new BadRequestException(msg)
    case status.ALREADY_EXISTS:
      return new ConflictException(msg)
    case status.UNAUTHENTICATED:
      return new UnauthorizedException(msg)
    case status.UNAVAILABLE:
      return new ServiceUnavailableException(msg)
    case status.UNIMPLEMENTED:
      return new NotImplementedException(msg)
    case status.DEADLINE_EXCEEDED:
      return new RequestTimeoutException(msg)
    default:
      return new InternalServerErrorException(msg)
  }
}
