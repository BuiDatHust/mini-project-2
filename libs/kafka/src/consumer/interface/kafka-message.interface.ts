import { KafkaPayloadDto } from '../dto/kafka-payload.dto'

export interface KafkaMessage<T> {
  topic: string
  partition: number
  timestamp: string
  size: number
  attributes: number
  offset: string
  key: any
  value: KafkaPayloadDto<T>
  headers: Record<string, any>
}
