import { BadRequestException, Injectable } from "@nestjs/common"
import { productConfig } from "./data/products.config"
import { solutionConfig } from "./data/solutions.config"
import { subscriptionConfig } from "./data/subscription.config"

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
      throw new Error()
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
