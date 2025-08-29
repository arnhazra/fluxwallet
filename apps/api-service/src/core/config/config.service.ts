import { BadRequestException, Injectable } from "@nestjs/common"
import { productConfig } from "./data/products.config"
import { solutionConfig } from "./data/solutions.config"
import { subscriptionConfig } from "./data/subscription.config"
import { technologyConfig } from "./data/technology.config"

@Injectable()
export class ConfigService {
  getConfig(configName: string) {
    try {
      if (configName === "products") {
        return productConfig
      }
      if (configName === "solutions") {
        return solutionConfig
      }
      if (configName === "subscription") {
        return subscriptionConfig
      }
      if (configName === "technology") {
        return technologyConfig
      }
      throw new Error()
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
