import {
  Controller,
  Post,
  BadRequestException,
  Get,
  Delete,
  UseGuards,
  Request,
  Param,
  Body,
  Put,
  Query,
} from "@nestjs/common"
import { InstitutionService } from "./institution.service"
import { statusMessages } from "@/shared/constants/status-messages"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"
import { CreateInstitutionRequestDto } from "./dto/request/create-institution.request.dto"

@Controller("institution")
export class InstitutionController {
  constructor(private readonly service: InstitutionService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createInstitution(
    @Body() requestBody: CreateInstitutionRequestDto,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.createInstitution(
        request.user.userId,
        requestBody
      )
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findMyInstitutions(
    @Request() request: ModRequest,
    @Query("searchKeyword") searchKeyword?: string
  ) {
    try {
      return await this.service.findMyInstitutions(
        request.user.userId,
        searchKeyword
      )
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Get("/:institutionId")
  async findInstitutionById(
    @Request() request: ModRequest,
    @Param() params: any
  ) {
    try {
      const institution = await this.service.findInstitutionById(
        request.user.userId,
        params.institutionId
      )
      if (!institution) throw new Error()
      return institution
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Put(":institutionId")
  async updateInstitutionById(
    @Body() requestBody: CreateInstitutionRequestDto,
    @Param() params: any,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.updateInstitutionById(
        request.user.userId,
        params.institutionId,
        requestBody
      )
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Delete("/:institutionId")
  async deleteInstitution(
    @Request() request: ModRequest,
    @Param() params: any
  ) {
    try {
      return await this.service.deleteInstitution(
        request.user.userId,
        params.institutionId
      )
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }
}
