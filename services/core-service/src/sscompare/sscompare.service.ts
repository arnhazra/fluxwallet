import { Injectable } from "@nestjs/common"
import { HumanMessage } from "langchain"
import { LLMService } from "@/shared/llm/llm.service"

@Injectable()
export class TaxAdvisorService {
  constructor(private readonly llmService: LLMService) {}

  async compareScreenshots(
    baseScreenshot: Express.Multer.File,
    actualScreenshot: Express.Multer.File
  ) {
    try {
      const prompt = `You are an expert UI reviewer. Compare the following two screenshots and provide a detailed analysis of the differences, similarities, and any issues you notice.`

      const messages = [
        new HumanMessage({
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${baseScreenshot.mimetype};base64,${baseScreenshot.buffer.toString("base64")}`,
              },
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${actualScreenshot.mimetype};base64,${actualScreenshot.buffer.toString("base64")}`,
              },
            },
          ],
        }),
      ]

      const llm = this.llmService.getLLM()

      const response = await llm.invoke(messages)

      return { response: response.content }
    } catch (error) {
      throw error
    }
  }
}
