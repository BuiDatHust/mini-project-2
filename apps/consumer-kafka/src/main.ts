import { KafkaDecoratorProcessorService } from '@app/kafka/consumer/kafka-decorator-processor.service'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { Logger } from 'nestjs-pino'
import { CPLKafkaServer } from '@app/kafka/consumer/mini-project-kafka-server'
import { ConsumerKafkaController } from './consumer-kafka.controller'
import { ConsumerKafkaModule } from './consumer-kafka.module'

async function bootstrap() {
  const app = await NestFactory.create(ConsumerKafkaModule)
  app.useLogger(app.get(Logger))

  const kafkaServer = await app.resolve<CPLKafkaServer>(CPLKafkaServer)

  await app
    .get(KafkaDecoratorProcessorService)
    .processKafkaDecorators([ConsumerKafkaController])

  app.connectMicroservice<MicroserviceOptions>({
    strategy: kafkaServer,
  })

  await app.startAllMicroservices()
  await app.listen(0)
  console.log('Consumer kafka is running')
}
bootstrap()
