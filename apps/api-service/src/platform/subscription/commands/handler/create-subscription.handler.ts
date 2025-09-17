import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { CreateSubscriptionCommand } from "../impl/create-subscription.command"
import { SubscriptionRepository } from "../../repositories/subscription.repository"
import objectId from "@/shared/utils/convert-objectid"

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionCommandHandler
  implements ICommandHandler<CreateSubscriptionCommand>
{
  constructor(private readonly repository: SubscriptionRepository) {}

  async execute(command: CreateSubscriptionCommand) {
    const { userId, price } = command
    await this.repository.delete({ userId: objectId(userId) })
    return await this.repository.create({
      userId: objectId(userId),
      price,
    })
  }
}
