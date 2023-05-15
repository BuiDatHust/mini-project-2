import { Expose, Transform, plainToInstance } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator'

class EnvironmentVariables {
  @Expose()
  @IsString()
  @IsNotEmpty()
  APP_ENV: string

  @Expose()
  @Transform(({ value }) => {
    if (Number.isNaN(value)) return undefined
    return +value
  })
  @IsNumber()
  @IsNotEmpty()
  PUBLIC_API_PORT: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  DB_LOGGING: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  DB_MINI_PROJECT_HOST: string

  @Expose()
  @Transform(({ value }) => {
    if (Number.isNaN(value)) return undefined
    return +value
  })
  @IsNumber()
  @IsNotEmpty()
  DB_MINI_PROJECT_PORT: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  DB_MINI_PROJECT_USERNAME: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  DB_MINI_PROJECT_PASSWORD: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  DB_MINI_PROJECT_DATABASE: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  REDIS_MINI_PROJECT_HOST: string

  @Expose()
  @Transform(({ value }) => {
    if (Number.isNaN(value)) return undefined
    return +value
  })
  @IsNumber()
  @IsNotEmpty()
  REDIS_MINI_PROJECT_PORT: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  REDIS_MINI_PROJECT_DB: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  REDIS_MINI_PROJECT_PASS: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  REDIS_MINI_PROJECT_PREFIX: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  KAFKA_URI: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  KAFKA_CONSUMER: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  KAFKA_VERSION: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  SENTRY_DSN: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  NO_COLOR: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  LOG_LEVEL: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  WS_URL: string
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  })
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })
  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
