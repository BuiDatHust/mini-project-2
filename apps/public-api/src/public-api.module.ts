import { DatabaseModule } from '@app/database'
import { EnvironmentModule } from '@app/environment'
import { UserModule } from '@app/user'
import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { PinoModule } from '@app/logger/pino/pino.module'
import { KafkaProducerModule } from '@app/kafka/producer/kafka-producer.module'

@Module({
  imports: [
    EnvironmentModule.forRoot(),
    DatabaseModule.forRoot(),
    PinoModule.forRootAsync('public-api'),
    UserModule,
    KafkaProducerModule,
  ],
  controllers: [UserController],
})
export class PublicApiModule {}
