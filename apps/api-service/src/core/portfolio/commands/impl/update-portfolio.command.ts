import { CreatePortfolioRequestDto } from "../../dto/request/create-portfolio.request.dto"

export class UpdatePortfolioCommand {
  constructor(
    public readonly userId: string,
    public readonly portfolioId: string,
    public readonly dto: CreatePortfolioRequestDto
  ) {}
}
