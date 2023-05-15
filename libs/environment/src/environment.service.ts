import { RedisModuleOptions } from '@app/redis/redis-core'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MysqlConnectionCredentialsOptions } from 'typeorm/driver/mysql/MysqlConnectionCredentialsOptions'

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get environment variable
   * @param key
   * @returns T if key is defined, otherwise throw an error
   */
  public get<T>(key: string): T {
    const result = this.configService.get(key)

    if (result === undefined || result === null) {
      throw new Error(`Environment variable ${key} is not defined`)
    }
    return result
  }

  public get mysqlOptions(): MysqlConnectionCredentialsOptions {
    return {
      host: this.configService.get<string>('db.host'),
      port: this.configService.get<number>('db.port'),
      username: this.configService.get<string>('db.username'),
      password: this.configService.get<string>('db.password'),
      database: this.configService.get<string>('db.database'),
    }
  }

  public get redisCacheOptions(): RedisModuleOptions {
    const redisConfig: RedisModuleOptions = {
      config: {
        host: this.get<string>('redis.host'),
        port: this.get<number>('redis.port'),
        db: this.get<number>('redis.cache.db'),
      },
    }

    const password = this.get<string>('redis.pass')
    const prefix = this.get<string>('redis.prefix')

    if (password) {
      redisConfig.config.password = password
    }

    if (prefix) {
      redisConfig.config.keyPrefix = prefix
    }

    return redisConfig
  }
}
