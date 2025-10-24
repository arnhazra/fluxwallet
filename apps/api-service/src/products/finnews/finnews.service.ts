import { Injectable } from "@nestjs/common"
import { FinNewsResponseDto } from "./dto/finnews-response.dto"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import { config } from "@/config"

@Injectable()
export class FinNewsService {
  constructor(private readonly httpService: HttpService) {}

  async getNewsArticles(): Promise<FinNewsResponseDto> {
    const response = await lastValueFrom(
      this.httpService.get<FinNewsResponseDto>(config.NEWS_API_URI)
    )
    return response.data
  }
}
