import { Injectable } from "@nestjs/common"
import { FinNewsResponseDto } from "./dto/finnews-response.dto"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import { config } from "@/config"
import { FinNewsStrategy } from "./finnews.strategy"

export interface NewsSummarizeReqParams {
  content: string | null | undefined
  description: string | null | undefined
  title: string | null | undefined
  temperature: number
  topP: number
}

@Injectable()
export class FinNewsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly strategy: FinNewsStrategy
  ) {}

  async getNewsArticles(): Promise<FinNewsResponseDto> {
    const response = await lastValueFrom(
      this.httpService.get<FinNewsResponseDto>(config.NEWS_API_URI)
    )
    return response.data
  }

  async summarize(summarizeDto: FinNewsSummarizerDto) {
    const { content, description, title } = summarizeDto
    try {
      const args: NewsSummarizeReqParams = {
        content,
        description,
        title,
        temperature: 1.0,
        topP: 1.0,
      }

      const { response } = await this.strategy.newsSummarizeStrategy(args)
      return { response }
    } catch (error) {
      throw error
    }
  }
}
