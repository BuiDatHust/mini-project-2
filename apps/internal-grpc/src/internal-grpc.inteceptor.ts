import {
  BadRequestRpcException,
  ConflictRpcException,
  ForbiddenRpcException,
  InternalRpcException,
  NotFoundRpcException,
  RequestTimeoutRpcException,
  ServiceUnavailableRpcException,
  UnauthorizedRpcException,
} from '@app/common/exceptions/grpc.exception'
import { ValidationException } from '@app/common/exceptions/validation.exception'
import { status as GRPC_STATUS } from '@grpc/grpc-js'
import {
  BadRequestException,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import {
  CallHandler,
  NestInterceptor,
} from '@nestjs/common/interfaces/features/nest-interceptor.interface'
import { RpcException } from '@nestjs/microservices'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Observable, catchError, throwError } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class InternalGrpcInterceptor implements NestInterceptor {
  /**
   * https://github.com/cloudendpoints/esp/blob/2c4f1df4b9cc82e0682ce4713d470b61b8f970de/src/api_manager/utils/status.cc#L364
   * List RPC code error equivalent to HTTP status code 5xx
   */
  private readonly GRPC_CODE_LOG_ERROR = [
    GRPC_STATUS.UNAVAILABLE,
    GRPC_STATUS.DEADLINE_EXCEEDED,
    GRPC_STATUS.UNIMPLEMENTED,
    GRPC_STATUS.INTERNAL,
  ]

  constructor(
    @InjectPinoLogger(InternalGrpcInterceptor.name)
    private readonly logger: PinoLogger,
  ) {}
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now()
    const className = _context.getClass().name
    const functionName = _context.getHandler().name

    this.logger.info({
      class: className,
      function: functionName,
      body: _context.switchToRpc().getData(),
      msg: 'request info',
    })

    return next.handle().pipe(
      catchError((exception) => {
        const rpcException =
          exception instanceof RpcException
            ? exception
            : this.convertHttpToRpcException(exception)

        let code: GRPC_STATUS = GRPC_STATUS.UNKNOWN
        if (typeof rpcException.getError() !== 'string') {
          code = (rpcException.getError() as unknown as any).code
        }
        const bodyError = {
          msg: 'response info',
          error: rpcException.message,
          responseCode: code,
          msgErr: rpcException.message,
          responseTime: `${Date.now() - now}ms`,
          body: _context.switchToRpc().getData(),
        }
        this.GRPC_CODE_LOG_ERROR.includes(code)
          ? this.logger.error(bodyError)
          : this.logger.warn(bodyError)

        return throwError(() => rpcException)
      }),
      tap({
        next: (data) =>
          this.logger.info({
            msg: 'response info',
            data: data,
            responseCode: GRPC_STATUS.OK,
            responseTime: `${Date.now() - now}ms`,
          }),
      }),
    )
  }

  private convertHttpToRpcException(exception: unknown) {
    if (exception instanceof BadRequestException) {
      return new BadRequestRpcException(exception.message)
    }
    if (exception instanceof ValidationException) {
      const msg = exception
        .getErrors()
        .map((e) => Object.values(e.constraints || {}).join(', '))
        .join(', ')

      return new BadRequestRpcException(msg || exception.message)
    }
    if (exception instanceof NotFoundException) {
      return new NotFoundRpcException(exception.message)
    }
    if (exception instanceof ForbiddenException) {
      return new ForbiddenRpcException(exception.message)
    }
    if (exception instanceof ConflictException) {
      return new ConflictRpcException(exception.message)
    }
    if (exception instanceof RequestTimeoutException) {
      return new RequestTimeoutRpcException(exception.message)
    }
    if (exception instanceof UnauthorizedException) {
      return new UnauthorizedRpcException(exception.message)
    }
    if (exception instanceof ServiceUnavailableException) {
      return new ServiceUnavailableRpcException(exception.message)
    }
    return new InternalRpcException((exception as any)?.message)
  }
}
