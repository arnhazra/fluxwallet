import { Controller, BadRequestException, Get } from "@nestjs/common"
import { ConfigService } from "./config.service"

@Controller("config")
export class ConfigController {
  constructor(private readonly service: ConfigService) {}

  @Get("products")
  getProductConfig() {
    try {
      return this.service.getProductConfig()
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
