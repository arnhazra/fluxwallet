import { Injectable } from "@nestjs/common"
import { SendEmailDto } from "./dto/send-email.dto"
import * as nodemailer from "nodemailer"
import { google } from "googleapis"
import { config } from "../../config"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import { statusMessages } from "@/shared/constants/status-messages"
import { OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/constants/event.map"

@Injectable()
export class EmailService {
  @OnEvent(EventMap.SendEmail)
  async sendEmail(sendEmailDto: SendEmailDto) {
    try {
      const { email, subject, body } = sendEmailDto
      const {
        GCP_MAILER_CLIENT_ID,
        GCP_MAILER_CLIENT_SECRET,
        GCP_MAILER_REDIRECT_URI,
        GCP_MAILER_FROM_EMAIL,
        GCP_MAILER_REFRESH_TOKEN,
      } = config
      const oAuth2Client = new google.auth.OAuth2(
        GCP_MAILER_CLIENT_ID,
        GCP_MAILER_CLIENT_SECRET,
        GCP_MAILER_REDIRECT_URI
      )
      oAuth2Client.setCredentials({ refresh_token: GCP_MAILER_REFRESH_TOKEN })
      const accessToken = await oAuth2Client.getAccessToken()

      const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
        nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            type: "OAuth2",
            user: GCP_MAILER_FROM_EMAIL,
            accessToken: accessToken.token,
          },
        })

      await transporter.sendMail({
        from: GCP_MAILER_FROM_EMAIL,
        to: email,
        subject,
        html: body,
      })
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }
}
