import { Module } from "@nestjs/common"
import { DiscoverService } from "./discover.service"
import { DiscoverController } from "./discover.controller"
import { HttpModule } from "@nestjs/axios"

@Module({
  imports: [HttpModule],
  controllers: [DiscoverController],
  providers: [DiscoverService],
})
export class DiscoverModule {}
