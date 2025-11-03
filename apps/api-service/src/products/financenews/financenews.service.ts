import { Injectable } from "@nestjs/common"
import { FinanceNewsResponseDto } from "./dto/financenews-response.dto"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import { config } from "@/config"

@Injectable()
export class FinanceNewsService {
  constructor(private readonly httpService: HttpService) {}

  async getNewsArticles(): Promise<FinanceNewsResponseDto> {
    const response = await lastValueFrom(
      this.httpService.get<FinanceNewsResponseDto>(config.NEWS_API_URI)
    )
    return response.data
  }
}
