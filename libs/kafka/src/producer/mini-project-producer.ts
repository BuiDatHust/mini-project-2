import { EnvironmentService } from '@app/environment'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { KafkaProducerService } from './kafka-producer.service'

@Injectable()
export class MiniProjectKafka {
  constructor(
    private readonly kafkaProducer: KafkaProducerService,
    private readonly envService: EnvironmentService,
    @InjectPinoLogger(MiniProjectKafka.name)
    private readonly logger: PinoLogger,
  ) {}

  public async sendTestMessage(message: string) {
    try {
      const topicKey = 'kafka.topic.mini_project.test_send_message'
      const topic = this.envService.get<string>(topicKey)
      const version = this.envService.get<number>('kafka.version')
      const dataKafka = { message }

      await this.kafkaProducer.publish(topic, dataKafka, version)

      this.logger.debug('send test message to kafka successfully')
    } catch (error) {
      this.logger.warn('Send test message to kafka error')
      throw error
    }
  }
}
