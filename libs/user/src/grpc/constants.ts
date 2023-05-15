import { MINI_PROJECT_PACKAGE } from 'apps/internal-grpc/src/constants'
import { MINI_PROJECT_SERVICE } from 'apps/internal-grpc/src/constants'

const baseUrl = process.cwd() + '/dist/libs/proto-schema/'

export const INTERNAL_MINI_PROJECT_GRPC_CONSTANT = {
  mini_project: {
    injectKey: 'INTERNAL_MINI_PROJECT_GRPC_CLIENT_GRPC_INJECT_KEY',
    package: MINI_PROJECT_PACKAGE,
    service: MINI_PROJECT_SERVICE,
    protoPath: baseUrl + 'proto/user.proto',
  },
}

export const MINI_PROJECT_DEFAULT_RETRIES = 2
