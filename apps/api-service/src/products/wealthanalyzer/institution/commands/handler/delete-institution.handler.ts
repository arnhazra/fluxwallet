import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { DeleteInstitutionCommand } from "../impl/delete-institution.command"
import { InstitutionRepository } from "../../institution.repository"
import objectId from "@/shared/utils/convert-objectid"

@CommandHandler(DeleteInstitutionCommand)
export class DeleteInstitutionCommandHandler
  implements ICommandHandler<DeleteInstitutionCommand>
{
  constructor(private readonly repository: InstitutionRepository) {}

  async execute(command: DeleteInstitutionCommand) {
    const { institutionId } = command
    return await this.repository.delete({ _id: objectId(institutionId) })
  }
}
