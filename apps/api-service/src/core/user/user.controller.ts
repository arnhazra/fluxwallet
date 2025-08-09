import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Patch,
  Request,
  UseGuards,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { GenerateOTPDto } from "./dto/generate-otp.dto"
import { VerifyOTPDto } from "./dto/validate-otp.dto"
import { statusMessages } from "@/shared/constants/status-messages"
import { AuthGuard } from "@/shared/auth/auth.guard"
import { ModRequest } from "@/shared/auth/types/mod-request.interface"
import { UpdateAttributeDto } from "./dto/update-attribute.dto"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/utils/event.map"

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post("generateotp")
  async generateOTP(@Body() generateOTPDto: GenerateOTPDto) {
    try {
      const { user, hash } = await this.userService.generateOTP(generateOTPDto)
      if (!user)
        return { hash, message: statusMessages.otpEmail, newUser: true }
      return { hash, message: statusMessages.otpEmail, newUser: false }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @Post("validateotp")
  async validateOTP(@Body() validateOTPDto: VerifyOTPDto) {
    try {
      const response = await this.userService.verifyOTP(validateOTPDto)
      const { accessToken, refreshToken, user } = response

      if (response.success) {
        return { accessToken, refreshToken, user }
      } else {
        throw new BadRequestException(statusMessages.invalidOTP)
      }
    } catch (error) {
      throw error
    }
  }

  @UseGuards(AuthGuard)
  @Get("userdetails")
  async getUserDetails(@Request() request: ModRequest) {
    try {
      const { user, subscription, isSubscriptionActive } =
        await this.userService.getUserDetails(request.user.userId)

      if (user) {
        return { user, subscription, isSubscriptionActive }
      } else {
        throw new BadRequestException(statusMessages.invalidUser)
      }
    } catch (error) {
      throw new BadRequestException(statusMessages.invalidUser)
    }
  }

  @UseGuards(AuthGuard)
  @Post("signout")
  async signOut(@Request() request: ModRequest) {
    try {
      await this.userService.signOut(request.user.userId)
      return { message: statusMessages.signOutSuccess }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @UseGuards(AuthGuard)
  @Patch("attribute")
  async updateAttribute(
    @Request() request: ModRequest,
    @Body() updateAttributeDto: UpdateAttributeDto
  ) {
    try {
      const { attributeName, attributeValue } = updateAttributeDto
      return await this.userService.updateAttribute(
        request.user.userId,
        attributeName,
        attributeValue
      )
    } catch (error) {
      throw new BadRequestException(statusMessages.invalidUser)
    }
  }

  @UseGuards(AuthGuard)
  @Post("activatetrial")
  async activateTrial(@Request() request: ModRequest) {
    try {
      const { user } = await this.userService.getUserDetails(
        request.user.userId
      )

      if (!user.hasTrial) {
        throw new Error()
      }

      await this.eventEmitter.emitAsync(
        EventMap.ActivateTrial,
        request.user.userId
      )

      await this.userService.updateAttribute(
        request.user.userId,
        "hasTrial",
        false
      )

      return { success: true }
    } catch (error) {
      throw new BadRequestException(statusMessages.invalidUser)
    }
  }
}
