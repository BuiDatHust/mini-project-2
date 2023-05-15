import { EnvironmentService } from '@app/environment'

export const KAFKA_TOPIC_METADATA = '__kafka-topic'

// https://github.com/nestjs/nest/issues/3912
export function KafkaTopic(config: string | keyof EnvironmentService): any {
  return (
    target: any,
    name: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(KAFKA_TOPIC_METADATA, config, descriptor.value)
    return descriptor
  }
}
