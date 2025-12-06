import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { CreateSpaceCommand } from "../impl/create-space.command"
import { SpaceRepository } from "../../space.repository"
import { createOrConvertObjectId } from "@/shared/entity/entity.schema"

@CommandHandler(CreateSpaceCommand)
export class CreateSpaceCommandHandler implements ICommandHandler<CreateSpaceCommand> {
  constructor(private readonly repository: SpaceRepository) {}

  async execute(command: CreateSpaceCommand) {
    const {
      userId,
      dto: { spaceName },
    } = command
    return await this.repository.create({
      userId: createOrConvertObjectId(userId),
      spaceName,
    })
  }
}
