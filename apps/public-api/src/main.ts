import { EnvironmentService } from '@app/environment'
import { Logger as Log } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Logger } from 'nestjs-pino'
import { PublicApiModule } from './public-api.module'

async function bootstrap() {
  const app = await NestFactory.create(PublicApiModule)
  const envService = app.get(EnvironmentService)
  app.useLogger(app.get(Logger))

  await app.listen(envService.get<number>('api_port'), () =>
    Log.log(
      'API is running on port ' + envService.get<number>('api_port'),
      'Bootstrap',
    ),
  )
}
bootstrap()
