import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { AdvisorXRepository } from "../../advisorx.repository"
import { CreateThreadCommand } from "../impl/create-thread.command"
import objectId from "@/shared/utils/convert-objectid"

@CommandHandler(CreateThreadCommand)
export class CreateThreadCommandHandler
  implements ICommandHandler<CreateThreadCommand>
{
  constructor(private readonly repository: AdvisorXRepository) {}

  async execute(command: CreateThreadCommand) {
    const { userId, threadId, prompt, response } = command
    return await this.repository.create({
      userId: objectId(userId),
      threadId: objectId(threadId),
      prompt,
      response,
    })
  }
}
