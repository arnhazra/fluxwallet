import { Controller, BadRequestException, Get } from "@nestjs/common"
import { SolutionService } from "./solution.service"

@Controller("solutions")
export class SolutionController {
  constructor(private readonly solutionService: SolutionService) {}

  @Get()
  async getSolution() {
    try {
      return await this.solutionService.getSolution()
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
