import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetOTPQuery } from "../impl/get-otp.query"
import { OTPRepository } from "@/auth/repositories/otp.repository"

@QueryHandler(GetOTPQuery)
export class GetOTPQueryHandler implements IQueryHandler<GetOTPQuery> {
  constructor(private readonly repository: OTPRepository) {}

  async execute(query: GetOTPQuery) {
    const { email } = query
    return await this.repository.findOne({ email })
  }
}
