import { Injectable } from "@nestjs/common"
import { RedisService } from "@/shared/redis/redis.service"
import { statusMessages } from "@/shared/constants/status-messages"

@Injectable()
export class ConfigService {
  constructor(private readonly redisService: RedisService) {}
  async getConfig(configName: string) {
    try {
      const data = await this.redisService.get(configName)
      if (!data) throw new Error(statusMessages.configNotFound)
      return JSON.parse(await this.redisService.get(configName))
    } catch (error) {
      throw error
    }
  }
}
