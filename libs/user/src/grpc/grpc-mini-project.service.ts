import { Inject, Injectable } from '@nestjs/common'
import {
  ICreateUserResponse,
  IGrpcMiniProjectService,
  IUpdateUserRequest,
  IUpdateUserResponse,
  IUser,
} from './interface/grpc-mini-project.interface'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import { InjectPinoLogger } from 'nestjs-pino'
import { Logger } from 'pino'
import { INTERNAL_MINI_PROJECT_GRPC_CONSTANT } from './constants'
import { lastValueFrom, map } from 'rxjs'
import { status } from '@grpc/grpc-js'
import { mapRpcExceptionToHttpException } from '@app/common/utils/utils'

@Injectable()
export class GrpcMiniProjectService {
  private userService: IGrpcMiniProjectService

  constructor(
    @Inject(INTERNAL_MINI_PROJECT_GRPC_CONSTANT.mini_project.injectKey)
    private readonly clientGrpc: ClientGrpc,
    @InjectPinoLogger(GrpcMiniProjectService.name)
    private readonly logger: Logger,
  ) {
    this.userService = this.clientGrpc.getService(
      INTERNAL_MINI_PROJECT_GRPC_CONSTANT.mini_project.service,
    )
    console.log(this.userService)
  }

  async createUserGrpc(
    name: string,
    birthday: string,
    email: string,
  ): Promise<ICreateUserResponse> {
    try {
      return lastValueFrom(
        this.userService
          .CreateUser({ name, birthday, email })
          .pipe(map((result) => result)),
      )
    } catch (error) {
      console.log(error)
      this.logger.error({ err: error }, 'createUserGrpc')
      throw mapRpcExceptionToHttpException(error)
    }
  }

  async updateUserGrpc(
    request: IUpdateUserRequest,
  ): Promise<IUpdateUserResponse> {
    try {
      return lastValueFrom(
        this.userService.UpdateUser(request).pipe(map((result) => result)),
      )
    } catch (error) {
      console.log(error)
      this.logger.error({ err: error }, 'createUserGrpc')
      throw mapRpcExceptionToHttpException(error)
    }
  }

  async getUserGrpc(id: string): Promise<IUser | null> {
    try {
      const result = await lastValueFrom(
        this.userService.GetOneUser({ id }).pipe(map((result) => result)),
      )

      if (!result) {
        throw new RpcException({
          code: status.NOT_FOUND,
          details: 'User doesnt not exist',
        })
      }
      return result
    } catch (error) {
      this.logger.error({ id, error: error }, 'get single user error')
      throw mapRpcExceptionToHttpException(error)
    }
  }
}
