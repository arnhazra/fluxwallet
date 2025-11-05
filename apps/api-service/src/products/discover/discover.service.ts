import { Injectable } from "@nestjs/common"
import { DiscoverResponseDto } from "./dto/discover-response.dto"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import { config } from "@/config"

@Injectable()
export class DiscoverService {
  constructor(private readonly httpService: HttpService) {}

  async getNewsArticles(): Promise<DiscoverResponseDto> {
    const response = await lastValueFrom(
      this.httpService.get<DiscoverResponseDto>(config.NEWS_API_URI)
    )
    return response.data
  }
}
