import {
  Controller,
  Post,
  BadRequestException,
  Body,
  UseGuards,
} from "@nestjs/common"
import { ActivityService } from "./activity.service"
import { CreateActivityDto } from "./dto/create-activity.dto"
import { EventMap } from "../../shared/utils/event.map"
import { OnEvent } from "@nestjs/event-emitter"
import { GetCountDto } from "./dto/get-count.dto"
import { AuthGuard } from "@/shared/auth/auth.guard"

@Controller("activity")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @OnEvent(EventMap.CreateActivity)
  createActivity(createActivityDto: CreateActivityDto) {
    this.activityService.createActivity(createActivityDto)
  }

  @UseGuards(AuthGuard)
  @Post("trends")
  async getActivityCount(@Body() getCountDto: GetCountDto) {
    try {
      return await this.activityService.getActivityCount(getCountDto)
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
