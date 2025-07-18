import { CreatePortfolioRequestDto } from "../../dto/request/create-portfolio.request.dto"

export class CreatePortfolioCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: CreatePortfolioRequestDto
  ) {}
}
