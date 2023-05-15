import { UserRepository } from '@app/database/repositories/user.repository'
import { Injectable } from '@nestjs/common'
import {
  GrpcCreateUserRequestDto,
  GrpcCreateUserResponseDto,
} from './dto/grpc-create-user.dto'
import {
  GrpcGetUserRequestDto,
  GrpcGetUserResponseDto,
} from './dto/grpc-get-user.dto'
import { InjectRedis } from '@app/redis/redis-core'
import { MINI_PROJECT_CACHE } from '@app/redis/constants'
import { Redis } from 'ioredis'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { VariableCacheWs } from '@app/ws/variable-cache-ws'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRedis(MINI_PROJECT_CACHE) private readonly redisClient: Redis,
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger,
    private readonly variableCacheWs: VariableCacheWs,
  ) {}

  async createUser(
    request: GrpcCreateUserRequestDto,
  ): Promise<GrpcCreateUserResponseDto> {
    const success = await this.userRepository.createUser(request)
    return { status: success }
  }

  async getUser(
    request: GrpcGetUserRequestDto,
  ): Promise<GrpcGetUserResponseDto | null> {
    return this.userRepository.getById(request.id)
  }

  async setCacheUser(key: string, value: string): Promise<string> {
    const result = await this.redisClient.get(key)
    if (!result) {
      this.redisClient.set(key, value)
    }

    this.variableCacheWs.sendVariableCached(value)

    return result
  }
}
