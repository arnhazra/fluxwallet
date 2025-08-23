import { BadRequestException, Injectable } from "@nestjs/common"

@Injectable()
export class ConfigService {
  async getConfig() {
    try {
      return {}
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
