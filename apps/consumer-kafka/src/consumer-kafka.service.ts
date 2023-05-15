import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'

export class ConsumerKafkaService {
  constructor(
    @InjectPinoLogger(ConsumerKafkaService.name)
    private readonly logger: PinoLogger,
  ) {}
  recieveMessage(message: string) {
    this.logger.info(`recieve message ${message}`)
  }
}
