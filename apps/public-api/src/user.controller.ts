import { BaseResponse } from '@app/common/base-dto/base-response.dto'
import { CreateUserRequestDto } from '@app/database/dto/create-user.dto'
import { UpdateUserRequestDto } from '@app/database/dto/update-user.dto'
import { MiniProjectKafka } from '@app/kafka/producer/mini-project-producer'
import { UserService } from '@app/user'
import { GrpcMiniProjectService } from '@app/user/grpc/grpc-mini-project.service'
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common'

@Controller('user')
export class UserController {
  constructor(
    private readonly grpcMiniProjectService: GrpcMiniProjectService,
    private readonly userService: UserService,
    private readonly miniProjectKafka: MiniProjectKafka,
  ) {}

  @Get(':id(\\d+)')
  public async getUser(@Param('id') id: string) {
    const user = await this.grpcMiniProjectService.getUserGrpc(id)
    return new BaseResponse(user, HttpStatus.OK)
  }

  @Get('send_socket/:key/:value')
  public async sendSocket(
    @Param('key') key: string,
    @Param('value') value: string,
  ) {
    if (!key || !value) {
      return new BaseResponse({}, HttpStatus.BAD_REQUEST)
    }

    await this.userService.setCacheUser(key, value)
    return new BaseResponse({}, HttpStatus.OK)
  }

  @Get('send_kafka/:message')
  public async sendKafka(@Param('message') message: string) {
    if (!message) {
      return new BaseResponse({}, HttpStatus.BAD_REQUEST)
    }
    await this.miniProjectKafka.sendTestMessage(message)

    return new BaseResponse({}, HttpStatus.OK)
  }

  @Put('')
  public async updateUser(@Body() updateUserRequest: UpdateUserRequestDto) {
    await this.grpcMiniProjectService.updateUserGrpc(updateUserRequest)
    return new BaseResponse({}, HttpStatus.OK, 'Update user successfully!')
  }

  @Post('')
  public async createUser(@Body() createUserRequest: CreateUserRequestDto) {
    const { name, email, birthday } = createUserRequest
    await this.grpcMiniProjectService.createUserGrpc(name, email, birthday)

    return new BaseResponse({}, HttpStatus.OK, 'Create user successfully!')
  }
}
