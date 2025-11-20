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
import { AssetService } from "./asset.service"
import { statusMessages } from "@/shared/constants/status-messages"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"
import { CreateAssetRequestDto } from "./dto/request/create-asset.request.dto"

@Controller("apps/wealthanalyzer/asset")
export class AssetController {
  constructor(private readonly service: AssetService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createAsset(
    @Body() requestBody: CreateAssetRequestDto,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.createAsset(request.user.userId, requestBody)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Get("space/:spaceId")
  async findMyAssetsBySpaceId(
    @Request() request: ModRequest,
    @Param() params: any,
    @Query("searchKeyword") searchKeyword?: string
  ) {
    try {
      return await this.service.findMyAssetsBySpaceId(
        request.user.userId,
        params.spaceId,
        searchKeyword
      )
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Get("/:assetId")
  async findAssetById(@Request() request: ModRequest, @Param() params: any) {
    try {
      return await this.service.findAssetById(
        request.user.userId,
        params.assetId
      )
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Put(":assetId")
  async updateAssetById(
    @Body() requestBody: CreateAssetRequestDto,
    @Param() params: any,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.updateAssetById(
        request.user.userId,
        params.assetId,
        requestBody
      )
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Delete("/:assetId")
  async deleteAsset(@Request() request: ModRequest, @Param() params: any) {
    try {
      return await this.service.deleteAsset(request.user.userId, params.assetId)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Post("total-wealth")
  async calculateTotalWealth(@Request() request: ModRequest) {
    try {
      const presentValuation = await this.service.calculateTotalWealth(
        request.user.userId
      )
      return { presentValuation }
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }
}
