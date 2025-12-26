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
import { SpaceService } from "./space.service"
import { statusMessages } from "@/shared/constants/status-messages"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"
import { CreateSpaceRequestDto } from "./dto/request/create-space.request.dto"

@Controller("apps/wealthanalyzer/space")
export class SpaceController {
  constructor(private readonly service: SpaceService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createSpace(
    @Body() requestBody: CreateSpaceRequestDto,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.createSpace(request.user.userId, requestBody)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findMySpaces(
    @Request() request: ModRequest,
    @Query("searchKeyword") searchKeyword?: string
  ) {
    try {
      return await this.service.findMySpaces(request.user.userId, searchKeyword)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Get("/:spaceId")
  async findSpaceById(
    @Request() request: ModRequest,
    @Param("spaceId") spaceId: string
  ) {
    try {
      const space = await this.service.findSpaceById(
        request.user.userId,
        spaceId
      )
      if (!space) throw new Error()
      return space
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Put(":spaceId")
  async updateSpaceById(
    @Body() requestBody: CreateSpaceRequestDto,
    @Param("spaceId") spaceId: string,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.updateSpaceById(
        request.user.userId,
        spaceId,
        requestBody
      )
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Delete("/:spaceId")
  async deleteSpace(
    @Request() request: ModRequest,
    @Param("spaceId") spaceId: string
  ) {
    try {
      return await this.service.deleteSpace(request.user.userId, spaceId)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }
}
