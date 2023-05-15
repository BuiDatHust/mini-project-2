import { EnvironmentService } from '@app/environment'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { GrpcOptions, Transport } from '@nestjs/microservices'
import { InternalGrpcModule } from './internal-grpc.module'
import { GRPC_SERVICE } from './constants'

async function bootstrap() {
  const app = await NestFactory.create(InternalGrpcModule)

  const envService = app.get(EnvironmentService)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const uri = envService.get<string>('mini_project_grpc_url')
  app.connectMicroservice<GrpcOptions>(
    {
      transport: Transport.GRPC,
      options: {
        url: uri,
        loader: {
          keepCase: true,
        },
        package: [GRPC_SERVICE.mini_project.package],
        protoPath: [GRPC_SERVICE.mini_project.protoPath],
      },
    },
    {
      inheritAppConfig: true,
    },
  )
  await app.init()

  app
    .startAllMicroservices()
    .then(() => {
      console.log(`Internal gRPC running at: ${uri}`)
    })
    .catch((err) => {
      console.log(err)
    })
}
bootstrap()
