import {
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  Request,
  Param,
  Body,
  Put,
  BadRequestException,
} from "@nestjs/common"
import { GoalService } from "./goal.service"
import { statusMessages } from "@/shared/constants/status-messages"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"
import { CreateGoalRequestDto } from "./dto/request/create-goal.request.dto"

@Controller("apps/wealthgoal/goal")
export class GoalController {
  constructor(private readonly service: GoalService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createGoal(
    @Body() requestBody: CreateGoalRequestDto,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.createGoal(request.user.userId, requestBody)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findMyGoals(@Request() request: ModRequest) {
    try {
      return await this.service.findMyGoals(request.user.userId)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Get("nearest")
  async findNearestGoal(@Request() request: ModRequest) {
    try {
      return await this.service.findNearestGoal(request.user.userId)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Get("/:goalId")
  async findGoalById(@Request() request: ModRequest, @Param() params: any) {
    try {
      return await this.service.findGoalById(request.user.userId, params.goalId)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Put(":goalId")
  async updateGoalById(
    @Body() requestBody: CreateGoalRequestDto,
    @Param() params: any,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.updateGoalById(
        request.user.userId,
        params.goalId,
        requestBody
      )
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Delete("/:goalId")
  async deleteGoal(@Request() request: ModRequest, @Param() params: any) {
    try {
      return await this.service.deleteGoal(request.user.userId, params.goalId)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }
}
