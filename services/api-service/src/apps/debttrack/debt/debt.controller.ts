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
import { DebtService } from "./debt.service"
import { statusMessages } from "@/shared/constants/status-messages"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"
import { CreateDebtRequestDto } from "./dto/request/create-debt.request.dto"

@Controller("apps/debttrack/debt")
export class DebtController {
  constructor(private readonly service: DebtService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createDebt(
    @Body() requestBody: CreateDebtRequestDto,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.createDebt(request.user.userId, requestBody)
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findMyDebts(
    @Request() request: ModRequest,
    @Query("searchKeyword") searchKeyword?: string
  ) {
    try {
      return await this.service.findMyDebts(request.user.userId, searchKeyword)
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @UseGuards(AuthGuard)
  @Get("/:debtId")
  async findDebtById(@Request() request: ModRequest, @Param() params: any) {
    try {
      return await this.service.findDebtById(request.user.userId, params.debtId)
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @UseGuards(AuthGuard)
  @Put(":debtId")
  async updateDebtById(
    @Body() requestBody: CreateDebtRequestDto,
    @Param() params: any,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.updateDebtById(
        request.user.userId,
        params.debtId,
        requestBody
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @UseGuards(AuthGuard)
  @Delete("/:debtId")
  async deleteDebt(@Request() request: ModRequest, @Param() params: any) {
    try {
      return await this.service.deleteDebt(request.user.userId, params.debtId)
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @UseGuards(AuthGuard)
  @Post("total-debt")
  async calculateTotalDebt(@Request() request: ModRequest) {
    try {
      const { remainingDebt, totalEMI, totalPrincipal } =
        await this.service.calculateTotalDebt(request.user.userId)
      return { remainingDebt, totalEMI, totalPrincipal }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }
}
