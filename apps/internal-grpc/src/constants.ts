export const MINI_PROJECT_PACKAGE = 'user'
export const MINI_PROJECT_SERVICE = 'UserService'

const baseUrl = process.cwd() + '/dist/libs/proto-schema/'

export const GRPC_SERVICE = {
  mini_project: {
    package: MINI_PROJECT_PACKAGE,
    service: MINI_PROJECT_SERVICE,
    protoPath: baseUrl + 'proto/user.proto',
  },
}
