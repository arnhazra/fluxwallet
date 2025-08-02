import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { CreateInstitutionCommand } from "../impl/create-institution.command"
import { InstitutionRepository } from "../../institution.repository"
import objectId from "@/shared/utils/convert-objectid"

@CommandHandler(CreateInstitutionCommand)
export class CreateInstitutionCommandHandler
  implements ICommandHandler<CreateInstitutionCommand>
{
  constructor(private readonly repository: InstitutionRepository) {}

  async execute(command: CreateInstitutionCommand) {
    const {
      userId,
      dto: { institutionType, institutionName },
    } = command
    return await this.repository.create({
      userId: objectId(userId),
      institutionType,
      institutionName,
    })
  }
}
