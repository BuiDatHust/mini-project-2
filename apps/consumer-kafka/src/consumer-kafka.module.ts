import { DatabaseModule } from '@app/database'
import { EnvironmentModule, EnvironmentService } from '@app/environment'
import { KafkaConsumerModule } from '@app/kafka/consumer/kafka-consumer.module'
import { PinoModule } from '@app/logger/pino/pino.module'
import { Module } from '@nestjs/common'
import { ConsumerKafkaController } from './consumer-kafka.controller'
import { CPLKafkaServer } from '@app/kafka/consumer/mini-project-kafka-server'
import { getKafkaServerOptions } from '@app/kafka/consumer/utils'
import { ConsumerKafkaService } from './consumer-kafka.service'

@Module({
  imports: [
    EnvironmentModule.forRoot(),
    KafkaConsumerModule,
    DatabaseModule.forRoot(),
    PinoModule.forRootAsync('consumer-kafka'),
  ],
  controllers: [ConsumerKafkaController],
  providers: [
    ConsumerKafkaService,
    {
      provide: CPLKafkaServer,
      useFactory: (envService: EnvironmentService) => {
        return new CPLKafkaServer(getKafkaServerOptions(envService).options)
      },
      inject: [EnvironmentService],
    },
  ],
})
export class ConsumerKafkaModule {}
