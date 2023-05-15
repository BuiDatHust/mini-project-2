import { Exclude, Expose, Type } from 'class-transformer'

export class KafkaPayloadDto<T> {
  @Expose({ name: 'create_time' })
  @Type(() => String)
  createTime: string

  @Expose()
  @Type(() => Number)
  version: number

  @Expose()
  @Type((options) => {
    if (!options) return Object

    return (options.newObject as KafkaPayloadDto<T>).type
  })
  data: T

  @Exclude()
  private type

  constructor(type) {
    this.type = type
  }
}
