import { Injectable } from "@nestjs/common"
import { RedisService } from "@/shared/redis/redis.service"

@Injectable()
export class ConfigService {
  constructor(private readonly redisService: RedisService) {}
  async getConfig(configName: string) {
    try {
      if (configName === "products") {
        return JSON.parse(await this.redisService.get("productConfig"))
      }
      if (configName === "solutions") {
        return JSON.parse(await this.redisService.get("solutionConfig"))
      }
      if (configName === "subscription") {
        return JSON.parse(await this.redisService.get("subscriptionConfig"))
      }
      throw new Error()
    } catch (error) {
      throw error
    }
  }
}
