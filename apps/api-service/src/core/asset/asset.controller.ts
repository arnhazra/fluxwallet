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
} from "@nestjs/common"
import { AssetService } from "./asset.service"
import { statusMessages } from "@/shared/constants/status-messages"
import { TokenGuard } from "@/shared/auth/token.guard"
import { ModRequest } from "@/shared/auth/types/mod-request.interface"
import { CreateAssetRequestDto } from "./dto/request/create-asset.request.dto"

@Controller("asset")
export class AssetController {
  constructor(private readonly service: AssetService) {}

  @UseGuards(TokenGuard)
  @Post()
  async createAsset(
    @Body() requestBody: CreateAssetRequestDto,
    @Request() request: ModRequest
  ) {
    try {
      return await this.service.createAsset(request.user.userId, requestBody)
    } catch (error) {
      throw error
    }
  }

  @UseGuards(TokenGuard)
  @Get("institution/:institutionId")
  async findMyAssetsByInstitutionId(
    @Request() request: ModRequest,
    @Param() params: any
  ) {
    try {
      return await this.service.findMyAssetsByInstitutionId(
        request.user.userId,
        params.institutionId
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @UseGuards(TokenGuard)
  @Get("/:assetId")
  async findAssetById(@Request() request: ModRequest, @Param() params: any) {
    try {
      return await this.service.findAssetById(
        request.user.userId,
        params.assetId
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @UseGuards(TokenGuard)
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
      throw error
    }
  }

  @UseGuards(TokenGuard)
  @Delete("/:assetId")
  async deleteAsset(@Request() request: ModRequest, @Param() params: any) {
    try {
      return await this.service.deleteAsset(request.user.userId, params.assetId)
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }
}
