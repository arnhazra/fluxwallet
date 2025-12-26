import { Controller, BadRequestException, Get, Param } from "@nestjs/common"
import { EmailService } from "./email.service"
import { statusMessages } from "@/shared/constants/status-messages"

@Controller("platform/email")
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @Get("")
  async sendEmail() {
    try {
      return await this.service.sendEmail({
        body: "Hello",
        subject: "World",
        email: "arnhazra@gmail.com",
      })
    } catch (error) {
      throw new BadRequestException(statusMessages.configNotFound)
    }
  }
}
