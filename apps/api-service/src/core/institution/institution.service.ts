import { BadRequestException, Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { FindAllInstitutionQuery } from "./queries/impl/find-all-institutions.query"
import { FindInstitutionByIdQuery } from "./queries/impl/find-institution-by-id.query"
import { Institution } from "./schemas/institution.schema"
import { DeleteInstitutionCommand } from "./commands/impl/delete-institution.command"
import { CreateInstitutionCommand } from "./commands/impl/create-institution.command"
import { CreateInstitutionRequestDto } from "./dto/request/create-institution.request.dto"
import { UpdateInstitutionCommand } from "./commands/impl/update-institution.command"
import { OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/utils/event.map"
import { FindInstitutionByNameQuery } from "./queries/impl/find-institution-by-name.query"
import { ValuationService } from "../valuation/valuation.service"

@Injectable()
export class InstitutionService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly valuationService: ValuationService
  ) {}

  @OnEvent(EventMap.CreateInstitution)
  async createInstitution(
    userId: string,
    requestBody: CreateInstitutionRequestDto
  ) {
    try {
      return await this.commandBus.execute<
        CreateInstitutionCommand,
        Institution
      >(new CreateInstitutionCommand(userId, requestBody))
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @OnEvent(EventMap.GetInstitutionList)
  async findMyInstitutions(userId: string) {
    const institutions = await this.queryBus.execute<
      FindAllInstitutionQuery,
      Institution[]
    >(new FindAllInstitutionQuery(userId))

    const institutionsWithValuation = await Promise.all(
      institutions.map(async (institution) => {
        const valuation =
          await this.valuationService.calculateInstitutionValuation(
            institution._id.toString()
          )
        return {
          ...(institution.toObject?.() ?? institution),
          presentValuation: valuation,
        }
      })
    )

    return institutionsWithValuation
  }

  async findInstitutionById(reqUserId: string, institutionId: string) {
    try {
      const institution = await this.queryBus.execute<
        FindInstitutionByIdQuery,
        Institution
      >(new FindInstitutionByIdQuery(reqUserId, institutionId))

      const valuation =
        await this.valuationService.calculateInstitutionValuation(
          institution._id.toString()
        )
      return {
        ...(institution.toObject?.() ?? institution),
        presentValuation: valuation,
      }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @OnEvent(EventMap.FindInstitutionByName)
  async findInstitutionByName(reqUserId: string, institutionName: string) {
    try {
      const institution = await this.queryBus.execute<
        FindInstitutionByNameQuery,
        Institution
      >(new FindInstitutionByNameQuery(reqUserId, institutionName))

      const valuation =
        await this.valuationService.calculateInstitutionValuation(
          institution._id.toString()
        )
      return {
        ...(institution.toObject?.() ?? institution),
        presentValuation: valuation,
      }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async updateInstitutionById(
    userId: string,
    institutionId: string,
    requestBody: CreateInstitutionRequestDto
  ) {
    try {
      return await this.commandBus.execute<
        UpdateInstitutionCommand,
        Institution
      >(new UpdateInstitutionCommand(userId, institutionId, requestBody))
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  async deleteInstitution(reqUserId: string, institutionId: string) {
    try {
      const { userId } = await this.queryBus.execute<
        FindInstitutionByIdQuery,
        Institution
      >(new FindInstitutionByIdQuery(reqUserId, institutionId))
      if (userId.toString() === reqUserId) {
        await this.commandBus.execute(
          new DeleteInstitutionCommand(institutionId)
        )
        return { success: true }
      } else {
        throw new BadRequestException(statusMessages.connectionError)
      }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }
}
