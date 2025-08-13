import { Module } from "@nestjs/common"
import { CoreModule } from "./core/core.module"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { EntityModule } from "./shared/entity/entity.module"
import { AppController } from "./app.controller"
import { PairPilotModule } from "./pairpilot/pairpilot.module"

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CoreModule,
    EntityModule,
    PairPilotModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
