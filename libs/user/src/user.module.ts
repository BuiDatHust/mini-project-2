import { Module } from '@nestjs/common'
import { GrpcMiniProjectService } from './grpc/grpc-mini-project.service'
import { INTERNAL_MINI_PROJECT_GRPC_CONSTANT } from './grpc/constants'
import { EnvironmentService } from '@app/environment'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { UserService } from './user.service'
import { MINI_PROJECT_CACHE } from '@app/redis/constants'
import { RedisModule } from '@app/redis'
import { WsModule } from '@app/ws'

@Module({
  imports: [RedisModule.registerAsync(MINI_PROJECT_CACHE), WsModule],
  providers: [
    GrpcMiniProjectService,
    {
      provide: INTERNAL_MINI_PROJECT_GRPC_CONSTANT.mini_project.injectKey,
      useFactory: (envService: EnvironmentService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [INTERNAL_MINI_PROJECT_GRPC_CONSTANT.mini_project.package],
            protoPath: [
              INTERNAL_MINI_PROJECT_GRPC_CONSTANT.mini_project.protoPath,
            ],
            url: envService.get<string>('grpc.url'),
            channelOptions: {
              'grpc.service_config': JSON.stringify({
                loadBalancingConfig: [{ round_robin: {} }],
              }),
            },
          },
        })
      },
      inject: [EnvironmentService],
    },
    UserService,
  ],

  exports: [UserService, GrpcMiniProjectService],
})
export class UserModule {}
