import { EnvironmentService } from '@app/environment'
import { DynamicModule, Module } from '@nestjs/common'
import { LoggerModule, Params } from 'nestjs-pino'
import { loggerOptions } from '../utils'

@Module({})
export class PinoModule {
  static forRootAsync(context: string): DynamicModule {
    return {
      module: PinoModule,
      global: true,
      imports: [
        LoggerModule.forRootAsync({
          useFactory: (envService: EnvironmentService) => {
            const params: Params = {
              pinoHttp: loggerOptions(
                envService.get('app_env'),
                envService.get('pino.log_level'),
                context,
              ),
            }

            return params
          },
          inject: [EnvironmentService],
        }),
      ],
      providers: [PinoModule],
      exports: [PinoModule],
    }
  }
}
