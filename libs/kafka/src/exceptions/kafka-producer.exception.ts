import { BadRequestException } from '@nestjs/common'

export class KafkaProducerException extends BadRequestException {
  constructor(topic: string) {
    super('Could not send message to Kafka, with topic: ' + topic)
  }
}
