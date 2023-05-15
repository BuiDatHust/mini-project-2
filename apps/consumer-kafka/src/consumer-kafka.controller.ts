import { Controller, Get } from '@nestjs/common'
import { KafkaTopic } from '@app/kafka/consumer/decorators'
import { Payload } from '@nestjs/microservices'
import { ConsumerKafkaService } from './consumer-kafka.service'

@Controller()
export class ConsumerKafkaController {
  constructor(private readonly consumerKafkaService: ConsumerKafkaService) {}

  @KafkaTopic('kafka.topic.mini_project.test_send_message')
  public async recieveMessage(@Payload() message: any) {
    console.log(message)
    const msg = message.data.message
    this.consumerKafkaService.recieveMessage(msg)
  }
}
