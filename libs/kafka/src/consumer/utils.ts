import { EnvironmentService } from '@app/environment'
import { KafkaOptions, Transport } from '@nestjs/microservices'
import { Partitioners } from 'kafkajs'

export const getKafkaServerOptions = (
  envService: EnvironmentService,
): KafkaOptions => {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: envService.get<string[]>('kafka.uri'),
      },
      consumer: {
        groupId: envService.get<string>('kafka.consumer'),
        allowAutoTopicCreation: true,
        retry: {
          restartOnFailure: async () => true,
        },
        maxWaitTimeInMs: 100,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
      subscribe: {
        fromBeginning: true,
      },
      run: {
        autoCommit: true,
      },
    },
  }
}
