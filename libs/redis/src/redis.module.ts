import { EnvironmentService } from '@app/environment'
import { DynamicModule, Module } from '@nestjs/common'
import { RedisCoreModule } from './redis-core'

@Module({})
export class RedisModule {
  static registerAsync(connection: string): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        RedisCoreModule.forRootAsync(
          {
            useFactory: (envService: EnvironmentService) =>
              envService.redisCacheOptions,
            inject: [EnvironmentService],
          },
          connection,
        ),
      ],
      exports: [RedisCoreModule],
    }
  }
}
