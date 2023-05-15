import { Module } from '@nestjs/common'
import { InternalGrpcController } from './internal-grpc.controller'
import { PinoModule } from '@app/logger/pino/pino.module'
import { EnvironmentModule } from '@app/environment'
import { DatabaseModule } from '@app/database'
import { UserModule } from '@app/user'

@Module({
  imports: [
    EnvironmentModule.forRoot(),
    DatabaseModule.forRoot(),
    PinoModule.forRootAsync('internal-grpc'),
    UserModule,
  ],
  controllers: [InternalGrpcController],
})
export class InternalGrpcModule {}
