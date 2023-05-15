import { Controller, UseInterceptors } from '@nestjs/common'
import { UserService } from '@app/user'
import { GrpcMethod } from '@nestjs/microservices'
import { GRPC_SERVICE } from './constants'
import { GrpcCreateUserRequestDto } from '@app/user/dto/grpc-create-user.dto'
import { instanceToPlain } from 'class-transformer'
import { GrpcGetUserRequestDto } from '@app/user/dto/grpc-get-user.dto'
import { InternalGrpcInterceptor } from './internal-grpc.inteceptor'

@Controller()
@UseInterceptors(InternalGrpcInterceptor)
export class InternalGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(GRPC_SERVICE.mini_project.service, 'CreateUser')
  public async createGrpcUser(request: GrpcCreateUserRequestDto) {
    return instanceToPlain(await this.userService.createUser(request))
  }

  @GrpcMethod(GRPC_SERVICE.mini_project.service, 'GetOneUser')
  public async getGrpcUser(request: GrpcGetUserRequestDto) {
    return instanceToPlain(await this.userService.getUser(request))
  }
}
