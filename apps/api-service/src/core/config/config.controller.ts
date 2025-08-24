import { Controller, BadRequestException, UseGuards, Get } from "@nestjs/common"
import { ConfigService } from "./config.service"
import { ProductConfig } from "./data/products.config"

@Controller("config")
export class ConfigController {
  constructor(private readonly service: ConfigService) {}

  @Get("products")
  getProductConfig(): ProductConfig[] {
    try {
      return this.service.getProductConfig()
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
