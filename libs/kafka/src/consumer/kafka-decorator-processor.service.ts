import { EnvironmentService } from '@app/environment'
import { Injectable } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { KAFKA_TOPIC_METADATA } from './decorators'

@Injectable()
export class KafkaDecoratorProcessorService {
  constructor(private envService: EnvironmentService) {}

  processKafkaDecorators(types: any[]) {
    for (const type of types) {
      const propNames = Object.getOwnPropertyNames(type.prototype)
      for (const prop of propNames) {
        const propValue = Reflect.getMetadata(
          KAFKA_TOPIC_METADATA,
          Reflect.get(type.prototype, prop),
        )

        if (propValue) {
          const topic = this.envService.get(propValue)
          Reflect.decorate(
            [MessagePattern(topic)],
            type.prototype,
            prop,
            Reflect.getOwnPropertyDescriptor(type.prototype, prop),
          )
        }
      }
    }
  }
}
