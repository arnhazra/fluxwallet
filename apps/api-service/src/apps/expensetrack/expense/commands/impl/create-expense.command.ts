import { CreateExpenseRequestDto } from "../../dto/request/create-expense.request.dto"

export class CreateExpenseCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: CreateExpenseRequestDto
  ) {}
}
