import { Controller } from "@nestjs/common"
import { EmailService } from "./email.service"
import { SendEmailDto } from "./dto/send-email.dto"
import { OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/utils/event.map"

@Controller()
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @OnEvent(EventMap.SendEmail)
  async sendEmail(sendEmailDto: SendEmailDto) {
    await this.service.sendEmail(sendEmailDto)
  }
}
