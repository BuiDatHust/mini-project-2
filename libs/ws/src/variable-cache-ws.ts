import { Injectable } from '@nestjs/common'
import { WsService } from './ws.service'

@Injectable()
export class VariableCacheWs {
  constructor(private readonly wsService: WsService) {}

  public async sendVariableCached(value: string) {
    const topic = this.wsService.buildWsTopicForUser('ws.topic.variable_cache')
    // transform data for FE
    await this.wsService.publish(topic, value)
  }
}
