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
    @Param("spaceId") spaceId: string,
    @Query("searchKeyword") searchKeyword?: string
  ) {
    try {
      return await this.service.findMyAssetsBySpaceId(
        request.user.userId,
        spaceId,
        searchKeyword
      )
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Post("findassetsbytype")
  async findAssetsByType(
    @Request() request: ModRequest,
    @Body("assetTypes") assetTypes: string[]
  ) {
    try {
      return await this.service.findAssetsByTypes(
        request.user.userId,
        assetTypes
      )
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }

  @UseGuards(AuthGuard)
  @Get("/:assetId")
  async findAssetById(
    @Request() request: ModRequest,
    @Param("assetId") assetId: string
  ) {
    try {
      return await this.service.findAssetById(request.user.userId, assetId)
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
    @Param("assetId") assetId: string,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.updateAssetById(
        request.user.userId,
        assetId,
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
  async deleteAsset(
    @Request() request: ModRequest,
    @Param("assetId") assetId: string
  ) {
    try {
      return await this.service.deleteAsset(request.user.userId, assetId)
    } catch (error) {
      throw new BadRequestException(
        error.message || statusMessages.connectionError
      )
    }
  }
}
