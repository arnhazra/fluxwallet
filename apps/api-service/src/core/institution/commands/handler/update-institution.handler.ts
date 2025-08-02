import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { InstitutionRepository } from "../../institution.repository"
import objectId from "@/shared/utils/convert-objectid"
import { UpdateInstitutionCommand } from "../impl/update-institution.command"

@CommandHandler(UpdateInstitutionCommand)
export class UpdateInstitutionCommandHandler
  implements ICommandHandler<UpdateInstitutionCommand>
{
  constructor(private readonly repository: InstitutionRepository) {}

  async execute(command: UpdateInstitutionCommand) {
    const {
      institutionId,
      dto: { institutionType, institutionName },
    } = command
    return await this.repository.update(
      { _id: objectId(institutionId) },
      {
        institutionType,
        institutionName,
      }
    )
  }
}
