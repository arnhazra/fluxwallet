import { CreateDebtRequestDto } from "../../dto/request/create-debt.request.dto"

export class UpdateDebtCommand {
  constructor(
    public readonly userId: string,
    public readonly debtId: string,
    public readonly dto: CreateDebtRequestDto
  ) {}
}
