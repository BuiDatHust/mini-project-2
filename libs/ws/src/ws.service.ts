import { currentMilliTime, sleep } from '@app/common/utils/utils'
import { EnvironmentService } from '@app/environment'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { isNil } from '@nestjs/common/utils/shared.utils'
import * as mqtt from 'mqtt'
import { MqttClient } from 'mqtt'
import { PinoLogger } from 'nestjs-pino'

@Injectable()
export class WsService implements OnModuleInit {
  private ws: MqttClient

  constructor(
    private readonly envService: EnvironmentService,
    private readonly logger: PinoLogger,
  ) {}

  onModuleInit() {
    this.connect()
  }

  buildWsTopicForUser(topicKey: string): string {
    const topic = this.envService.get<string>(topicKey)
    console.log(topic)
    return `${topic}`
  }

  async publish(topic: string, message: string) {
    while (isNil(this.ws)) {
      this.logger.warn('waiting for ws to connect')
      await sleep(2000)
    }

    const jsonData = {
      data: message,
      last_update: currentMilliTime(),
    }

    this.logger.debug({ data: jsonData }, 'send ws')

    this.ws.publish(
      topic,
      JSON.stringify(jsonData),
      (error?: Error, packet?: mqtt.Packet) => {
        if (error) {
          this.logger.error({ data: jsonData, error }, 'send ws error')
          throw error
        }
      },
    )
  }

  private connect() {
    this.logger.debug('start connect')

    const wsUrl = this.envService.get<string>('ws.url')

    this.ws = mqtt
      .connect(wsUrl)
      .once('connect', () => {
        this.logger.debug('ws connected')
      })
      .once('close', async () => {
        this.logger.debug('ws close')
        this.logger.debug('ws will reconnect in 10s')
        await sleep(10000)
        this.connect()
      })
  }

  public getClient(): MqttClient {
    return this.ws
  }
}
