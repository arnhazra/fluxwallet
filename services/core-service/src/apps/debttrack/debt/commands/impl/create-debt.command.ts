import { CreateDebtRequestDto } from "../../dto/request/create-debt.request.dto"

export class CreateDebtCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: CreateDebtRequestDto
  ) {}
}
