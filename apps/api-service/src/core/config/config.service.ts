import { BadRequestException, Injectable } from "@nestjs/common"
import { productConfig } from "./data/products.config"
import { solutionConfig } from "./data/solutions.config"

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
      throw new Error()
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
