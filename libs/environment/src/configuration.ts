import { isNil } from '@nestjs/common/utils/shared.utils'

export default () => ({
  app_env: process.env.APP_ENV,
  api_port: process.env.PUBLIC_API_PORT,
  consumer_port: process.env.PUBLIC_CONSUMER_PORT,
  db: {
    is_logging: process.env.DB_LOGGING ? +process.env.DB_LOGGING : 0,
    host: process.env.DB_MINI_PROJECT_HOST,
    port: process.env.DB_MINI_PROJECT_PORT,
    username: process.env.DB_MINI_PROJECT_USERNAME,
    password: process.env.DB_MINI_PROJECT_PASSWORD,
    database: process.env.DB_MINI_PROJECT_DATABASE,
  },
  redis: {
    host: process.env.REDIS_MINI_PROJECT_HOST,
    port: process.env.REDIS_MINI_PROJECT_PORT,
    pass: process.env.REDIS_MINI_PROJECT_PASS,
    prefix: process.env.REDIS_MINI_PROJECT_PREFIX,
    cache: {
      db: process.env.REDIS_MINI_PROJECT_DB,
    },
  },
  kafka: {
    uri: (process.env.KAFKA_URI || '')
      .split(',')
      .filter((val) => !isNil(val) && val !== ''),
    consumer: process.env.KAFKA_CONSUMER,
    version: process.env.KAFKA_VERSION,
    topic: {
      mini_project: {
        test_send_message: process.env.KAFKA_TOPIC_TEST_SEND_MESSAGE,
      },
    },
  },
  pino: {
    no_color: process.env.NO_COLOR,
    log_level: process.env.LOG_LEVEL,
  },
  ws: {
    url: process.env.WS_URL,
    topic: {
      variable_cache: process.env.WS_TOPIC,
    },
  },
  grpc: {
    url: process.env.EXTERNAL_MINI_PROJECT_GRPC_URI,
  },
  mini_project_grpc_url: process.env.INTERNAL_MINI_PROJECT_GRPC_URI,
})
