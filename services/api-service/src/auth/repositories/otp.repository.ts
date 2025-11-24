import { Injectable } from "@nestjs/common"
import { GeneralDbConnectionMap } from "@/shared/constants/db-connection.map"
import {
  EntityModel,
  EntityRepository,
  InjectEntityModel,
} from "@/shared/entity/entity.repository"
import { OneTimePassword } from "../schemas/otp.schema"

@Injectable()
export class OTPRepository extends EntityRepository<OneTimePassword> {
  constructor(
    @InjectEntityModel(OneTimePassword.name, GeneralDbConnectionMap.Auth)
    private otpModel: EntityModel<OneTimePassword>
  ) {
    super(otpModel)
  }
}
