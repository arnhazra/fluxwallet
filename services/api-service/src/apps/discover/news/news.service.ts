import { Injectable } from "@nestjs/common"
import { NewsResponseDto } from "./dto/news-response.dto"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import { config } from "@/config"

@Injectable()
export class NewsService {
  constructor(private readonly httpService: HttpService) {}

  async getNewsArticles(): Promise<NewsResponseDto> {
    const response = await lastValueFrom(
      this.httpService.get<NewsResponseDto>(config.NEWS_API_URI)
    )
    return response.data
  }
}
