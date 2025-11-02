import { GetCountDto } from "../../dto/get-count.dto"

export class GetAnalyticsQuery {
  constructor(public readonly getCountDto: GetCountDto) {}
}
