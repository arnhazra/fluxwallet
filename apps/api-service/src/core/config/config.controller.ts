import { Controller, BadRequestException, UseGuards, Get } from "@nestjs/common"
import { ConfigService } from "./config.service"
import { AuthGuard } from "@/auth/auth.guard"

@Controller("config")
export class ConfigController {
  constructor(private readonly service: ConfigService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getConfig() {
    try {
      return await this.service.getConfig()
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
