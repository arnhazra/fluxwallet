import { Controller, BadRequestException, Get, Param } from "@nestjs/common"
import { ConfigService } from "./config.service"

@Controller("config")
export class ConfigController {
  constructor(private readonly service: ConfigService) {}

  @Get(":configName")
  getConfig(@Param("configName") configName: string) {
    try {
      return this.service.getConfig(configName)
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
