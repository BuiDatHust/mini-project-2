import { DynamicModule, Module } from '@nestjs/common'
import { MINI_PROJECT_CONNECTION } from './constant'
import { UserRepository } from './repositories/user.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EntitySchema, MixedList } from 'typeorm'
import { EnvironmentService } from '@app/environment'

@Module({})
export class DatabaseModule {
  static forRoot(
    connection = MINI_PROJECT_CONNECTION,
    entities: MixedList<string | EntitySchema<any>> | undefined = [
      __dirname + '/**/*.entity{.ts,.js}',
    ],
    maxConnection = 10,
  ): DynamicModule {
    const repositories = [UserRepository]

    return {
      module: DatabaseModule,
      global: true,
      imports: [
        TypeOrmModule.forRootAsync({
          name: connection,
          useFactory: async (envService: EnvironmentService) => {
            return {
              type: 'mysql',
              extra: {
                connectionLimit: maxConnection,
              },
              ...envService.mysqlOptions,
              entities: entities,
              autoLoadEntities: false,
              synchronize: false,
              logging: !!envService.get<number>('db.is_logging'),
            }
          },
          inject: [EnvironmentService],
        }),
      ],
      providers: repositories,
      exports: repositories,
    }
  }
}
