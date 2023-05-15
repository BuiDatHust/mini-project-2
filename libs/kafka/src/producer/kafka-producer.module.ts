import { Module } from '@nestjs/common'
import { KafkaProducerService } from './kafka-producer.service'
import { MiniProjectKafka } from './mini-project-producer'

@Module({
  providers: [KafkaProducerService, MiniProjectKafka],
  exports: [KafkaProducerService, MiniProjectKafka],
})
export class KafkaProducerModule {}
