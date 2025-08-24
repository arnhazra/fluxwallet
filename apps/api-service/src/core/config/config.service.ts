import { BadRequestException, Injectable } from "@nestjs/common"
import { productConfig } from "./data/products.config"

@Injectable()
export class ConfigService {
  getProductConfig() {
    try {
      return productConfig
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
