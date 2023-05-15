import { currentMilliTime, sleep } from '@app/common/utils/utils'
import { EnvironmentService } from '@app/environment'
import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common'
import { Kafka, Partitioners, Producer } from 'kafkajs'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { KafkaProducerException } from '../exceptions/kafka-producer.exception'

@Injectable()
export class KafkaProducerService
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly kafka: Kafka
  private readonly producer: Producer

  constructor(
    @InjectPinoLogger(KafkaProducerService.name)
    private readonly logger: PinoLogger,
    private readonly envService: EnvironmentService,
  ) {
    this.kafka = new Kafka({
      brokers: this.envService.get<string[]>('kafka.uri'),
    })

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      createPartitioner: Partitioners.LegacyPartitioner,
    })
  }

  async onModuleInit() {
    try {
      await this.producer.connect()
    } catch (error) {
      this.logger.error({ error }, 'connect kafka producer error')
    }
  }

  async onApplicationShutdown() {
    try {
      await this.producer.disconnect()
    } catch (error) {
      this.logger.error({ error }, 'disconnect kafka producer error')
    }
  }

  async publish(
    topic: string,
    data: unknown,
    version?: number,
    failedCounts = 0,
  ): Promise<boolean> {
    const payload = {
      create_time: currentMilliTime(),
      version: version || this.envService.get<unknown>('kafka.version'),
      data: data,
    }

    try {
      await this.producer.send({
        topic: topic,
        messages: [
          {
            value: JSON.stringify(payload),
          },
        ],
      })

      return true
    } catch (err) {
      if (++failedCounts > 3) {
        this.logger.error({ topic, data, err }, 'retry publish kafka error')
        throw new KafkaProducerException(topic)
      }

      await sleep(1000 * failedCounts)

      // retry
      return this.publish(topic, data, version, failedCounts)
    }
  }
}
