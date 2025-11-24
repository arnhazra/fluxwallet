import { EventMap } from "@/shared/constants/event.map"
import { tool } from "langchain"
import { Injectable } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { z } from "zod"

@Injectable()
export class TaxAdvisorAgent {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public sendEmailTool = tool(
    async ({
      email,
      subject,
      body,
    }: {
      email: string
      subject: string
      body: string
    }) => {
      try {
        await this.eventEmitter.emitAsync(EventMap.SendEmail, {
          email,
          subject,
          body,
        })
        return "success"
      } catch (error) {
        return "failure"
      }
    },
    {
      name: "send_details_to_user_email",
      description: "Email the details to user as per user requirement",
      schema: z.object({
        email: z.string().describe("email of the user"),
        subject: z.string().describe("a valid email subject"),
        body: z.string().describe("an email body in HTML tabular format"),
      }),
    }
  )
}
