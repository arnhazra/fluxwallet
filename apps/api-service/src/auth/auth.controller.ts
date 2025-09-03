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
import { AuthService } from "./auth.service"
import { RequestOTPDto } from "./dto/request-otp.dto"
import { VerifyOTPDto } from "./dto/validate-otp.dto"
import { statusMessages } from "@/shared/constants/status-messages"
import { AuthGuard, ModRequest } from "@/auth/auth.guard"
import { UpdateAttributeDto } from "./dto/update-attribute.dto"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/utils/event.map"
import { GoogleOAuthDto } from "./dto/google-oauth.dto"
import { blockListedAttributes } from "./utils/blocklisted-attribute"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post("googleoauth")
  async googleOAuth(@Body() googleOAuthDto: GoogleOAuthDto) {
    try {
      const response = await this.service.googleOAuth(googleOAuthDto)
      const { accessToken, refreshToken, user, success } = response

      if (success) {
        return { accessToken, refreshToken, user }
      } else {
        throw new BadRequestException(statusMessages.invalidOTP)
      }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @Post("requestotp")
  async requestOTP(@Body() requestOTPDto: RequestOTPDto) {
    try {
      const { user } = await this.service.requestOTP(requestOTPDto)
      if (!user) return { message: statusMessages.otpEmail, newUser: true }
      return { message: statusMessages.otpEmail, newUser: false }
    } catch (error) {
      throw new BadRequestException(statusMessages.connectionError)
    }
  }

  @Post("validateotp")
  async validateOTP(@Body() validateOTPDto: VerifyOTPDto) {
    try {
      const response = await this.service.validateOTP(validateOTPDto)
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
        await this.service.getUserDetails(request.user.userId)

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
      await this.service.signOut(request.user.userId)
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
      if (blockListedAttributes.includes(attributeName)) {
        throw new BadRequestException()
      }
      return await this.service.updateAttribute(
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
      const { user } = await this.service.getUserDetails(request.user.userId)

      if (!user.hasTrial) {
        throw new Error(statusMessages.trialActivated)
      }

      await this.eventEmitter.emitAsync(
        EventMap.ActivateTrial,
        request.user.userId
      )

      await this.service.updateAttribute(request.user.userId, "hasTrial", false)

      return { success: true }
    } catch (error) {
      throw new BadRequestException(error.message || statusMessages.invalidUser)
    }
  }
}
