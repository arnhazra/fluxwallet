import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"
import { Model } from "mongoose"
import { EntityRepository } from "@/shared/entity/entity.repository"
import { OneTimePassword } from "../schemas/otp.schema"

@Injectable()
export class OTPRepository extends EntityRepository<OneTimePassword> {
  constructor(
    @InjectModel(OneTimePassword.name, DbConnectionMap.Primary)
    private otpModel: Model<OneTimePassword>
  ) {
    super(otpModel)
  }
}
