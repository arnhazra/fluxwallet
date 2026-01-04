import {
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  Request,
  Param,
  Body,
  BadRequestException,
} from "@nestjs/common"
import { EventService } from "./event.service"
import { statusMessages } from "@/shared/constants/status-messages"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"
import { CreateEventRequestDto } from "./dto/request/create-event.request.dto"

@Controller("apps/planner/event")
export class EventController {
  constructor(private readonly service: EventService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createEvent(
    @Body() requestBody: CreateEventRequestDto,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.createEvent(request.user.userId, requestBody)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Get("/:selectedMonth")
  async findMyEventsByMonth(
    @Request() request: ModRequest,
    @Param("selectedMonth") selectedMonth: string
  ) {
    try {
      return await this.service.findMyEventsByMonth(
        request.user.userId,
        selectedMonth
      )
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Delete("/:eventId")
  async deleteEvent(
    @Request() request: ModRequest,
    @Param("eventId") eventId: string
  ) {
    try {
      return await this.service.deleteEvent(request.user.userId, eventId)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }
}
