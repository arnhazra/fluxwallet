import { Controller, BadRequestException, Get, Param } from "@nestjs/common"
import { ConfigService } from "./config.service"
import { statusMessages } from "@/shared/constants/status-messages"

@Controller("platform/config")
export class ConfigController {
  constructor(private readonly service: ConfigService) {}

  @Get(":configName")
  async getConfig(@Param("configName") configName: string) {
    try {
      return await this.service.getConfig(configName)
    } catch (error) {
      throw new BadRequestException(statusMessages.configNotFound)
    }
  }
}
