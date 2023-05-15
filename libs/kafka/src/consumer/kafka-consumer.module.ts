import { Module } from '@nestjs/common'
import { KafkaDecoratorProcessorService } from './kafka-decorator-processor.service'

@Module({
  providers: [KafkaDecoratorProcessorService],
})
export class KafkaConsumerModule {}
