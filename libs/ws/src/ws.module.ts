import { Module } from '@nestjs/common'
import { WsService } from './ws.service'
import { VariableCacheWs } from './variable-cache-ws'

@Module({
  providers: [WsService, VariableCacheWs],
  exports: [WsService, VariableCacheWs],
})
export class WsModule {}
